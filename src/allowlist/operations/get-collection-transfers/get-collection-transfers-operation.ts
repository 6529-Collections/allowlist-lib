import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { AllowlistState } from '../../state-types/allowlist-state';
import { isEthereumAddress } from '../../../utils/validators';

import { BadInputError } from '../../bad-input.error';
import { TransfersService } from '../../../services/transfers.service';
import { GetCollectionTransferRequest } from './get-collection-transfers-operation.types';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';

export class GetCollectionTransfersOperation
  implements AllowlistOperationExecutor
{
  private logger: Logger;

  constructor(
    private readonly transfersService: TransfersService,
    loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.create(GetCollectionTransfersOperation.name);
  }

  async execute({
    params,
    state,
  }: {
    params: GetCollectionTransferRequest;
    state: AllowlistState;
  }) {
    const { contract, blockNo, id } = params;
    if (!isEthereumAddress(contract)) {
      throw new BadInputError(
        `GET_COLLECTION_TRANSFERS: ${contract} is not a valid Ethereum address, poolId: ${id}`,
      );
    }
    if (typeof blockNo !== 'number' || blockNo < 1) {
      throw new BadInputError(
        `GET_COLLECTION_TRANSFERS: ${blockNo} is not a valid block number, poolId: ${id}`,
      );
    }
    const transfers = await this.transfersService.getCollectionTransfers({
      contract,
      blockNo,
    });
    state.transferPools[params.id] = { ...params, transfers };
    this.logger.info(`Transferpool ${params.id} created`);
  }
}
