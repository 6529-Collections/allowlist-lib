import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { ItemSortWalletsByMemesTdhParams } from './item-sort-wallets-by-memes-tdh.types';
import { AllowlistState } from '../../../allowlist/state-types/allowlist-state';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { BadInputError } from '../../bad-input.error';
import { SeizeApi } from '../../../services/seize/seize.api';
import { getItemPath } from '../../../utils/path.utils';
import { TdhInfo } from '../../../services/seize/tdh-info';

export class ItemSortWalletsByMemesTdhOperation
  implements AllowlistOperationExecutor
{
  private readonly logger: Logger;

  constructor(
    private readonly seizeApi: SeizeApi,
    loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.create(ItemSortWalletsByMemesTdhOperation.name);
  }

  validate(params: any): params is ItemSortWalletsByMemesTdhParams {
    if (!params.hasOwnProperty('itemId')) {
      throw new BadInputError('Missing itemId');
    }

    if (typeof params.itemId !== 'string') {
      throw new BadInputError('Invalid itemId');
    }

    if (!params.itemId.length) {
      throw new BadInputError('Invalid itemId');
    }

    if (!params.hasOwnProperty('tdhBlockNumber')) {
      throw new BadInputError('Missing tdhBlockNumber');
    }

    if (typeof params.tdhBlockNumber !== 'number') {
      throw new BadInputError('Invalid tdhBlockNumber');
    }

    if (params.tdhBlockNumber < 0) {
      throw new BadInputError('Invalid tdhBlockNumber');
    }

    if (params.tdhBlockNumber % 1 !== 0) {
      throw new BadInputError('Invalid tdhBlockNumber');
    }
    return true;
  }

  async execute({
    params,
    state,
  }: {
    params: ItemSortWalletsByMemesTdhParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
    const { itemId, tdhBlockNumber } = params;
    const { phaseId, componentId } = getItemPath({ state, itemId });
    if (!phaseId || !componentId) {
      throw new BadInputError(`Item '${itemId}' not found`);
    }

    const tdhs = await this.seizeApi.getUploadsForBlock(tdhBlockNumber);
    const tdhsMap = tdhs.reduce<Record<string, TdhInfo>>((acc, tdh) => {
      acc[tdh.wallet] = tdh;
      return acc;
    }, {});

    const sortedByTdh = state.phases[phaseId].components[componentId].items[
      itemId
    ].tokens.sort((a, d) => {
      const aTdh = tdhsMap[a.owner];
      const dTdh = tdhsMap[d.owner];
      if (!aTdh && !dTdh) {
        return 0;
      }
      if (!aTdh) {
        return 1;
      }
      if (!dTdh) {
        return -1;
      }
      if (dTdh.boosted_memes_tdh === aTdh.boosted_memes_tdh) {
        return dTdh.unique_memes === aTdh.unique_memes
          ? dTdh.memes_balance - aTdh.memes_balance
          : dTdh.unique_memes - aTdh.unique_memes;
      }
      return dTdh.boosted_memes_tdh - aTdh.boosted_memes_tdh;
    });
    state.phases[phaseId].components[componentId].items[itemId].tokens =
      sortedByTdh;

    this.logger.info('Executed ItemSortWalletsByMemesTdh operation');
  }
}
