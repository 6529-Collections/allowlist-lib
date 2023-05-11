import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { AllowlistState } from '../../state-types/allowlist-state';
import { WalletPool } from '../../state-types/wallet-pool';
import { BadInputError } from '../../bad-input.error';
import { isEthereumAddress } from '../../../utils/validators';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';

export class CreateWalletPoolOperation implements AllowlistOperationExecutor {
  private logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(CreateWalletPoolOperation.name);
  }

  execute({ params, state }: { params: WalletPool; state: AllowlistState }) {
    const { id, name, description, wallets } = params;

    if (!Array.isArray(wallets)) {
      throw new BadInputError(
        `CREATE_WALLET_POOL: Wallets must be an array, poolId: ${id}`,
      );
    }

    if (!wallets.length) {
      throw new BadInputError(
        `CREATE_WALLET_POOL: Wallets array must not be empty, poolId: ${id}`,
      );
    }

    const uniqueWallets = new Set();
    for (const wallet of wallets) {
      if (typeof wallet !== 'string') {
        throw new BadInputError(
          `CREATE_WALLET_POOL: Wallets must be an array of strings, poolId: ${id}`,
        );
      }

      if (!isEthereumAddress(wallet)) {
        throw new BadInputError(
          `CREATE_WALLET_POOL: Wallet ${wallet} is not a valid Ethereum address, poolId: ${id}`,
        );
      }

      if (uniqueWallets.has(wallet)) {
        throw new BadInputError(
          `CREATE_WALLET_POOL: Wallet ${wallet} is duplicated, poolId: ${id}`,
        );
      }

      uniqueWallets.add(wallet);
    }

    state.walletPools[id] = {
      id,
      name,
      description,
      wallets,
    };
    this.logger.info(`Created wallet pool ${id}`);
  }
}
