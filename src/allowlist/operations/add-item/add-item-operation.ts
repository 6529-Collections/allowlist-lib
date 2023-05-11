import { AllowlistState } from 'src/allowlist/state-types/allowlist-state';
import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { AllowlistAddItemParams } from './add-item-operation.types';
import { BadInputError } from '../../bad-input.error';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { AllowlistItemToken } from '../../../allowlist/state-types/allowlist-item';
import { assertUnreachable } from '../../../utils/app.utils';
import { Pool } from '../../../app-types';

export class AddItemOperation implements AllowlistOperationExecutor {
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(AddItemOperation.name);
  }

  private getTokens(
    param: { poolType: Pool; poolId: string; itemId: string },
    state: AllowlistState,
  ): AllowlistItemToken[] {
    const { poolType, poolId, itemId } = param;
    switch (poolType) {
      case Pool.TOKEN_POOL:
        if (!state.tokenPools[poolId]) {
          throw new BadInputError(
            `Token pool '${poolId}' does not exist, itemId: ${itemId}`,
          );
        }
        return state.tokenPools[poolId].tokens.map((token) => ({
          id: token.id,
          owner: token.owner,
          since: token.since,
        }));
      case Pool.CUSTOM_TOKEN_POOL:
        if (!state.customTokenPools[poolId]) {
          throw new BadInputError(
            `Custom token pool '${poolId}' does not exist, itemId: ${itemId}`,
          );
        }
        return state.customTokenPools[poolId].tokens.map((token) => ({
          id: token.id,
          owner: token.owner,
          since: token.since,
        }));
      case Pool.WALLET_POOL:
        throw new BadInputError(
          `Wallet pool '${poolId}' cannot be used for item, itemId: ${itemId}`,
        );
      default:
        assertUnreachable(poolType);
    }
  }

  execute({
    params,
    state,
  }: {
    params: AllowlistAddItemParams;
    state: AllowlistState;
  }) {
    const { componentId, id, name, description, poolId, poolType } = params;
    const phase = Object.values(state.phases).find(
      (phase) => !!phase.components[componentId],
    );
    const phaseId = phase?.id;
    if (!phaseId) {
      throw new BadInputError(`Component '${componentId}' does not exist`);
    }
    const tokens = this.getTokens({ poolId, poolType, itemId: id }, state);

    state.phases[phaseId].components[componentId].items[id] = {
      id,
      name,
      description,
      tokens,
      _insertionOrder: Object.keys(
        state.phases[phaseId].components[componentId].items,
      ).length,
    };
    this.logger.info(`Created item ${name}`);
  }
}
