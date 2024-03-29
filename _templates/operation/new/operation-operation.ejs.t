---
to: src/allowlist/operations/<%= h.changeCase.paramCase(operationName) %>/<%= h.changeCase.paramCase(operationName) %>-operation.ts
unless_exists: true
---
import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { <%= operationName %>Params } from './<%= h.changeCase.paramCase(operationName) %>.types';
import { AllowlistState } from '../../../allowlist/state-types/allowlist-state';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';

export class <%= operationName %>Operation implements AllowlistOperationExecutor {
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(<%= operationName %>Operation.name);
  }

  validate(params: any): params is <%= operationName %>Params {
    return false;
  }

  execute({
    params,
    state,
  }: {
    params: <%= operationName %>Params;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new Error('Invalid params');
    }
    this.logger.info('Executed <%= operationName %> operation');
  }
}
