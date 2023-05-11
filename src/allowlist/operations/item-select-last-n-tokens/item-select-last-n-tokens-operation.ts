import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { ItemSelectLastNTokensParams } from './item-select-last-n-tokens.types';
import { AllowlistState } from '../../state-types/allowlist-state';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { getItemPath } from '../../../utils/path.utils';
import { BadInputError } from '../../bad-input.error';

export class ItemSelectLastNTokensOperation
  implements AllowlistOperationExecutor
{
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(ItemSelectLastNTokensOperation.name);
  }

  execute({
    params,
    state,
  }: {
    params: ItemSelectLastNTokensParams;
    state: AllowlistState;
  }) {
    const { itemId, count } = params;
    const { phaseId, componentId } = getItemPath({ state, itemId });
    if (!phaseId || !componentId) {
      throw new BadInputError(
        `ITEM_SELECT_LAST_N_TOKENS: Item '${itemId}' does not exist, itemId: ${itemId} `,
      );
    }

    if (typeof count !== 'number' || count < 0) {
      throw new BadInputError(
        `ITEM_SELECT_LAST_N_TOKENS: Invalid count provided, itemId: ${itemId}`,
      );
    }

    if (
      count >
      state.phases[phaseId].components[componentId].items[itemId].tokens.length
    ) {
      throw new BadInputError(
        `ITEM_SELECT_LAST_N_TOKENS: Count must be less than or equal to the number of tokens in the item, itemId: ${itemId}`,
      );
    }

    state.phases[phaseId].components[componentId].items[itemId].tokens =
      state.phases[phaseId].components[componentId].items[itemId].tokens.slice(
        -count,
      );

    this.logger.info(`Last ${count} tokens selected from item '${itemId}'`);
  }
}
