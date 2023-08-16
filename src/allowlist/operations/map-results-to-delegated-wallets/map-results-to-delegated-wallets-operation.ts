import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { MapResultsToDelegatedWalletsParams } from './map-results-to-delegated-wallets.types';
import { AllowlistState } from '../../../allowlist/state-types/allowlist-state';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { BadInputError } from '../../bad-input.error';
import { isEthereumAddress } from '../../../utils/validators';
import { SeizeApi } from '../../../services/seize/seize.api';

export class MapResultsToDelegatedWalletsOperation
  implements AllowlistOperationExecutor
{
  private readonly logger: Logger;

  constructor(
    private readonly seizeApi: SeizeApi,
    loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.create(
      MapResultsToDelegatedWalletsOperation.name,
    );
  }

  validate(params: any): params is MapResultsToDelegatedWalletsParams {
    if (!params.hasOwnProperty('delegationContract')) {
      throw new BadInputError('Missing delegationContract');
    }

    if (typeof params.delegationContract !== 'string') {
      throw new BadInputError('Invalid delegationContract');
    }

    if (!params.delegationContract.length) {
      throw new BadInputError('Invalid delegationContract');
    }

    if (!isEthereumAddress(params.delegationContract)) {
      throw new BadInputError('Invalid delegationContract');
    }

    return true;
  }

  async execute({
    params,
    state,
  }: {
    params: MapResultsToDelegatedWalletsParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }

    const { delegationContract } = params;

    const delegationsForTargetContract = await this.seizeApi.getAllDelegations({
      block: null,
      collections: [delegationContract],
      useCases: ['1', '2'],
    });

    const delectationsForAnyContract = await this.seizeApi.getAllDelegations({
      block: null,
      collections: ['0x8888888888888888888888888888888888888888'],
      useCases: ['1', '2'],
    });

    // console.log(delectationsForAnyContract);
    // MAKE SURE IF THERE IS 2 DIFFERENT WALLETS TO DELEGATED TO THE SAME CONTRACT, THAT THEY ARE MERGED TOGETHER

    // for (const phaseKey of Object.keys(state.phases)) {
    //   for (const componentKey of Object.keys(
    //     state.phases[phaseKey].components,
    //   )) {
    //     console.log(state.phases[phaseKey].components[componentKey].winners);
    //   }
    // }
    this.logger.info('Executed MapResultsToDelegatedWallets operation');
  }
}
