import { AllowlistState } from '../../../allowlist/state-types/allowlist-state';
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

  private getPool(
    param: { poolType: Pool; poolId: string; itemId: string },
    state: AllowlistState,
  ): {
    readonly tokens: AllowlistItemToken[];
    readonly contract: string | null;
    readonly blockNo: number | null;
    readonly consolidateBlockNo: number | null;
  } {
    const { poolType, poolId, itemId } = param;
    switch (poolType) {
      case Pool.TOKEN_POOL: {
        const tokenPool = state.tokenPools[poolId];
        if (!tokenPool) {
          throw new BadInputError(
            `Token pool '${poolId}' does not exist, itemId: ${itemId}`,
          );
        }
        return {
          tokens: state.tokenPools[poolId].tokens.map((token) => ({
            id: token.id,
            owner: token.owner,
          })),
          contract: tokenPool.contract,
          blockNo: tokenPool.blockNo,
          consolidateBlockNo: tokenPool.consolidateBlockNo,
        };
      }
      case Pool.CUSTOM_TOKEN_POOL:
        const customTokenPool = state.customTokenPools[poolId];
        if (!customTokenPool) {
          throw new BadInputError(
            `Custom token pool '${poolId}' does not exist, itemId: ${itemId}`,
          );
        }
        return {
          tokens: customTokenPool.tokens.map((token) => ({
            id: token.id,
            owner: token.owner,
          })),
          contract: null,
          blockNo: null,
          consolidateBlockNo: null,
        };
      case Pool.WALLET_POOL:
        throw new BadInputError(
          `Wallet pool '${poolId}' cannot be used for item, itemId: ${itemId}`,
        );
      default:
        assertUnreachable(poolType);
    }
  }

  validate(params: any): params is AllowlistAddItemParams {
    if (!params.hasOwnProperty('componentId')) {
      throw new BadInputError('Missing componentId');
    }

    if (typeof params.componentId !== 'string') {
      throw new BadInputError('Invalid componentId');
    }

    if (!params.componentId.length) {
      throw new BadInputError('Invalid componentId');
    }

    if (!params.hasOwnProperty('id')) {
      throw new BadInputError('Missing id');
    }

    if (typeof params.id !== 'string') {
      throw new BadInputError('Invalid id');
    }

    if (!params.id.length) {
      throw new BadInputError('Invalid id');
    }

    if (!params.hasOwnProperty('name')) {
      throw new BadInputError('Missing name');
    }

    if (typeof params.name !== 'string') {
      throw new BadInputError('Invalid name');
    }

    if (!params.name.length) {
      throw new BadInputError('Invalid name');
    }

    if (!params.hasOwnProperty('description')) {
      throw new BadInputError('Missing description');
    }

    if (typeof params.description !== 'string') {
      throw new BadInputError('Invalid description');
    }

    if (!params.description.length) {
      throw new BadInputError('Invalid description');
    }

    if (!params.hasOwnProperty('poolId')) {
      throw new BadInputError('Missing poolId');
    }

    if (typeof params.poolId !== 'string') {
      throw new BadInputError('Invalid poolId');
    }

    if (!params.poolId.length) {
      throw new BadInputError('Invalid poolId');
    }

    if (!params.hasOwnProperty('poolType')) {
      throw new BadInputError('Missing poolType');
    }

    if (typeof params.poolType !== 'string') {
      throw new BadInputError('Invalid poolType');
    }

    if (
      ![Pool.TOKEN_POOL, Pool.CUSTOM_TOKEN_POOL].includes(
        params.poolType as Pool,
      )
    ) {
      throw new BadInputError('Invalid poolType');
    }

    return true;
  }

  execute({
    params,
    state,
  }: {
    params: AllowlistAddItemParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
    const { componentId, id, name, description, poolId, poolType } = params;
    const phase = Object.values(state.phases).find(
      (phase) => !!phase.components[componentId],
    );
    const phaseId = phase?.id;
    if (!phaseId) {
      throw new BadInputError(`Component '${componentId}' does not exist`);
    }
    const { tokens, contract, blockNo, consolidateBlockNo } = this.getPool(
      { poolId, poolType, itemId: id },
      state,
    );

    state.phases[phaseId].components[componentId].items[id] = {
      id,
      name,
      description,
      poolId,
      poolType,
      tokens,
      contract,
      blockNo,
      consolidateBlockNo,
      _insertionOrder: Object.keys(
        state.phases[phaseId].components[componentId].items,
      ).length,
    };
    this.logger.info(`Created item ${name}`);
  }
}
