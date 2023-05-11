import { AddPhaseOperation } from './add-phase-operation';
import { anAllowlistState } from '../../state-types/allowlist-state.test.fixture';
import { defaultLogFactory } from '../../../logging/logging-emitter';

describe('AddPhaseOperation', () => {
  const op = new AddPhaseOperation(defaultLogFactory);
  it('should add a new phase with correct insertion order', () => {
    const state = anAllowlistState();
    op.execute({
      params: {
        id: 'phase-2',
        name: 'Phase 2',
        description: 'Phase 2 description',
      },
      state: state,
    });
    expect(state.phases['phase-2']._insertionOrder).toEqual(1);
  });
});
