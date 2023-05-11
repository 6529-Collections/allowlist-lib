import { AddComponentOperation } from './add-component-operation';
import { AllowlistAddComponentParams } from './add-component-operation.types';
import {
  anAllowlistState,
  anEmptyPhase,
} from '../../state-types/allowlist-state.test.fixture';
import { defaultLogFactory } from '../../../logging/logging-emitter';

describe('AddComponentOperation', () => {
  const op = new AddComponentOperation(defaultLogFactory);

  let anAddComponentParams: AllowlistAddComponentParams;

  beforeEach(() => {
    anAddComponentParams = {
      id: 'component-1',
      phaseId: 'phase-1',
      name: 'Component 1',
      description: 'Component 1 description',
    };
  });

  it('should add a new component', () => {
    const phase = anEmptyPhase();
    const state = anAllowlistState({
      phases: [phase],
    });
    op.execute({
      params: anAddComponentParams,
      state: state,
    });
    expect(
      state.phases[phase.id].components[anAddComponentParams.id],
    ).toBeDefined();
  });

  it('should throw an error if phase does not exist', () => {
    const state = anAllowlistState({ phases: [] });
    expect(() =>
      op.execute({
        params: anAddComponentParams,
        state: state,
      }),
    ).toThrowError(`Phase '${anAddComponentParams.phaseId}' does not exist`);
  });
});
