import { AllowlistOperationExecutor } from 'src/allowlist/allowlist-operation-executor';
import { AllowlistState } from 'src/allowlist/state-types/allowlist-state';
import { DescribableEntity } from 'src/allowlist/state-types/describable-entity';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { BadInputError } from '../../bad-input.error';

export class AddPhaseOperation implements AllowlistOperationExecutor {
  private logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(AddPhaseOperation.name);
  }

  validate(params: any): params is DescribableEntity {
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
    params: DescribableEntity;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
    state.phases[params.id] = {
      ...params,
      components: {},
      _insertionOrder: Object.keys(state.phases).length,
    };
    this.logger.info(`Created phase ${params.name}`);
  }
}
