import { AddPhaseOperation } from './add-phase-operation';
import { anAllowlistState } from '../../state-types/allowlist-state.test.fixture';
import { defaultLogFactory } from '../../../logging/logging-emitter';

describe('AddPhaseOperation', () => {
  const op = new AddPhaseOperation(defaultLogFactory);

  it('should throw an error if id is missing', () => {
    expect(() =>
      op.validate({
        name: 'Phase 1',
        description: 'Phase 1 description',
      }),
    ).toThrowError('Missing id');
  });

  it('should throw an error if id is not a string', () => {
    expect(() =>
      op.validate({
        id: 1,
        name: 'Phase 1',
        description: 'Phase 1 description',
      }),
    ).toThrowError('Invalid id');
  });

  it('should throw an error if id is empty', () => {
    expect(() =>
      op.validate({
        id: '',
        name: 'Phase 1',
        description: 'Phase 1 description',
      }),
    ).toThrowError('Invalid id');
  });

  it('should throw an error if name is missing', () => {
    expect(() =>
      op.validate({
        id: 'phase-1',
        description: 'Phase 1 description',
      }),
    ).toThrowError('Missing name');
  });

  it('should throw an error if name is not a string', () => {
    expect(() =>
      op.validate({
        id: 'phase-1',
        name: 1,
        description: 'Phase 1 description',
      }),
    ).toThrowError('Invalid name');
  });

  it('should throw an error if name is empty', () => {
    expect(() =>
      op.validate({
        id: 'phase-1',
        name: '',
        description: 'Phase 1 description',
      }),
    ).toThrowError('Invalid name');
  });

  it('should throw an error if description is missing', () => {
    expect(() =>
      op.validate({
        id: 'phase-1',
        name: 'Phase 1',
      }),
    ).toThrowError('Missing description');
  });

  it('should throw an error if description is not a string', () => {
    expect(() =>
      op.validate({
        id: 'phase-1',
        name: 'Phase 1',
        description: 1,
      }),
    ).toThrowError('Invalid description');
  });

  it('should throw an error if description is empty', () => {
    expect(() =>
      op.validate({
        id: 'phase-1',
        name: 'Phase 1',
        description: '',
      }),
    ).toThrowError('Invalid description');
  });

  it('should validate a valid params object', () => {
    expect(() =>
      op.validate({
        id: 'phase-1',
        name: 'Phase 1',
        description: 'Phase 1 description',
      }),
    ).not.toThrowError();
  });

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
