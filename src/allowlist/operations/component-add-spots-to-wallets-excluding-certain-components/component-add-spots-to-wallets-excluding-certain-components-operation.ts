import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { ComponentAddSpotsToWalletsExcludingCertainComponentsParams } from './component-add-spots-to-wallets-excluding-certain-components.types';
import { AllowlistState } from '../../../allowlist/state-types/allowlist-state';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { getComponentPath } from '../../../utils/path.utils';
import { BadInputError } from '../../bad-input.error';

export class ComponentAddSpotsToWalletsExcludingCertainComponentsOperation
  implements AllowlistOperationExecutor
{
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(
      ComponentAddSpotsToWalletsExcludingCertainComponentsOperation.name,
    );
  }

  validate(
    params: any,
  ): params is ComponentAddSpotsToWalletsExcludingCertainComponentsParams {
    if (!params.hasOwnProperty('componentId')) {
      throw new BadInputError('Missing componentId');
    }

    if (typeof params.componentId !== 'string') {
      throw new BadInputError('Invalid componentId');
    }

    if (!params.componentId.length) {
      throw new BadInputError('Invalid componentId');
    }

    if (!params.hasOwnProperty('spots')) {
      throw new BadInputError('Missing spots');
    }

    if (typeof params.spots !== 'number') {
      throw new Error('Invalid spots');
    }

    if (params.spots < 1) {
      throw new BadInputError('Invalid spots');
    }

    if (!Number.isInteger(params.spots)) {
      throw new BadInputError('Invalid spots');
    }

    if (!params.hasOwnProperty('excludedComponentIds')) {
      throw new BadInputError('Missing excludedComponentIds');
    }

    if (!Array.isArray(params.excludedComponentIds)) {
      throw new BadInputError('Invalid excludedComponentIds');
    }

    if (!params.excludedComponentIds.length) {
      throw new BadInputError('Invalid excludedComponentIds');
    }

    if (
      params.excludedComponentIds.some(
        (excludedComponentId) => typeof excludedComponentId !== 'string',
      )
    ) {
      throw new BadInputError('Invalid excludedComponentIds');
    }

    if (
      params.excludedComponentIds.some(
        (excludedComponentId) => !excludedComponentId.length,
      )
    ) {
      throw new BadInputError('Invalid excludedComponentIds');
    }

    return true;
  }

  execute({
    params,
    state,
  }: {
    params: ComponentAddSpotsToWalletsExcludingCertainComponentsParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
    const { componentId, spots, excludedComponentIds } = params;

    const { phaseId } = getComponentPath({ state, componentId });
    if (!phaseId) {
      throw new BadInputError(
        `COMPONENT_ADD_SPOTS_TO_WALLETS_EXCLUDING_CERTAIN_COMPONENTS: Component '${componentId}' does not exist, componentId: ${componentId}`,
      );
    }

    for (const excludedComponentId of excludedComponentIds) {
      const { phaseId: excludedPhaseId } = getComponentPath({
        state,
        componentId: excludedComponentId,
      });
      if (
        !excludedPhaseId ||
        !state.phases[excludedPhaseId].components[excludedComponentId]
      ) {
        throw new BadInputError(
          `COMPONENT_ADD_SPOTS_TO_WALLETS_EXCLUDING_CERTAIN_COMPONENTS: Excluded component '${excludedComponentId}' does not exist, componentId: ${componentId}`,
        );
      }
    }

    const componentWallets = [
      ...new Set(
        Object.values(
          state.phases[phaseId].components[componentId].items,
        ).flatMap((item) => item.tokens.map((token) => token.owner)),
      ),
    ];

    const excludedComponentWallets: Record<string, boolean> =
      excludedComponentIds.reduce<Record<string, boolean>>(
        (acc, excludedComponentId) => {
          const { phaseId: excludedPhaseId } = getComponentPath({
            state,
            componentId: excludedComponentId,
          });
          const wallets = Object.keys(
            state.phases[excludedPhaseId].components[excludedComponentId]
              .winners,
          );
          for (const wallet of wallets) {
            acc[wallet] = true;
          }
          return acc;
        },
        {},
      );

    for (const wallet of componentWallets) {
      if (excludedComponentWallets[wallet]) {
        continue;
      }
      if (!state.phases[phaseId].components[componentId].winners[wallet]) {
        state.phases[phaseId].components[componentId].winners[wallet] = 0;
      }

      state.phases[phaseId].components[componentId].winners[wallet] += spots;
    }

    this.logger.info(
      `Added spots to wallets excluding certain components, componentId: ${componentId}, spots: ${spots}, excludedComponentIds: ${excludedComponentIds}`,
    );
  }
}
