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

  validate(params: any): params is GetCollectionTransferRequest {
    if (!params.hasOwnProperty('id')) {
      throw new BadInputError('Missing id');
    }
    if (typeof params.id !== 'string') {
      throw new BadInputError('Invalid id');
    }
    if (!params.id.length) {
      throw new BadInputError('Invalid id');
    }
    if (!params.hasOwnProperty('contract')) {
      throw new BadInputError('Missing contract');
    }
    if (typeof params.contract !== 'string') {
      throw new BadInputError('Invalid contract');
    }
    if (!params.contract.length) {
      throw new BadInputError('Invalid contract');
    }
    if (!isEthereumAddress(params.contract)) {
      throw new BadInputError('Invalid contract');
    }
    if (!params.hasOwnProperty('blockNo')) {
      throw new BadInputError('Missing blockNo');
    }
    if (typeof params.blockNo !== 'number') {
      throw new BadInputError('Invalid blockNo');
    }
    if (params.blockNo < 1) {
      throw new BadInputError('Invalid blockNo');
    }
    if (!Number.isInteger(params.blockNo)) {
      throw new BadInputError('Invalid blockNo');
    }
    return true;
  }

  async execute({
    params,
    state,
  }: {
    params: GetCollectionTransferRequest;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
    const { contract, blockNo, id } = params;

    const transfers = await this.transfersService.getCollectionTransfers({
      contract,
      blockNo,
    });
    state.transferPools[id] = { ...params, transfers };
    this.logger.info(`Transferpool ${id} created`);
  }
}
