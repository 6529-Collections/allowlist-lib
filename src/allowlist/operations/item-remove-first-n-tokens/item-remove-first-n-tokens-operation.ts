import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { getItemPath } from '../../../utils/path.utils';
import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { BadInputError } from '../../bad-input.error';
import { AllowlistState } from '../../state-types/allowlist-state';
import { ItemRemoveFirstNTokensParams } from './item-remove-first-n-tokens.types';

export class ItemRemoveFirstNTokensOperation
  implements AllowlistOperationExecutor
{
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(ItemRemoveFirstNTokensOperation.name);
  }

  validate(params: any): params is ItemRemoveFirstNTokensParams {
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
    params: ItemRemoveFirstNTokensParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
    const { itemId, count } = params;
    const { phaseId, componentId } = getItemPath({ state, itemId });
    if (!phaseId || !componentId) {
      throw new BadInputError(
        `ITEM_REMOVE_FIRST_N_ITEMS: Item '${itemId}' does not exist, itemId: ${itemId} `,
      );
    }

    state.phases[phaseId].components[componentId].items[itemId].tokens =
      state.phases[phaseId].components[componentId].items[itemId].tokens.slice(
        count,
      );

    this.logger.info(`First ${count} tokens removed from item '${itemId}'`);
  }
}
