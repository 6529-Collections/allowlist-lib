import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { AllowlistState } from '../../state-types/allowlist-state';
import { TokenPoolRawParams } from '../../state-types/token-pool';
import { BadInputError } from '../../bad-input.error';
import { TokenOwnership } from '../../state-types/token-ownership';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { isValidTokenIds, parseTokenIds } from '../../../utils/app.utils';
import { AllowlistOperationCode } from '../../allowlist-operation-code';

export class CreateTokenPoolRawOperation implements AllowlistOperationExecutor {
  private logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(CreateTokenPoolRawOperation.name);
  }

  validate(params: any): params is TokenPoolRawParams {
    if (!params.hasOwnProperty('id')) {
      throw new BadInputError('Missing id');
    }

    if (typeof params.id !== 'string') {
      throw new BadInputError('Invalid id');
    }

    if (!params.id.length) {
      throw new BadInputError('Invalid id');
    }

    if (!params.hasOwnProperty('transferPoolId')) {
      throw new BadInputError('Missing transferPoolId');
    }

    if (typeof params.transferPoolId !== 'string') {
      throw new BadInputError('Invalid transferPoolId');
    }

    if (!params.transferPoolId.length) {
      throw new BadInputError('Invalid transferPoolId');
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

  execute({
    params,
    state,
  }: {
    params: TokenPoolRawParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
    const { id, transferPoolId, tokenIds } = params;
    const transferPool = state.transferPools[transferPoolId];
    if (!transferPool) {
      throw new BadInputError(
        `CREATE_TOKEN_POOL: Transfer pool ${transferPoolId} not found, poolId: ${id}`,
      );
    }
    const parsedTokenIds = parseTokenIds(
      tokenIds,
      id,
      AllowlistOperationCode.CREATE_TOKEN_POOL,
    );
    const contract = transferPool.contract;

    const tokenToOwningWallets = transferPool.transfers.reduce(
      (acc, transfer) => {
        if (
          parsedTokenIds === null ||
          parsedTokenIds.includes(transfer.tokenID)
        ) {
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
      },
      {} as Record<string, { wallet: string }[]>,
    );
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
    this.logger.info(`Tokenpool ${id} created`);
  }
}
