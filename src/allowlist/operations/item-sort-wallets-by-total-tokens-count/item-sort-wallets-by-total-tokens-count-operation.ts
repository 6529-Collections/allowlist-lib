import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { ItemSortWalletsByTotalTokensCountParams } from './item-sort-wallets-by-total-tokens-count.types';
import { AllowlistState } from '../../state-types/allowlist-state';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { BadInputError } from '../../bad-input.error';
import { getItemPath } from '../../../utils/path.utils';
import { getTokenPoolContractOrIdIfCustom } from '../../../utils/pool.utils';

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

  async execute({
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
    const contractOrCustomPoolId = getTokenPoolContractOrIdIfCustom({
      poolId: item.poolId,
      poolType: item.poolType,
      state,
    });
    const { blockNo, contract, consolidateBlockNo } =
      state.phases[phaseId].components[componentId].items[itemId];
    const sorter = state.getSorter(contractOrCustomPoolId);
    state.phases[phaseId].components[componentId].items[itemId].tokens =
      await sorter.sortByTotalTokensCount({
        tokens: item.tokens,
        blockNo: blockNo,
        consolidateBlockNo: consolidateBlockNo,
        contract: contract,
      });

    this.logger.info(`Item sorted by wallet total tokens count '${itemId}'`);
  }
}
