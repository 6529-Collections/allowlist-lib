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

  private getWalletDelegation({
    wallet,
    delegationMap,
  }: {
    wallet: string;
    delegationMap: {
      mintingContract: Record<string, string>;
      mintingAny: Record<string, string>;
      allContract: Record<string, string>;
      allAny: Record<string, string>;
    };
  }): string {
    return (
      delegationMap.mintingContract[wallet] ??
      delegationMap.mintingAny[wallet] ??
      delegationMap.allContract[wallet] ??
      delegationMap.allAny[wallet] ??
      wallet
    );
  }

  private mapWinnersDelegations({
    winners,
    delegationMap,
  }: {
    winners: Record<string, number>;
    delegationMap: {
      mintingContract: Record<string, string>;
      mintingAny: Record<string, string>;
      allContract: Record<string, string>;
      allAny: Record<string, string>;
    };
  }): Record<string, number> {
    const mappedWinners: Record<string, number> = {};
    for (const winner of Object.keys(winners)) {
      const delegatedWallet = this.getWalletDelegation({
        wallet: winner,
        delegationMap,
      });
      if (!mappedWinners[delegatedWallet]) {
        mappedWinners[delegatedWallet] = 0;
      }

      mappedWinners[delegatedWallet] += winners[winner];
    }
    return mappedWinners;
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
    const block = null;
    const useCases = ['1', '2'];
    const anyCollection = '0x8888888888888888888888888888888888888888';

    const delegations = (
      await this.seizeApi.getAllDelegations({
        block,
        collections: [delegationContract, anyCollection],
        useCases,
      })
    ).sort((a, d) => a.block - d.block);

    const delegationMap = delegations.reduce<{
      mintingContract: Record<string, string>;
      mintingAny: Record<string, string>;
      allContract: Record<string, string>;
      allAny: Record<string, string>;
    }>(
      (acc, curr) => {
        if (curr.collection === delegationContract && curr.use_case === 2) {
          acc.mintingContract[curr.from_address] = curr.to_address;
        } else if (
          curr.collection === delegationContract &&
          curr.use_case === 1
        ) {
          acc.allContract[curr.from_address] = curr.to_address;
        } else if (curr.collection === anyCollection && curr.use_case === 2) {
          acc.mintingAny[curr.from_address] = curr.to_address;
        } else if (curr.collection === anyCollection && curr.use_case === 1) {
          acc.allAny[curr.from_address] = curr.to_address;
        }
        return acc;
      },
      {
        mintingContract: {},
        mintingAny: {},
        allContract: {},
        allAny: {},
      },
    );

    for (const phaseKey of Object.keys(state.phases)) {
      for (const componentKey of Object.keys(
        state.phases[phaseKey].components,
      )) {
        const delegatedWinners = this.mapWinnersDelegations({
          winners: state.phases[phaseKey].components[componentKey].winners,
          delegationMap,
        });
        state.phases[phaseKey].components[componentKey].winners =
          delegatedWinners;
      }
    }
    this.logger.info('Executed MapResultsToDelegatedWallets operation');
  }
}
