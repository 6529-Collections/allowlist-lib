import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { ComponentSelectRandomWalletsParams } from './component-select-random-wallets.types';
import { AllowlistState } from '../../../allowlist/state-types/allowlist-state';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { BadInputError } from '../../bad-input.error';
import { getComponentPath } from '../../../utils/path.utils';
import { pickRandomItemsWithSeed } from '../../../utils/app.utils';

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
      throw new Error('Invalid count');
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
    const { componentId, count, seed } = params;
    const { phaseId } = getComponentPath({ state, componentId });
    if (!phaseId) {
      throw new BadInputError(
        `COMPONENT_SELECT_RANDOM_WALLETS: Component '${componentId}' does not exist, componentId: ${componentId}`,
      );
    }
    const allWallets = new Set(
      Object.values(state.phases[phaseId].components).flatMap((component) =>
        Object.values(component.items).flatMap((item) =>
          item.tokens.flatMap((token) => token.owner),
        ),
      ),
    );

    const selectedWallets = new Set(
      pickRandomItemsWithSeed({
        array: Array.from(allWallets),
        count,
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

    console.log(
      JSON.stringify(state.phases[phaseId].components[componentId], null, 2),
    );

    this.logger.info('Executed ComponentSelectRandomWallets operation');
  }
}
