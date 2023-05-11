import { AllowlistState } from 'src/allowlist/state-types/allowlist-state';
import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { AllowlistAddItemParams } from './add-item-operation.types';
import { BadInputError } from '../../bad-input.error';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';

export class AddItemOperation implements AllowlistOperationExecutor {
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(AddItemOperation.name);
  }

  execute({
    params,
    state,
  }: {
    params: AllowlistAddItemParams;
    state: AllowlistState;
  }) {
    const { componentId, id, name, description } = params;
    const phase = Object.values(state.phases).find(
      (phase) => !!phase.components[componentId],
    );
    const phaseId = phase?.id;
    if (!phaseId) {
      throw new BadInputError(`Component '${componentId}' does not exist`);
    }
    state.phases[phaseId].components[componentId].items[id] = {
      id,
      name,
      description,
      _insertionOrder: Object.keys(
        state.phases[phaseId].components[componentId].items,
      ).length,
    };
    this.logger.info(`Created item ${name}`);
  }
}
