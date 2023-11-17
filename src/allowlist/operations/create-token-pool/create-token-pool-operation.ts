import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { AllowlistState } from '../../state-types/allowlist-state';
import { TokenPoolParams } from '../../state-types/token-pool';
import { BadInputError } from '../../bad-input.error';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { isValidTokenIds, parseTokenIds } from '../../../utils/app.utils';
import { AllowlistOperationCode } from '../../allowlist-operation-code';
import { AlchemyService } from '../../../services/alchemy.service';
import { CollectionOwner } from '../../../services/collection-owner';
import { TransfersService } from '../../../services/transfers.service';
import { TokenOwnership } from '../../state-types/token-ownership';
import { EtherscanService } from '../../../services/etherscan.service';
import { ContractSchema } from '../../../app-types';
import { TokenPoolService } from '../../../services/token-pool.service';
import { SeizeApi } from '../../../services/seize/seize.api';
import { WalletScreener } from '../../../services/screening/wallet.screener';

export class CreateTokenPoolOperation implements AllowlistOperationExecutor {
  private logger: Logger;

  constructor(
    loggerFactory: LoggerFactory,
    private readonly alchemyService: AlchemyService,
    private readonly transfersService: TransfersService,
    private readonly tokenPoolService: TokenPoolService,
    private readonly etherscan: EtherscanService,
    private readonly seizeApi: SeizeApi,
    private readonly walletScreener: WalletScreener,
  ) {
    this.logger = loggerFactory.create(CreateTokenPoolOperation.name);
  }

  validate(params: any): params is TokenPoolParams {
    this.assertIdValid(params);
    this.assertContractValid(params);
    this.assertBlockNoValid(params);
    this.assertConsolidateBlockNoValid(params);
    this.assertTokenIdsValid(params);

    return true;
  }

  private assertTokenIdsValid(params: any) {
    if (
      params.hasOwnProperty('tokenIds') &&
      params.tokenIds !== null &&
      params.tokenIds !== undefined &&
      typeof params.tokenIds !== 'string'
    ) {
      throw new BadInputError('Invalid tokenIds');
    }

    if (typeof params.tokenIds === 'string' && !params.tokenIds.length) {
      throw new BadInputError('Invalid tokenIds');
    }

    if (
      typeof params.tokenIds === 'string' &&
      params.tokenIds.length &&
      !isValidTokenIds(params.tokenIds)
    ) {
      throw new BadInputError('Invalid tokenIds');
    }
  }

  private assertConsolidateBlockNoValid(params: any) {
    if (!params.hasOwnProperty('consolidateBlockNo')) {
      throw new BadInputError('Missing consolidateBlockNo');
    }

    if (
      typeof params.consolidateBlockNo !== 'number' &&
      params.consolidateBlockNo !== null
    ) {
      throw new BadInputError('Invalid consolidateBlockNo');
    }

    if (params.consolidateBlockNo < 0) {
      throw new BadInputError('Invalid consolidateBlockNo');
    }

    if (params.consolidateBlockNo % 1 !== 0) {
      throw new BadInputError('Invalid consolidateBlockNo');
    }
  }

  private assertBlockNoValid(params: any) {
    if (params.blockNo === undefined || params.blockNo === null) {
      throw new BadInputError('Invalid blockNo');
    }

    if (typeof params.blockNo !== 'number') {
      throw new BadInputError('Invalid blockNo');
    }

    if (params.blockNo < 0) {
      throw new BadInputError('Invalid blockNo');
    }

    if (params.blockNo % 1 !== 0) {
      throw new BadInputError('Invalid blockNo');
    }
  }

  private assertContractValid(params: any) {
    if (!params.hasOwnProperty('contract')) {
      throw new BadInputError('Missing contract');
    }

    if (typeof params.contract !== 'string') {
      throw new BadInputError('Invalid contract');
    }

    if (!params.contract.length) {
      throw new BadInputError('Invalid contract');
    }

    if (!params.hasOwnProperty('contract')) {
      throw new BadInputError('Missing contract');
    }
  }

  private assertIdValid(params: any) {
    if (!params.hasOwnProperty('id')) {
      throw new BadInputError('Missing id');
    }

    if (typeof params.id !== 'string') {
      throw new BadInputError('Invalid id');
    }

    if (!params.id.length) {
      throw new BadInputError('Invalid id');
    }
  }

