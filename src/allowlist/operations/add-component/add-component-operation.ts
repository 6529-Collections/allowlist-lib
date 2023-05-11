import { AllowlistState } from 'src/allowlist/state-types/allowlist-state';
import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { AllowlistAddComponentParams } from './add-component-operation.types';
import { BadInputError } from '../../bad-input.error';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';

export class AddComponentOperation implements AllowlistOperationExecutor {
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(AddComponentOperation.name);
  }

  execute({
    params,
    state,
  }: {
    params: AllowlistAddComponentParams;
    state: AllowlistState;
  }) {
    const { phaseId, id, name, description } = params;
    if (!state.phases[params.phaseId]) {
      throw new BadInputError(`Phase '${phaseId}' does not exist`);
    }
    state.phases[phaseId].components[id] = {
      id,
      name,
      description,
      items: {},
      _insertionOrder: Object.keys(state.phases[phaseId].components).length,
    };
    this.logger.info(`Created component ${name}`);
  }
}
