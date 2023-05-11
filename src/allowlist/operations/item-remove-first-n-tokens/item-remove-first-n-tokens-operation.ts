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

  execute({
    params,
    state,
  }: {
    params: ItemRemoveFirstNTokensParams;
    state: AllowlistState;
  }) {
    const { itemId, count } = params;
    const { phaseId, componentId } = getItemPath({ state, itemId });
    if (!phaseId || !componentId) {
      throw new BadInputError(
        `ITEM_REMOVE_FIRST_N_ITEMS: Item '${itemId}' does not exist, itemId: ${itemId} `,
      );
    }

    if (typeof count !== 'number' || count < 0) {
      throw new BadInputError(
        `ITEM_REMOVE_FIRST_N_ITEMS: Invalid count provided, itemId: ${itemId}`,
      );
    }

    if (
      count >
      state.phases[phaseId].components[componentId].items[itemId].tokens.length
    ) {
      throw new BadInputError(
        `ITEM_REMOVE_FIRST_N_ITEMS: Count must be less than or equal to the number of tokens in the item, itemId: ${itemId}`,
      );
    }

    state.phases[phaseId].components[componentId].items[itemId].tokens =
      state.phases[phaseId].components[componentId].items[itemId].tokens.slice(
        count,
      );

    this.logger.info(`First ${count} tokens removed from item '${itemId}'`);
  }
}
