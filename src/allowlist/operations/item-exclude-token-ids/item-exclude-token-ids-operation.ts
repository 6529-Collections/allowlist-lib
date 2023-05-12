import { AllowlistState } from './../../state-types/allowlist-state';
import { Logger, LoggerFactory } from './../../../logging/logging-emitter';
import { AllowlistOperationExecutor } from 'src/allowlist/allowlist-operation-executor';
import { BadInputError } from '../../../allowlist/bad-input.error';
import { isValidTokenIds, parseTokenIds } from '../../../utils/app.utils';
import { ItemExcludeTokenIdsParams } from './item-exclude-token-ids.types';
import { AllowlistOperationCode } from '../../../allowlist/allowlist-operation-code';
import { getItemPath } from '../../../utils/path.utils';

export class ItemExcludeTokenIdsOperation
  implements AllowlistOperationExecutor
{
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(ItemExcludeTokenIdsOperation.name);
  }

  validate(params: any): params is ItemExcludeTokenIdsParams {
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
    params: ItemExcludeTokenIdsParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
    const { itemId, tokenIds } = params;
    const { phaseId, componentId } = getItemPath({ state, itemId });
    if (!phaseId || !componentId) {
      throw new BadInputError(
        `ITEM_EXCLUDE_TOKEN_IDS: Item '${itemId}' does not exist, itemId: ${itemId} `,
      );
    }

    const parsedTokenIds = parseTokenIds(
      tokenIds,
      itemId,
      AllowlistOperationCode.ITEM_EXCLUE_TOKEN_IDS,
    );
    if (!parsedTokenIds?.length) {
      throw new BadInputError(
        `ITEM_EXCLUDE_TOKEN_IDS: No token ids provided, itemId: ${itemId}`,
      );
    }
    const tokenIdsToExclude = new Set(parsedTokenIds);
    state.phases[phaseId].components[componentId].items[itemId].tokens =
      state.phases[phaseId].components[componentId].items[itemId].tokens.filter(
        (token) => !tokenIdsToExclude.has(token.id),
      );
    this.logger.info(`Token ids excluded from item '${itemId}'`);
  }
}
