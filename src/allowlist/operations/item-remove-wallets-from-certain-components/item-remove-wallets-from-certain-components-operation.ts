import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { ItemRemoveWalletsFromCertainComponentsParams } from './item-remove-wallets-from-certain-components.types';
import { AllowlistState } from '../../../allowlist/state-types/allowlist-state';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { BadInputError } from '../../bad-input.error';
import { getComponentPath, getItemPath } from '../../../utils/path.utils';
import { AllowlistItemToken } from '../../state-types/allowlist-item';

export class ItemRemoveWalletsFromCertainComponentsOperation
  implements AllowlistOperationExecutor
{
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(
      ItemRemoveWalletsFromCertainComponentsOperation.name,
    );
  }

  validate(
    params: any,
  ): params is ItemRemoveWalletsFromCertainComponentsParams {
    if (!params.hasOwnProperty('itemId')) {
      throw new BadInputError('Missing itemId');
    }

    if (typeof params.itemId !== 'string') {
      throw new BadInputError('Invalid itemId');
    }

    if (!params.itemId.length) {
      throw new BadInputError('Invalid itemId');
    }

    if (!params.hasOwnProperty('componentIds')) {
      throw new BadInputError('Missing componentIds');
    }

    if (!Array.isArray(params.componentIds)) {
      throw new BadInputError('Invalid componentIds');
    }

    if (!params.componentIds.length) {
      throw new BadInputError('Invalid componentIds');
    }

    if (
      params.componentIds.some((componentId) => typeof componentId !== 'string')
    ) {
      throw new BadInputError('Invalid componentIds');
    }

    if (params.componentIds.some((componentId) => !componentId.length)) {
      throw new BadInputError('Invalid componentIds');
    }

    return true;
  }

  execute({
    params,
    state,
  }: {
    params: ItemRemoveWalletsFromCertainComponentsParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
    const { itemId, componentIds } = params;
    const { phaseId, componentId } = getItemPath({ state, itemId });
    if (!phaseId || !componentId) {
      throw new BadInputError(`Item with id '${itemId}' does not exist`);
    }

    const removeComponentWallets: Set<string> = new Set();
    for (const removeComponentId of componentIds) {
      const { phaseId: removeComponentPhaseId } = getComponentPath({
        state,
        componentId: removeComponentId,
      });

      if (
        !removeComponentPhaseId ||
        !state.phases[removeComponentPhaseId].components[removeComponentId]
      ) {
        throw new BadInputError(
          `Component with id '${removeComponentId}' does not exist`,
        );
      }

      for (const wallet of Object.keys(
        state.phases[removeComponentPhaseId].components[removeComponentId]
          .winners,
      )) {
        removeComponentWallets.add(wallet);
      }
    }

    state.phases[phaseId].components[componentId].items[itemId].tokens =
      state.phases[phaseId].components[componentId].items[itemId].tokens.filter(
        (token: AllowlistItemToken) => !removeComponentWallets.has(token.owner),
      );

    this.logger.info(
      `Removed wallets what are in certain components from item with id '${itemId}'`,
    );
  }
}
