import { getItemPath } from './../../../utils/path.utils';
import { ItemSelectTokenIdsParams } from './item-select-token-ids.types';
import { Logger, LoggerFactory } from './../../../logging/logging-emitter';
import { AllowlistOperationExecutor } from '../../../allowlist/allowlist-operation-executor';
import { AllowlistState } from 'src/allowlist/state-types/allowlist-state';
import { parseTokenIds } from '../../../utils/app.utils';
import { AllowlistOperationCode } from '../../allowlist-operation-code';

export class ItemSelectTokenIdsOperation implements AllowlistOperationExecutor {
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(ItemSelectTokenIdsOperation.name);
  }

  execute({
    params,
    state,
  }: {
    params: ItemSelectTokenIdsParams;
    state: AllowlistState;
  }) {
    const { itemId, tokenIds } = params;
    const { phaseId, componentId } = getItemPath({ state, itemId });
    if (!phaseId || !componentId) {
      throw new Error(
        `ITEM_SELECT_TOKEN_IDS: Item '${itemId}' does not exist, itemId: ${itemId} `,
      );
    }

    if (typeof tokenIds !== 'string' || !tokenIds?.length) {
      throw new Error(
        `ITEM_SELECT_TOKEN_IDS: No token ids provided, itemId: ${itemId}`,
      );
    }

    const parsedTokenIds = parseTokenIds(
      tokenIds,
      itemId,
      AllowlistOperationCode.ITEM_SELECT_TOKEN_IDS,
    );

    if (!parsedTokenIds?.length) {
      throw new Error(
        `ITEM_SELECT_TOKEN_IDS: No token ids provided, itemId: ${itemId}`,
      );
    }

    const tokenIdsToSelect = new Set(parsedTokenIds);
    state.phases[phaseId].components[componentId].items[itemId].tokens =
      state.phases[phaseId].components[componentId].items[itemId].tokens.filter(
        (token) => tokenIdsToSelect.has(token.id),
      );
    this.logger.info(`Token ids selected from item '${itemId}'`);
  }
}
