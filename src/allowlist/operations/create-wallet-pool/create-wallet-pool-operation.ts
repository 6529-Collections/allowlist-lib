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

  validate(params: any): params is WalletPool {
    this.assertIdValid(params);
    this.assertNameValid(params);
    this.assertDescriptionValid(params);
    this.assertWalletsValid(params);
    this.assertWalletsUnique(params);
    return true;
  }

  private assertWalletsUnique(params: any) {
    const uniqueWallets = new Set();
    for (const wallet of params.wallets) {
      if (typeof wallet !== 'string') {
        throw new BadInputError('Invalid wallets');
      }

      if (!wallet.length) {
        throw new BadInputError('Invalid wallets');
      }

      if (!isEthereumAddress(wallet)) {
        throw new BadInputError('Invalid wallets');
      }

      if (uniqueWallets.has(wallet)) {
        throw new BadInputError('Invalid wallets');
      }

      uniqueWallets.add(wallet);
    }
  }

  private assertWalletsValid(params: any) {
    if (!params.hasOwnProperty('wallets')) {
      throw new BadInputError('Missing wallets');
    }

    if (!Array.isArray(params.wallets)) {
      throw new BadInputError('Invalid wallets');
    }

    if (!params.wallets.length) {
      throw new BadInputError('Invalid wallets');
    }
  }

  private assertDescriptionValid(params: any) {
    if (!params.hasOwnProperty('description')) {
      throw new BadInputError('Missing description');
    }

    if (typeof params.description !== 'string') {
      throw new BadInputError('Invalid description');
    }

    if (!params.description.length) {
      throw new BadInputError('Invalid description');
    }
  }

  private assertNameValid(params: any) {
    if (!params.hasOwnProperty('name')) {
      throw new BadInputError('Missing name');
    }

    if (typeof params.name !== 'string') {
      throw new BadInputError('Invalid name');
    }

    if (!params.name.length) {
      throw new BadInputError('Invalid name');
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

  execute({ params, state }: { params: WalletPool; state: AllowlistState }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
    const { id, name, description, wallets } = params;

    state.walletPools[id] = {
      id,
      name,
      description,
      wallets,
    };
    this.logger.info(`Created wallet pool ${id}`);
  }
}
