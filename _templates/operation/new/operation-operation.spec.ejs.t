---
to: src/allowlist/operations/<%= h.changeCase.paramCase(operationName) %>/<%= h.changeCase.paramCase(operationName) %>-operation.spec.ts
unless_exists: true
---
import { <%= operationName %>Operation } from './<%= h.changeCase.paramCase(operationName) %>-operation';
import { defaultLogFactory } from './../../../logging/logging-emitter';
import { AllowlistState } from './../../../allowlist/state-types/allowlist-state';
import { <%= operationName %>Params } from './<%= h.changeCase.paramCase(operationName) %>.types';
import { anAllowlistState } from '../../../allowlist/state-types/allowlist-state.test.fixture';

describe('<%= operationName %>Operation', () => {
  const op = new <%= operationName %>Operation(defaultLogFactory);
  let state: AllowlistState;
  let params: <%= operationName %>Params;

  beforeEach(() => {
    state = anAllowlistState();
    params = {};
  });

  it('should be defined', () => {
    expect(true).toBeDefined();
  });
});
