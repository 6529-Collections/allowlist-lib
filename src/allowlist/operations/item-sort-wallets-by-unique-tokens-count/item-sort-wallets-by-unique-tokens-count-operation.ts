import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { ItemSortWalletsByUniqueTokensCountParams } from './item-sort-wallets-by-unique-tokens-count.types';
import { AllowlistState } from '../../state-types/allowlist-state';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { BadInputError } from '../../bad-input.error';
import { getItemPath } from '../../../utils/path.utils';
import { getTokenPoolContractOrIdIfCustom } from '../../../utils/pool.utils';

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

  async execute({
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

    const { tokens, poolId, poolType, blockNo, contract, consolidateBlockNo } =
      state.phases[phaseId].components[componentId].items[itemId];

    const contractOrCustomPoolId = getTokenPoolContractOrIdIfCustom({
      poolId,
      poolType,
      state,
    });

    const sorter = state.getSorter(contractOrCustomPoolId);
    state.phases[phaseId].components[componentId].items[itemId].tokens =
      await sorter.sortByUniqueTokensCount({
        tokens,
        blockNo,
        contract,
        consolidateBlockNo,
      });
    this.logger.info(`Item sorted by wallet unique tokens count: ${itemId}`);
  }
}
