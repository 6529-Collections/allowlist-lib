import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { ItemSortWalletsByUniqueTokensCountParams } from './item-sort-wallets-by-unique-tokens-count.types';
import { AllowlistState } from '../../../allowlist/state-types/allowlist-state';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { BadInputError } from '../../bad-input.error';
import { getItemPath } from '../../../utils/path.utils';
import { AllowlistItemToken } from '../../state-types/allowlist-item';

export class ItemSortWalletsByUniqueTokensCountOperation
  implements AllowlistOperationExecutor
{
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(
      ItemSortWalletsByUniqueTokensCountOperation.name,
    );
  }

  validate(params: any): params is ItemSortWalletsByUniqueTokensCountParams {
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
    params: ItemSortWalletsByUniqueTokensCountParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
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
          uniqueTokens: Set<string>;
          tokens: AllowlistItemToken[];
        }
      >
    >((acc, token) => {
      if (!acc.hasOwnProperty(token.owner)) {
        acc[token.owner] = {
          owner: token.owner,
          uniqueTokens: new Set(),
          tokens: [],
        };
      }
      acc[token.owner].uniqueTokens.add(token.id);
      acc[token.owner].tokens.push(token);
      return acc;
    }, {});

    state.phases[phaseId].components[componentId].items[itemId].tokens =
      structuredClone(Object.values(wallets))
        .sort((a, d) => {
          if (d.uniqueTokens.size === a.uniqueTokens.size) {
            return d.tokens.length - a.tokens.length;
          }
          return d.uniqueTokens.size - a.uniqueTokens.size;
        })
        .flatMap((w) => w.tokens);
    this.logger.info(`Item sorted by wallet unique tokens count: ${itemId}`);
  }
}
