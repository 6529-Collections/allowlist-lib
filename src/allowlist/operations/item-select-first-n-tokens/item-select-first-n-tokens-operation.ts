import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { ItemSelectFirstNTokensParams } from './item-select-first-n-tokens.types';
import { AllowlistState } from '../../state-types/allowlist-state';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { getItemPath } from '../../../utils/path.utils';
import { BadInputError } from '../../bad-input.error';

export class ItemSelectFirstNTokensOperation
  implements AllowlistOperationExecutor
{
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(ItemSelectFirstNTokensOperation.name);
  }

  execute({
    params,
    state,
  }: {
    params: ItemSelectFirstNTokensParams;
    state: AllowlistState;
  }) {
    const { itemId, count } = params;
    const { phaseId, componentId } = getItemPath({ state, itemId });
    if (!phaseId || !componentId) {
      throw new BadInputError(
        `ITEM_SELECT_FIRST_N_TOKENS: Item '${itemId}' does not exist, itemId: ${itemId} `,
      );
    }

    if (typeof count !== 'number' || count < 0) {
      throw new BadInputError(
        `ITEM_SELECT_FIRST_N_TOKENS: Invalid count provided, itemId: ${itemId}`,
      );
    }

    if (
      count >
      state.phases[phaseId].components[componentId].items[itemId].tokens.length
    ) {
      throw new BadInputError(
        `ITEM_SELECT_FIRST_N_TOKENS: Count must be less than or equal to the number of tokens in the item, itemId: ${itemId}`,
      );
    }

    state.phases[phaseId].components[componentId].items[itemId].tokens =
      state.phases[phaseId].components[componentId].items[itemId].tokens.slice(
        0,
        count,
      );
    this.logger.info(`First ${count} tokens selected from item '${itemId}'`);
  }
}
