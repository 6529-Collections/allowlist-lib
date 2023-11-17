import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { ItemRemoveWalletsFromCertainTokenPoolsParams } from './item-remove-wallets-from-certain-token-pools.types';
import { AllowlistState } from '../../state-types/allowlist-state';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { Pool } from '../../../app-types';
import { BadInputError } from '../../bad-input.error';
import { getItemPath } from '../../../utils/path.utils';
import { assertUnreachable } from '../../../utils/app.utils';

export class ItemRemoveWalletsFromCertainTokenPoolsOperation
  implements AllowlistOperationExecutor
{
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(
      ItemRemoveWalletsFromCertainTokenPoolsOperation.name,
    );
  }

  validate(
    params: any,
  ): params is ItemRemoveWalletsFromCertainTokenPoolsParams {
    this.validateItemId(params);
    this.validatePools(params);

    for (const pool of params.pools) {
      this.validatePoolType(pool);
      this.validatePoolId(pool);
    }

    return true;
  }

  private validatePoolId(pool) {
    if (!pool.hasOwnProperty('poolId')) {
      throw new BadInputError('Missing poolId');
    }

    if (typeof pool.poolId !== 'string') {
      throw new BadInputError('Invalid poolId');
    }

    if (!pool.poolId.length) {
      throw new BadInputError('Invalid poolId');
    }
  }

  private validatePoolType(pool) {
    if (!pool.hasOwnProperty('poolType')) {
      throw new BadInputError('Missing poolType');
    }

    if (typeof pool.poolType !== 'string') {
      throw new BadInputError('Invalid poolType');
    }

    if (!pool.poolType.length) {
      throw new BadInputError('Invalid poolType');
    }

    if (!Object.values(Pool).includes(pool.poolType as Pool)) {
      throw new BadInputError('Invalid poolType');
    }
  }

  private validatePools(params: any) {
    if (!params.hasOwnProperty('pools')) {
      throw new BadInputError('Missing pools');
    }

    if (!Array.isArray(params.pools)) {
      throw new BadInputError('Invalid pools');
    }

    if (!params.pools.length) {
      throw new BadInputError('Invalid pools');
    }
  }

  private validateItemId(params: any) {
    if (!params.hasOwnProperty('itemId')) {
      throw new BadInputError('Missing itemId');
    }

    if (typeof params.itemId !== 'string') {
      throw new BadInputError('Invalid itemId');
    }

    if (!params.itemId.length) {
      throw new BadInputError('Invalid itemId');
    }
  }

  private getTokenPoolWallets(params: {
    state: AllowlistState;
    poolId: string;
  }): Set<string> {
    const { state, poolId } = params;
    const pool = state.tokenPools[poolId];
    if (!pool) {
      throw new BadInputError(`Token pool with id '${poolId}' does not exist`);
    }
    return new Set(pool.tokens.map((token) => token.owner));
  }

  private getCustomTokenPoolWallets(params: {
    state: AllowlistState;
    poolId: string;
  }): Set<string> {
    const { state, poolId } = params;
    const pool = state.customTokenPools[poolId];
    if (!pool) {
      throw new BadInputError(
        `Custom token pool with id '${poolId}' does not exist`,
      );
    }
    return new Set(pool.tokens.map((token) => token.owner));
  }

  private getWalletPoolWallets(params: {
    state: AllowlistState;
    poolId: string;
  }): Set<string> {
    const { state, poolId } = params;
    const pool = state.walletPools[poolId];
    if (!pool) {
      throw new BadInputError(`Wallet pool with id '${poolId}' does not exist`);
    }
    return new Set(pool.wallets);
  }

  private getPoolWallets(param: {
    state: AllowlistState;
    poolType: Pool;
    poolId: string;
  }): Set<string> {
    const { state, poolType, poolId } = param;

    switch (poolType) {
      case Pool.TOKEN_POOL:
        return this.getTokenPoolWallets({ state, poolId });
      case Pool.CUSTOM_TOKEN_POOL:
        return this.getCustomTokenPoolWallets({ state, poolId });
      case Pool.WALLET_POOL:
        return this.getWalletPoolWallets({ state, poolId });
      default:
        assertUnreachable(poolType);
    }
  }

  execute({
    params,
    state,
  }: {
    params: ItemRemoveWalletsFromCertainTokenPoolsParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }

    const { itemId, pools } = params;
    const { phaseId, componentId } = getItemPath({ state, itemId });

    if (!phaseId || !componentId) {
      throw new BadInputError(`Item with id '${itemId}' does not exist`);
    }

    const removeItemWallets: Set<string> = new Set();

    for (const pool of pools) {
      const { poolType, poolId } = pool;
      const poolWallets = this.getPoolWallets({ state, poolType, poolId });
      for (const wallet of poolWallets) {
        removeItemWallets.add(wallet);
      }
    }

    const item = state.phases[phaseId].components[componentId].items[itemId];
    const tokens = item.tokens.filter(
      (token) => !removeItemWallets.has(token.owner),
    );

    state.phases[phaseId].components[componentId].items[itemId] = {
      ...item,
      tokens,
    };

    this.logger.info(
      'Executed ItemRemoveWalletsFromCertainTokenPools operation',
    );
  }
}
