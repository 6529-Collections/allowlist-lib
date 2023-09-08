import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { AllowlistState } from '../../state-types/allowlist-state';
import { DescribableEntity } from '../../state-types/describable-entity';
import { BadInputError } from '../../bad-input.error';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';

/**
 *
 * The `CREATE_ALLOWLIST` operation serves as the foundational stone for curating allowlists within the Janus NFT distribution system. Similar to the main function in numerous programming languages, this operation not only kickstarts the allowlist creation but also ensures that a structured, identifiable, and descriptive scaffold is in place for subsequent operations.
 *
 */
export class CreateAllowlistOperation implements AllowlistOperationExecutor {
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(CreateAllowlistOperation.name);
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
    if (state.allowlist) {
      throw new BadInputError('Allowlist already exists');
    }

    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
    state.allowlist = {
      id: params.id,
      name: params.name,
      description: params.description,
    };
    this.logger.info(`Created allowlist ${params.name}`);
  }
}
