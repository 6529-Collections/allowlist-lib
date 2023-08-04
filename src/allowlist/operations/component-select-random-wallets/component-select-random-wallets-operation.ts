import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { ComponentSelectRandomWalletsParams } from './component-select-random-wallets.types';
import { AllowlistState } from '../../../allowlist/state-types/allowlist-state';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { BadInputError } from '../../bad-input.error';
import { getComponentPath } from '../../../utils/path.utils';
import {
  getOwnersByCardStatistics,
  pickRandomUniqueItemsWithSeed,
} from '../../../utils/app.utils';
import { Pool } from '../../../app-types';
import { getTokenPoolContractOrIdIfCustom } from '../../../utils/pool.utils';
import { getWalletsByComponent } from '../../../utils/component.utils';

export class ComponentSelectRandomWalletsOperation
  implements AllowlistOperationExecutor
{
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(
      ComponentSelectRandomWalletsOperation.name,
    );
  }

  validate(params: any): params is ComponentSelectRandomWalletsParams {
    if (!params.hasOwnProperty('componentId')) {
      throw new BadInputError('Missing componentId');
    }

    if (typeof params.componentId !== 'string') {
      throw new BadInputError('Invalid componentId');
    }

    if (!params.componentId.length) {
      throw new BadInputError('Invalid componentId');
    }

    if (!params.hasOwnProperty('count')) {
      throw new BadInputError('Missing count');
    }

    if (typeof params.count !== 'number') {
      throw new BadInputError('Invalid count');
    }

    if (params.count < 1) {
      throw new BadInputError('Invalid count');
    }

    if (!Number.isInteger(params.count)) {
      throw new BadInputError('Invalid count');
    }

    if (!params.hasOwnProperty('seed')) {
      throw new BadInputError('Missing seed');
    }

    if (typeof params.seed !== 'string') {
      throw new BadInputError('Invalid seed');
    }

    if (!params.seed.length) {
      throw new BadInputError('Invalid seed');
    }

    return true;
  }

  execute({
    params,
    state,
  }: {
    params: ComponentSelectRandomWalletsParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
    const { componentId, count, seed, weightType } = params;
    const { phaseId } = getComponentPath({ state, componentId });
    if (!phaseId) {
      throw new BadInputError(
        `COMPONENT_SELECT_RANDOM_WALLETS: Component '${componentId}' does not exist, componentId: ${componentId}`,
      );
    }

    const wallets = getWalletsByComponent({
      state,
      phaseId,
      componentId,
      weightType: weightType ?? null,
    });
    const uniqueCount = new Set(wallets).size;

    const selectedWallets = pickRandomUniqueItemsWithSeed({
      array: wallets,
      count: uniqueCount < count ? uniqueCount : count,
      seed,
    });

    for (const itemKey of Object.keys(
      state.phases[phaseId].components[componentId].items,
    )) {
      const tokens =
        state.phases[phaseId].components[componentId].items[itemKey].tokens;
      state.phases[phaseId].components[componentId].items[itemKey].tokens =
        tokens.filter((token) => selectedWallets.has(token.owner));
    }
    this.logger.info('Executed ComponentSelectRandomWallets operation');
  }
}
