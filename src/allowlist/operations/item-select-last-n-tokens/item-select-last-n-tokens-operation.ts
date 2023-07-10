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

  validate(params: any): params is ItemSelectLastNTokensParams {
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
    params: ItemSelectLastNTokensParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new Error('Invalid params');
    }
    const { itemId, count } = params;
    const { phaseId, componentId } = getItemPath({ state, itemId });
    if (!phaseId || !componentId) {
      throw new BadInputError(
        `ITEM_SELECT_LAST_N_TOKENS: Item '${itemId}' does not exist, itemId: ${itemId} `,
      );
    }

    state.phases[phaseId].components[componentId].items[itemId].tokens =
      state.phases[phaseId].components[componentId].items[itemId].tokens.slice(
        -count,
      );

    this.logger.info(`Last ${count} tokens selected from item '${itemId}'`);
  }
}
