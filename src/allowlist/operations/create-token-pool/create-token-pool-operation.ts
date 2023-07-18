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

export class CreateTokenPoolOperation implements AllowlistOperationExecutor {
  private logger: Logger;

  constructor(
    loggerFactory: LoggerFactory,
    private readonly alchemyService: AlchemyService,
    private readonly transfersService: TransfersService,
  ) {
    this.logger = loggerFactory.create(CreateTokenPoolOperation.name);
  }

  validate(params: any): params is TokenPoolParams {
    if (!params.hasOwnProperty('id')) {
      throw new BadInputError('Missing id');
    }

    if (typeof params.id !== 'string') {
      throw new BadInputError('Invalid id');
    }

    if (!params.id.length) {
      throw new BadInputError('Invalid id');
    }

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

    if (params.blockNo === undefined || params.blockNo === null) {
      throw new BadInputError('Invalid blockNo');
    }

    if (typeof params.blockNo !== 'number') {
      throw new BadInputError('Invalid blockNo');
    }

    if (params.blockNo < 0) {
      throw new BadInputError('Invalid blockNo');
    }

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

    return true;
  }

  async execute(p: { params: TokenPoolParams; state: AllowlistState }) {
    const { params, state } = p;
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
    const { id, contract, tokenIds, blockNo } = params;
    const parsedTokenIds = parseTokenIds(
      tokenIds,
      id,
      AllowlistOperationCode.CREATE_TOKEN_POOL,
    );

    try {
      const collectionOwners =
        await this.alchemyService.getCollectionOwnersInBlock({
          contract,
          block: blockNo,
        });
      const tokenOwnerships = collectionOwners
        .map<CollectionOwner>((owner) => ({
          ...owner,
          tokens: owner.tokens.filter(
            (token) =>
              !tokenIds?.length || parsedTokenIds.includes(token.tokenId),
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
      state.tokenPools[id] = { ...params, tokens: tokenOwnerships };
    } catch (e) {
      console.error(e);
      this.logger.error(
        `Error creating tokenpool ${id}: ${e.message}. Will fall back to transfer pool based token pool creation`,
      );
      await this.buildTokenPoolFromTransferPool({
        ...p,
        tokenIds: parsedTokenIds,
      });
      this.logger.info(
        `Managed to build tokenpool ${id} with transfer pool strategy`,
      );
    }
    this.logger.info(`Tokenpool ${id} created`);
  }

  private async buildTokenPoolFromTransferPool(p: {
    params: TokenPoolParams;
    state: AllowlistState;
    tokenIds: string[] | null;
  }) {
    const { params, state } = p;
    const { id, contract, tokenIds, blockNo } = params;
    const transfers = await this.transfersService.getCollectionTransfers({
      contract,
      blockNo,
    });
    const tokenToOwningWallets = transfers.reduce((acc, transfer) => {
      if (!tokenIds || tokenIds.includes(transfer.tokenID)) {
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
    const tokenOwnerships: TokenOwnership[] = Object.entries(
      tokenToOwningWallets,
    ).flatMap(([tokenId, tokenOwnerships]) =>
      tokenOwnerships.map(({ wallet }) => ({
        id: tokenId,
        owner: wallet,
        contract,
      })),
    );
    state.tokenPools[id] = { ...params, tokens: tokenOwnerships };
  }
}
