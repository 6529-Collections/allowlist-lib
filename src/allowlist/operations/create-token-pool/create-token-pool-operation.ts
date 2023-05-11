import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { AllowlistState } from '../../state-types/allowlist-state';
import { TokenPoolParams } from '../../state-types/token-pool';
import { BadInputError } from '../../bad-input.error';
import { TokenOwnership } from '../../state-types/token-ownership';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { parseTokenIds } from '../../../utils/app.utils';

export class CreateTokenPoolOperation implements AllowlistOperationExecutor {
  private logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(CreateTokenPoolOperation.name);
  }

  execute({
    params,
    state,
  }: {
    params: TokenPoolParams;
    state: AllowlistState;
  }) {
    const { id, transferPoolId, tokenIds } = params;
    const transferPool = state.transferPools[transferPoolId];
    if (!transferPool) {
      throw new BadInputError(
        `CREATE_TOKEN_POOL: Transfer pool ${transferPoolId} not found, poolId: ${id}`,
      );
    }
    if (
      !(
        typeof tokenIds === 'string' ||
        tokenIds === null ||
        tokenIds === undefined
      )
    ) {
      throw new BadInputError(
        `CREATE_TOKEN_POOL: TokenIds must be in format: 1, 2, 3, 45, 100-115, 203-780, 999, poolId: ${id}`,
      );
    }
    const parsedTokenIds = parseTokenIds(tokenIds, id);
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
              since: transfer.timeStamp,
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
      {} as Record<string, { wallet: string; since: number }[]>,
    );
    const tokenOwnerships: TokenOwnership[] = Object.entries(
      tokenToOwningWallets,
    ).flatMap(([tokenId, tokenOwnerships]) =>
      tokenOwnerships.map(({ wallet, since }) => ({
        id: tokenId,
        owner: wallet,
        contract,
        since: since,
      })),
    );
    state.tokenPools[id] = { ...params, tokens: tokenOwnerships };
    this.logger.info(`Tokenpool ${id} created`);
  }
}
