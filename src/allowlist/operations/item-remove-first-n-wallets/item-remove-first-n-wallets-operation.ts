import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { ItemRemoveFirstNWalletsParams } from './item-remove-first-n-wallets.types';
import { AllowlistState } from '../../../allowlist/state-types/allowlist-state';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { BadInputError } from '../../bad-input.error';
import { getItemPath } from '../../../utils/path.utils';
import { AllowlistItemToken } from '../../state-types/allowlist-item';

export class ItemRemoveFirstNWalletsOperation
  implements AllowlistOperationExecutor
{
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(ItemRemoveFirstNWalletsOperation.name);
  }

  validate(params: any): params is ItemRemoveFirstNWalletsParams {
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
    params: ItemRemoveFirstNWalletsParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
    const { itemId, count } = params;
    const { phaseId, componentId } = getItemPath({ state, itemId });
    if (!phaseId || !componentId) {
      throw new BadInputError(
        `ITEM_REMOVE_FIRST_N_WALLETS: Item '${itemId}' does not exist, itemId: ${itemId} `,
      );
    }

    const { tokens, firstNWallets } = state.phases[phaseId].components[
      componentId
    ].items[itemId].tokens.reduce<{
      firstNWallets: Set<string>;
      tokens: AllowlistItemToken[];
    }>(
      (acc, curr) => {
        if (acc.firstNWallets.size < count) {
          acc.firstNWallets.add(curr.owner);
        }
        if (!acc.firstNWallets.has(curr.owner)) {
          acc.tokens.push(curr);
        }
        return acc;
      },
      { tokens: [], firstNWallets: new Set() },
    );

    if (firstNWallets.size < count) {
      throw new BadInputError(
        `ITEM_REMOVE_FIRST_N_WALLETS: Item '${itemId}' does not have ${count} wallets`,
      );
    }

    state.phases[phaseId].components[componentId].items[itemId].tokens = tokens;
    this.logger.info(
      `First ${count} wallets with it tokens removed from item '${itemId}'`,
    );
  }
}
