import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { ComponentSelectRandomPercentageWalletsParams } from './component-select-random-percentage-wallets.types';
import { AllowlistState } from '../../../allowlist/state-types/allowlist-state';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { BadInputError } from '../../bad-input.error';
import { getComponentPath } from '../../../utils/path.utils';
import { pickRandomUniqueItemsWithSeed } from '../../../utils/app.utils';

import { getWalletsByComponent } from '../../../utils/component.utils';
import { CardStatistics } from '../../../app-types';

export class ComponentSelectRandomPercentageWalletsOperation
  implements AllowlistOperationExecutor
{
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(
      ComponentSelectRandomPercentageWalletsOperation.name,
    );
  }

  validate(
    params: any,
  ): params is ComponentSelectRandomPercentageWalletsParams {
    if (!params.hasOwnProperty('componentId')) {
      throw new BadInputError('Missing componentId');
    }

    if (typeof params.componentId !== 'string') {
      throw new BadInputError('Invalid componentId');
    }

    if (!params.componentId.length) {
      throw new BadInputError('Invalid componentId');
    }

    if (!params.hasOwnProperty('percentage')) {
      throw new BadInputError('Missing percentage');
    }

    if (typeof params.percentage !== 'number') {
      throw new BadInputError('Invalid percentage');
    }

    if (params.percentage < 0 || params.percentage > 100) {
      throw new BadInputError('Invalid percentage');
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

    if (params.hasOwnProperty('weightType')) {
      if (typeof params.weightType !== 'string') {
        throw new BadInputError('Invalid weightType');
      }

      if (!params.weightType.length) {
        throw new BadInputError('Invalid weightType');
      }

      if (!Object.values(CardStatistics).includes(params.weightType)) {
        throw new BadInputError('Invalid weightType');
      }
    }

    return true;
  }

  execute({
    params,
    state,
  }: {
    params: ComponentSelectRandomPercentageWalletsParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
    const { componentId, percentage, seed, weightType } = params;
    const { phaseId } = getComponentPath({ state, componentId });
    if (!phaseId) {
      throw new BadInputError(
        `COMPONENT_SELECT_RANDOM_PERCENTAGE_WALLETS: Component '${componentId}' does not exist, componentId: ${componentId}`,
      );
    }
    const wallets = getWalletsByComponent({
      state,
      phaseId,
      componentId,
      weightType: weightType ?? null,
    });

    const uniqueCount = new Set(wallets).size;
    const count = Math.floor((uniqueCount * percentage) / 100);

    const selectedWallets = new Set(
      pickRandomUniqueItemsWithSeed({
        array: wallets,
        count: uniqueCount < count ? uniqueCount : count,
        seed,
      }),
    );

    for (const itemKey of Object.keys(
      state.phases[phaseId].components[componentId].items,
    )) {
      const tokens =
        state.phases[phaseId].components[componentId].items[itemKey].tokens;
      state.phases[phaseId].components[componentId].items[itemKey].tokens =
        tokens.filter((token) => selectedWallets.has(token.owner));
    }

    this.logger.info(
      'Executed ComponentSelectRandomPercentageWallets operation',
    );
  }
}
