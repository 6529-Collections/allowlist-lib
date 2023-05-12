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

  it('should throw an error if id is missing', () => {
    expect(() =>
      op.validate({
        phaseId: 'phase-1',
        name: 'Component 1',
        description: 'Component 1 description',
      }),
    ).toThrowError('Missing id');
  });

  it('should throw an error if id is not a string', () => {
    expect(() =>
      op.validate({
        id: 1,
        phaseId: 'phase-1',
        name: 'Component 1',
        description: 'Component 1 description',
      }),
    ).toThrowError('Invalid id');
  });

  it('should throw an error if id is empty', () => {
    expect(() =>
      op.validate({
        id: '',
        phaseId: 'phase-1',
        name: 'Component 1',
        description: 'Component 1 description',
      }),
    ).toThrowError('Invalid id');
  });

  it('should throw an error if phaseId is missing', () => {
    expect(() =>
      op.validate({
        id: 'component-1',
        name: 'Component 1',
        description: 'Component 1 description',
      }),
    ).toThrowError('Missing phaseId');
  });

  it('should throw an error if phaseId is not a string', () => {
    expect(() =>
      op.validate({
        id: 'component-1',
        phaseId: 1,
        name: 'Component 1',
        description: 'Component 1 description',
      }),
    ).toThrowError('Invalid phaseId');
  });

  it('should throw an error if phaseId is empty', () => {
    expect(() =>
      op.validate({
        id: 'component-1',
        phaseId: '',
        name: 'Component 1',
        description: 'Component 1 description',
      }),
    ).toThrowError('Invalid phaseId');
  });

  it('should throw an error if name is missing', () => {
    expect(() =>
      op.validate({
        id: 'component-1',
        phaseId: 'phase-1',
        description: 'Component 1 description',
      }),
    ).toThrowError('Missing name');
  });

  it('should throw an error if name is not a string', () => {
    expect(() =>
      op.validate({
        id: 'component-1',
        phaseId: 'phase-1',
        name: 1,
        description: 'Component 1 description',
      }),
    ).toThrowError('Invalid name');
  });

  it('should throw an error if name is empty', () => {
    expect(() =>
      op.validate({
        id: 'component-1',
        phaseId: 'phase-1',
        name: '',
        description: 'Component 1 description',
      }),
    ).toThrowError('Invalid name');
  });

  it('should throw an error if description is missing', () => {
    expect(() =>
      op.validate({
        id: 'component-1',
        phaseId: 'phase-1',
        name: 'Component 1',
      }),
    ).toThrowError('Missing description');
  });

  it('should throw an error if description is not a string', () => {
    expect(() =>
      op.validate({
        id: 'component-1',
        phaseId: 'phase-1',
        name: 'Component 1',
        description: 1,
      }),
    ).toThrowError('Invalid description');
  });

  it('should throw an error if description is empty', () => {
    expect(() =>
      op.validate({
        id: 'component-1',
        phaseId: 'phase-1',
        name: 'Component 1',
        description: '',
      }),
    ).toThrowError('Invalid description');
  });

  it('should validate params', () => {
    expect(() =>
      op.validate({
        id: 'component-1',
        phaseId: 'phase-1',
        name: 'Component 1',
        description: 'Component 1 description',
      }),
    ).not.toThrowError();
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
