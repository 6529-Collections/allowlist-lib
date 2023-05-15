import { getItemPath } from './../../../utils/path.utils';
import { ItemSelectTokenIdsParams } from './item-select-token-ids.types';
import { Logger, LoggerFactory } from './../../../logging/logging-emitter';
import { AllowlistOperationExecutor } from '../../../allowlist/allowlist-operation-executor';
import { AllowlistState } from 'src/allowlist/state-types/allowlist-state';
import { isValidTokenIds, parseTokenIds } from '../../../utils/app.utils';
import { AllowlistOperationCode } from '../../allowlist-operation-code';
import { BadInputError } from '../../bad-input.error';

export class ItemSelectTokenIdsOperation implements AllowlistOperationExecutor {
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(ItemSelectTokenIdsOperation.name);
  }

  public validate(params: any): params is ItemSelectTokenIdsParams {
    if (!params.hasOwnProperty('itemId')) {
      throw new BadInputError('Missing itemId');
    }

    if (typeof params.itemId !== 'string') {
      throw new BadInputError('Invalid itemId');
    }

    if (!params.itemId.length) {
      throw new BadInputError('Invalid itemId');
    }

    if (!params.hasOwnProperty('tokenIds')) {
      throw new BadInputError('Missing tokenIds');
    }

    if (typeof params.tokenIds !== 'string') {
      throw new BadInputError('Invalid tokenIds');
    }

    if (!params.tokenIds.length) {
      throw new BadInputError('Invalid tokenIds');
    }

    if (!isValidTokenIds(params.tokenIds)) {
      throw new BadInputError('Invalid tokenIds');
    }
    return true;
  }

  execute({
    params,
    state,
  }: {
    params: ItemSelectTokenIdsParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new Error(`Invalid params`);
    }
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
