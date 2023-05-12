import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { getComponentPath } from '../../../utils/path.utils';
import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { AllowlistState } from '../../state-types/allowlist-state';
import { ComponentAddSpotsToAllItemWalletsParams } from './component-add-spots-to-all-item-wallets.types';

export class ComponentAddSpotsToAllItemWalletsOperation
  implements AllowlistOperationExecutor
{
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(
      ComponentAddSpotsToAllItemWalletsOperation.name,
    );
  }

  validate(params: any): params is ComponentAddSpotsToAllItemWalletsParams {
    if (!params.hasOwnProperty('componentId')) {
      throw new Error(`Missing componentId`);
    }

    if (typeof params.componentId !== 'string') {
      throw new Error(`Invalid componentId`);
    }

    if (!params.componentId.length) {
      throw new Error(`Invalid componentId`);
    }
    if (!params.hasOwnProperty('spots')) {
      throw new Error(`Missing spots`);
    }

    if (typeof params.spots !== 'number') {
      throw new Error(`Invalid spots`);
    }

    if (params.spots < 1) {
      throw new Error(`Invalid spots`);
    }

    if (!Number.isInteger(params.spots)) {
      throw new Error(`Invalid spots`);
    }

    return true;
  }

  execute({
    params,
    state,
  }: {
    params: ComponentAddSpotsToAllItemWalletsParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new Error(`Invalid params`);
    }
    const { componentId, spots } = params;
    const { phaseId } = getComponentPath({ state, componentId });
    if (!phaseId) {
      throw new Error(
        `COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS: Component '${componentId}' does not exist, componentId: ${componentId} `,
      );
    }

    const wallets = Object.values(
      state.phases[phaseId].components[componentId].items,
    ).flatMap((item) => item.tokens.map((token) => token.owner));

    const uniqueWallets = [...new Set(wallets)];
    for (const wallet of uniqueWallets) {
      if (!state.phases[phaseId].components[componentId].winners[wallet]) {
        state.phases[phaseId].components[componentId].winners[wallet] = 0;
      }
      state.phases[phaseId].components[componentId].winners[wallet] += spots;
    }

    this.logger.info(
      `Added ${spots} spots to all item wallets in component '${componentId}'`,
    );
  }
}
