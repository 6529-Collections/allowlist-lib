import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { ItemSortWalletsByTotalTokensCountParams } from './item-sort-wallets-by-total-tokens-count.types';
import { AllowlistState } from '../../../allowlist/state-types/allowlist-state';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { BadInputError } from '../../bad-input.error';
import { getItemPath } from '../../../utils/path.utils';
import { AllowlistItemToken } from '../../state-types/allowlist-item';

export class ItemSortWalletsByTotalTokensCountOperation
  implements AllowlistOperationExecutor
{
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(
      ItemSortWalletsByTotalTokensCountOperation.name,
    );
  }

  validate(params: any): params is ItemSortWalletsByTotalTokensCountParams {
    if (!params.hasOwnProperty('itemId')) {
      throw new BadInputError('Missing itemId');
    }

    if (typeof params.itemId !== 'string') {
      throw new BadInputError('Invalid itemId');
    }

    if (!params.itemId.length) {
      throw new BadInputError('Invalid itemId');
    }
    return true;
  }

  execute({
    params,
    state,
  }: {
    params: ItemSortWalletsByTotalTokensCountParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
    const { itemId } = params;
    const { phaseId, componentId } = getItemPath({ state, itemId });
    if (!phaseId || !componentId) {
      throw new BadInputError(`Item '${itemId}' not found`);
    }

    const item = state.phases[phaseId].components[componentId].items[itemId];
    const wallets = item.tokens.reduce<
      Record<
        string,
        {
          owner: string;
          tokens: AllowlistItemToken[];
        }
      >
    >((acc, token) => {
      if (!acc.hasOwnProperty(token.owner)) {
        acc[token.owner] = {
          owner: token.owner,
          tokens: [],
        };
      }
      acc[token.owner].tokens.push(token);
      return acc;
    }, {});

    state.phases[phaseId].components[componentId].items[itemId].tokens =
      structuredClone(Object.values(wallets))
        .sort((a, d) => d.tokens.length - a.tokens.length)
        .flatMap((w) => w.tokens);

    this.logger.info(`Item sorted by wallet total tokens count '${itemId}'`);
  }
}
