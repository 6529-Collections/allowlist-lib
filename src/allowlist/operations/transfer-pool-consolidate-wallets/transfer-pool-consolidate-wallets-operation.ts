import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { TransferPoolConsolidateWalletsParams } from './transfer-pool-consolidate-wallets.types';
import { AllowlistState } from '../../../allowlist/state-types/allowlist-state';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { BadInputError } from '../../bad-input.error';
import { SeizeApi } from '../../../services/seize/seize.api';

export class TransferPoolConsolidateWalletsOperation
  implements AllowlistOperationExecutor
{
  private readonly logger: Logger;

  constructor(
    private readonly seizeApi: SeizeApi,
    loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.create(
      TransferPoolConsolidateWalletsOperation.name,
    );
  }

  validate(params: any): params is TransferPoolConsolidateWalletsParams {
    if (!params.hasOwnProperty('transferPoolId')) {
      throw new BadInputError('Missing transferPoolId');
    }

    if (typeof params.transferPoolId !== 'string') {
      throw new BadInputError('Invalid transferPoolId');
    }

    if (!params.transferPoolId.length) {
      throw new BadInputError('Invalid transferPoolId');
    }

    if (!params.hasOwnProperty('consolidationBlockNumber')) {
      throw new BadInputError('Missing consolidationBlockNumber');
    }

    if (typeof params.consolidationBlockNumber !== 'number') {
      throw new BadInputError('Invalid consolidationBlockNumber');
    }

    if (params.consolidationBlockNumber < 0) {
      throw new BadInputError('Invalid consolidationBlockNumber');
    }

    if (params.consolidationBlockNumber % 1 !== 0) {
      throw new BadInputError('Invalid consolidationBlockNumber');
    }

    return true;
  }

  async execute({
    params,
    state,
  }: {
    params: TransferPoolConsolidateWalletsParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }

    if (!state.transferPools.hasOwnProperty(params.transferPoolId)) {
      throw new BadInputError(
        `Transfer pool ${params.transferPoolId} not found`,
      );
    }

    const consolidations = await this.seizeApi.getAllConsolidations({
      block: params.consolidationBlockNumber,
    });

    const consolidationsMap = consolidations.reduce<Record<string, string>>(
      (acc, curr) => {
        for (const wallet of curr.wallets) {
          acc[wallet] = curr.primary;
        }
        return acc;
      },
      {},
    );

    state.transferPools[params.transferPoolId].transfers = state.transferPools[
      params.transferPoolId
    ].transfers.map((transfer) => ({
      ...transfer,
    }));

    this.logger.info('Executed TransferPoolConsolidateWallets operation');
  }
}
