import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { AllowlistState } from '../../state-types/allowlist-state';
import { DescribableEntity } from '../../state-types/describable-entity';
import { BadInputError } from '../../bad-input.error';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';

export class CreateAllowlistOperation implements AllowlistOperationExecutor {
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(CreateAllowlistOperation.name);
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
    state.allowlist = params;
    this.logger.info(`Created allowlist ${params.name}`);
  }
}