  async execute(p: { params: any; state: AllowlistState }) {
    const { params, state } = p;
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
    const { id, tokenIds, consolidateBlockNo, contract, blockNo } = params;
    const allTokens = (await this.getTokens({ params, state })).filter(
      (token) =>
        !['0x0000000000000000000000000000000000000000'].includes(token.owner),
    );
    const allOwners = allTokens.map((token) => token.owner);
    const sanctionedProfiles =
      await this.walletScreener.getProfilesForSanctionedWallets({
        walletsToScreen: allOwners,
      });
    const sanctionedWallets = Object.keys(sanctionedProfiles);
    const tokens = allTokens.filter((token) => {
      const isSanctioned = sanctionedWallets.includes(token.owner);
      if (isSanctioned) {
        const profile = sanctionedProfiles[token.owner];
        this.logger.warn(
          `Removing owner ${token.owner} from tokenpool ${id} as the owner sanctioned by ${profile.listProvider}. Profile: ${profile.profile}`,
        );
      }
      return !isSanctioned;
    });

    state.tokenPools[id] = {
      id,
      name: params.name,
      description: params.description,
      tokens:
        consolidateBlockNo && consolidateBlockNo > 0
          ? await this.seizeApi.consolidate({
              blockNo: consolidateBlockNo,
              tokens,
            })
          : tokens,
      tokenIds,
      contract,
      blockNo,
      consolidateBlockNo,
    };

    this.logger.info(`Tokenpool ${id} created`);
  }

  private async getTokens(p: {
    params: TokenPoolParams;
    state: AllowlistState;
  }): Promise<TokenOwnership[]> {
    const { params } = p;
    const { id, contract, tokenIds } = params;
    const savedTokenPoolTokens = await this.tokenPoolService.getTokenPoolTokens(
      id,
    );
    if (savedTokenPoolTokens?.length) {
      return savedTokenPoolTokens;
    } else {
      const parsedTokenIds = parseTokenIds(
        tokenIds,
        id,
        AllowlistOperationCode.CREATE_TOKEN_POOL,
      );

      const contractSchema = await this.etherscan.getContractSchema({
        contractAddress: contract,
      });

      if (!contractSchema) {
        throw new BadInputError('Invalid contract');
      }

      if (contractSchema === ContractSchema.ERC721Old) {
        this.logger.info(
          `Contract ${contract} is ERC721Old. Will fall back to transfer pool based token pool creation`,
        );
        return await this.getTokensFromTransferPool({
          ...p,
          tokenIds: parsedTokenIds,
        });
      } else {
        try {
          return await this.getTokensFromArchiveNode({
            ...p,
            tokenIds: parsedTokenIds,
          });
        } catch (e) {
          console.error(e);
          this.logger.error(
            `Error creating tokenpool ${id}: ${e.message}. Will fall back to transfer pool based token pool creation`,
          );
          return await this.getTokensFromTransferPool({
            ...p,
            tokenIds: parsedTokenIds,
          });
        }
      }
    }
  }

  private async getTokensFromArchiveNode(p: {
    params: TokenPoolParams;
    state: AllowlistState;
    tokenIds: string[] | null;
  }): Promise<TokenOwnership[]> {
    const { params, tokenIds } = p;
    const { contract, blockNo } = params;
    const collectionOwners =
      await this.alchemyService.getCollectionOwnersInBlock({
        contract,
        block: blockNo,
      });
    return collectionOwners
      .map<CollectionOwner>((owner) => ({
        ...owner,
        tokens: owner.tokens.filter(
          (token) => !tokenIds?.length || tokenIds.includes(token.tokenId),
        ),
      }))
      .filter((owner) => owner.tokens.length > 0)
      .map((owner) =>
        owner.tokens.map((token) =>
          Array.from({ length: token.balance }, () => ({
            id: token.tokenId,
            owner: owner.ownerAddress,
            contract,
          })),
        ),
      )
      .flat(2);
  }

  private async getTokensFromTransferPool(p: {
    params: TokenPoolParams;
    state: AllowlistState;
    tokenIds: string[] | null;
  }): Promise<TokenOwnership[]> {
    const { params } = p;
    const { contract, tokenIds, blockNo } = params;
    const transfers = await this.transfersService.getCollectionTransfers({
      contract,
      blockNo,
    });
    const tokenToOwningWallets = transfers
      .filter((transfer) => transfer.amount <= 1000000)
      .reduce((acc, transfer) => {
        if (!tokenIds?.length || tokenIds.includes(transfer.tokenID)) {
          if (!acc[transfer.tokenID]) {
            acc[transfer.tokenID] = [];
          }
          const amount = transfer.amount;
          for (let i = 0; i < amount; i++) {
            acc[transfer.tokenID].push({
              wallet: transfer.to,
            });
          }
          let amountLeft = amount;
          for (let i = acc[transfer.tokenID].length - 1; i >= 0; i--) {
            const owner = acc[transfer.tokenID][i];
            if (owner.wallet === transfer.from) {
              acc[transfer.tokenID].splice(i, 1);
              amountLeft--;
              if (amountLeft === 0) {
                break;
              }
            }
          }
        }
        return acc;
      }, {} as Record<string, { wallet: string }[]>);
    return Object.entries(tokenToOwningWallets).flatMap(
      ([tokenId, tokenOwnerships]) =>
        tokenOwnerships.map(({ wallet }) => ({
          id: tokenId,
          owner: wallet,
          contract,
        })),
    );
  }
}
