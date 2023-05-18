import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { getItemPath } from '../../../utils/path.utils';
import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { BadInputError } from '../../bad-input.error';
import { AllowlistState } from '../../state-types/allowlist-state';
import { ItemRemoveLastNTokensParams } from './item-remove-last-n-tokens.types';

export class ItemRemoveLastNTokensOperation
  implements AllowlistOperationExecutor
{
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(ItemRemoveLastNTokensOperation.name);
  }

  validate(params: any): params is ItemRemoveLastNTokensParams {
    if (!params.hasOwnProperty('itemId')) {
      throw new BadInputError('Missing itemId');
    }

    if (typeof params.itemId !== 'string') {
      throw new BadInputError('Invalid itemId');
    }

    if (!params.itemId.length) {
      throw new BadInputError('Invalid itemId');
    }

    if (!params.hasOwnProperty('count')) {
      throw new BadInputError('Missing count');
    }

    if (typeof params.count !== 'number') {
      throw new BadInputError('Invalid count');
    }

    if (params.count < 0) {
      throw new BadInputError('Invalid count');
    }

    return true;
  }

  execute({
    params,
    state,
  }: {
    params: ItemRemoveLastNTokensParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new Error('Invalid params');
    }
    const { itemId, count } = params;
    const { phaseId, componentId } = getItemPath({ state, itemId });
    if (!phaseId || !componentId) {
      throw new Error(
        `ITEM_REMOVE_LAST_N_TOKENS: Item '${itemId}' does not exist, itemId: ${itemId} `,
      );
    }

    if (
      count >
      state.phases[phaseId].components[componentId].items[itemId].tokens.length
    ) {
      throw new Error(
        `ITEM_REMOVE_LAST_N_TOKENS: Count must be less than or equal to the number of tokens in the item, itemId: ${itemId}`,
      );
    }

    state.phases[phaseId].components[componentId].items[itemId].tokens =
      state.phases[phaseId].components[componentId].items[itemId].tokens.slice(
        0,
        -count,
      );

    this.logger.info(`Last ${count} tokens removed from item '${itemId}'`);
  }
}