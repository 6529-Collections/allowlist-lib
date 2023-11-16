import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { AllowlistAddComponentParams } from './add-component-operation.types';
import { BadInputError } from '../../bad-input.error';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { AllowlistState } from '../../state-types/allowlist-state';

export class AddComponentOperation implements AllowlistOperationExecutor {
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(AddComponentOperation.name);
  }

  validate(params: any): params is AllowlistAddComponentParams {
    if (!params.hasOwnProperty('phaseId')) {
      throw new BadInputError('Missing phaseId');
    }

    if (typeof params.phaseId !== 'string') {
      throw new BadInputError('Invalid phaseId');
    }

    if (!params.phaseId.length) {
      throw new BadInputError('Invalid phaseId');
    }

    if (!params.hasOwnProperty('id')) {
      throw new BadInputError('Missing id');
    }

    if (typeof params.id !== 'string') {
      throw new BadInputError('Invalid id');
    }

    if (!params.id.length) {
      throw new BadInputError('Invalid id');
    }

    if (!params.hasOwnProperty('name')) {
      throw new BadInputError('Missing name');
    }

    if (typeof params.name !== 'string') {
      throw new BadInputError('Invalid name');
    }

    if (!params.name.length) {
      throw new BadInputError('Invalid name');
    }

    if (!params.hasOwnProperty('description')) {
      throw new BadInputError('Missing description');
    }

    if (typeof params.description !== 'string') {
      throw new BadInputError('Invalid description');
    }

    if (!params.description.length) {
      throw new BadInputError('Invalid description');
    }

    return true;
  }

  execute({
    params,
    state,
  }: {
    params: AllowlistAddComponentParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
    const { phaseId, id, name, description } = params;
    if (!state.phases[params.phaseId]) {
      throw new BadInputError(`Phase '${phaseId}' does not exist`);
    }
    state.phases[phaseId].components[id] = {
      id,
      name,
      description,
      items: {},
      winners: {},
      _insertionOrder: Object.keys(state.phases[phaseId].components).length,
    };
    this.logger.info(`Created component ${name}`);
  }
}
