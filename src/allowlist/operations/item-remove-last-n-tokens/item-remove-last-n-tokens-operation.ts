import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { getItemPath } from '../../../utils/path.utils';
import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { AllowlistState } from '../../state-types/allowlist-state';
import { ItemRemoveLastNTokensParams } from './item-remove-last-n-tokens.types';

export class ItemRemoveLastNTokensOperation
  implements AllowlistOperationExecutor
{
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(ItemRemoveLastNTokensOperation.name);
  }

  execute({
    params,
    state,
  }: {
    params: ItemRemoveLastNTokensParams;
    state: AllowlistState;
  }) {
    const { itemId, count } = params;
    const { phaseId, componentId } = getItemPath({ state, itemId });
    if (!phaseId || !componentId) {
      throw new Error(
        `ITEM_REMOVE_LAST_N_TOKENS: Item '${itemId}' does not exist, itemId: ${itemId} `,
      );
    }

    if (typeof count !== 'number' || count < 0) {
      throw new Error(
        `ITEM_REMOVE_LAST_N_TOKENS: Invalid count provided, itemId: ${itemId}`,
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
