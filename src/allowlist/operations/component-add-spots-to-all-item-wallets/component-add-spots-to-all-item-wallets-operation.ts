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

  execute({
    params,
    state,
  }: {
    params: ComponentAddSpotsToAllItemWalletsParams;
    state: AllowlistState;
  }) {
    const { componentId, spots } = params;
    const { phaseId } = getComponentPath({ state, componentId });
    if (!phaseId) {
      throw new Error(
        `COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS: Component '${componentId}' does not exist, componentId: ${componentId} `,
      );
    }

    if (typeof spots !== 'number' || spots < 0) {
      throw new Error(
        `COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS: Invalid spots provided, componentId: ${componentId}`,
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
