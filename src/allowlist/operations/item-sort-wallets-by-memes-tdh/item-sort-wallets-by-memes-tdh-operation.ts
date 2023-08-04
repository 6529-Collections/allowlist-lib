import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { ItemSortWalletsByMemesTdhParams } from './item-sort-wallets-by-memes-tdh.types';
import { AllowlistState } from '../../state-types/allowlist-state';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { BadInputError } from '../../bad-input.error';
import { SeizeApi } from '../../../services/seize/seize.api';
import { getItemPath } from '../../../utils/path.utils';
import { getTokenPoolContractOrIdIfCustom } from '../../../utils/pool.utils';
import { MEMES_CONTRACT } from '../../../app-types';
import { AllowlistOperationCode } from '../../allowlist-operation-code';

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

    const item = state.phases[phaseId].components[componentId].items[itemId];

    const contractOrCustomPoolId = getTokenPoolContractOrIdIfCustom({
      poolId: item.poolId,
      poolType: item.poolType,
      state,
    });
    if (contractOrCustomPoolId !== MEMES_CONTRACT) {
      throw new BadInputError(
        `Item '${itemId}' is not a memes item and therefor operation ${AllowlistOperationCode.ITEM_SORT_WALLETS_BY_MEMES_TDH} is not supported`,
      );
    }

    const tdhs = await this.seizeApi.getUploadsForBlock(tdhBlockNumber);
    const sorter = state.getSorter(contractOrCustomPoolId);
    item.tokens = await sorter.sortByTdh(item.tokens, tdhs);

    this.logger.info('Executed ItemSortWalletsByMemesTdh operation');
  }
}
