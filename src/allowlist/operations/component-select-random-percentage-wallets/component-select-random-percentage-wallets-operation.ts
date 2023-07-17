import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { ComponentSelectRandomPercentageWalletsParams } from './component-select-random-percentage-wallets.types';
import { AllowlistState } from '../../../allowlist/state-types/allowlist-state';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { BadInputError } from '../../bad-input.error';
import { pickRandomItemsWithSeed } from '../../../utils/app.utils';
import { getComponentPath } from '../../../utils/path.utils';

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
      throw new Error('Invalid percentage');
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
    const { componentId, percentage, seed } = params;
    const { phaseId } = getComponentPath({ state, componentId });
    if (!phaseId) {
      throw new BadInputError(
        `COMPONENT_SELECT_RANDOM_PERCENTAGE_WALLETS: Component '${componentId}' does not exist, componentId: ${componentId}`,
      );
    }
    const allWallets = Array.from(
      new Set(
        Object.values(
          state.phases[phaseId].components[componentId].items,
        ).flatMap((item) => item.tokens.flatMap((token) => token.owner)),
      ),
    );

    const count = Math.floor((allWallets.length * percentage) / 100);

    const selectedWallets = new Set(
      pickRandomItemsWithSeed({
        array: allWallets,
        count: allWallets.length < count ? allWallets.length : count,
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
