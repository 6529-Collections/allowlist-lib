import { AllowlistState } from './../../state-types/allowlist-state';
import { Logger, LoggerFactory } from './../../../logging/logging-emitter';
import { AllowlistOperationExecutor } from 'src/allowlist/allowlist-operation-executor';
import { BadInputError } from '../../../allowlist/bad-input.error';
import { parseTokenIds } from '../../../utils/app.utils';

export interface ItemExcludeTokenIdsParams {
  readonly itemId: string;
  readonly tokenIds: string;
}
export class ItemExcludeTokenIds implements AllowlistOperationExecutor {
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(ItemExcludeTokenIds.name);
  }

  execute({
    params,
    state,
  }: {
    params: ItemExcludeTokenIdsParams;
    state: AllowlistState;
  }) {
    const { itemId, tokenIds } = params;
    const phase = Object.values(state.phases).find(
      (phase) =>
        !!Object.values(phase.components).find((item) => item.id === itemId),
    );
    if (!phase) {
      throw new BadInputError(
        `ITEM_EXCLUDE_TOKEN_IDS: Item '${itemId}' does not exist in any phase, itemId: ${itemId} `,
      );
    }

    const component = Object.values(phase.components).find(
      (item) => item.id === itemId,
    );

    if (!component) {
      throw new BadInputError(
        `ITEM_EXCLUDE_TOKEN_IDS: Item '${itemId}' does not exist in any phase, itemId: ${itemId} `,
      );
    }

    const item = component[itemId];

    if (!item) {
      throw new BadInputError(
        `ITEM_EXCLUDE_TOKEN_IDS: Item '${itemId}' does not exist in any phase, itemId: ${itemId} `,
      );
    }

    const parsedTokenIds = parseTokenIds(tokenIds, itemId);
    if (!parsedTokenIds.length) {
      throw new BadInputError(
        `ITEM_EXCLUDE_TOKEN_IDS: No token ids provided, itemId: ${itemId}`,
      );
    }
    const tokenIdsToExclude = new Set(parsedTokenIds);
    
  }
}
