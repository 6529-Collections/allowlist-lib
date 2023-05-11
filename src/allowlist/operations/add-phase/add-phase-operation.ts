import { AllowlistOperationExecutor } from 'src/allowlist/allowlist-operation-executor';
import { AllowlistState } from 'src/allowlist/state-types/allowlist-state';
import { DescribableEntity } from 'src/allowlist/state-types/describable-entity';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';

export class AddPhaseOperation implements AllowlistOperationExecutor {
  private logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(AddPhaseOperation.name);
  }

  execute({
    params,
    state,
  }: {
    params: DescribableEntity;
    state: AllowlistState;
  }) {
    state.phases[params.id] = {
      ...params,
      components: {},
      _insertionOrder: Object.keys(state.phases).length,
    };
    this.logger.info(`Created phase ${params.name}`);
  }
}
