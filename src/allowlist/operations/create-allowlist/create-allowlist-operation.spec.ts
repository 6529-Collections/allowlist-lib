import { createAllowlistState } from '../../state-types/allowlist-state';
import { CreateAllowlistOperation } from './create-allowlist-operation';
import { anAllowlistState } from '../../state-types/allowlist-state.test.fixture';
import { defaultLogFactory } from '../../../logging/logging-emitter';
import { SeizeApi } from '../../../services/seize/seize.api';

describe('CreateAllowlistOperation', () => {
  const op = new CreateAllowlistOperation(defaultLogFactory);

  it('throws if id is missing', () => {
    expect(() =>
      op.validate({
        name: 'allowlist 1',
        description: 'allowlist 1 description',
      }),
    ).toThrow('Missing id');
  });

  it('throws if id is not a string', () => {
    expect(() =>
      op.validate({
        id: 1,
        name: 'allowlist 1',
        description: 'allowlist 1 description',
      }),
    ).toThrow('Invalid id');
  });

  it('throws if id is empty', () => {
    expect(() =>
      op.validate({
        id: '',
        name: 'allowlist 1',
        description: 'allowlist 1 description',
      }),
    ).toThrow('Invalid id');
  });

  it('throws if name is missing', () => {
    expect(() =>
      op.validate({
        id: 'allowlist-1',
        description: 'allowlist 1 description',
      }),
    ).toThrow('Missing name');
  });

  it('throws if name is not a string', () => {
    expect(() =>
      op.validate({
        id: 'allowlist-1',
        name: 1,
        description: 'allowlist 1 description',
      }),
    ).toThrow('Invalid name');
  });

  it('throws if name is empty', () => {
    expect(() =>
      op.validate({
        id: 'allowlist-1',
        name: '',
        description: 'allowlist 1 description',
      }),
    ).toThrow('Invalid name');
  });

  it('throws if description is missing', () => {
    expect(() =>
      op.validate({
        id: 'allowlist-1',
        name: 'allowlist 1',
      }),
    ).toThrow('Missing description');
  });

  it('throws if description is not a string', () => {
    expect(() =>
      op.validate({
        id: 'allowlist-1',
        name: 'allowlist 1',
        description: 1,
      }),
    ).toThrow('Invalid description');
  });

  it('throws if description is empty', () => {
    expect(() =>
      op.validate({
        id: 'allowlist-1',
        name: 'allowlist 1',
        description: '',
      }),
    ).toThrow('Invalid description');
  });

  it('should validate params', () => {
    expect(() =>
      op.validate({
        id: 'allowlist-1',
        name: 'allowlist 1',
        description: 'allowlist 1 description',
      }),
    ).not.toThrow();
  });

  it('throws error if already exists', () => {
    const state = anAllowlistState();
    expect(() =>
      op.execute({
        params: {
          id: 'allowlist-2',
          name: 'allowlist 2',
          description: 'allowlist 2 description',
        },
        state: state,
      }),
    ).toThrowError('Allowlist already exists');
  });

  it('should add allowlist', () => {
    const state = createAllowlistState(undefined as SeizeApi);

    op.execute({
      params: {
        id: 'allowlist-2',
        name: 'allowlist 2',
        description: 'allowlist 2 description',
      },
      state: state,
    });
    expect(state.allowlist.id).toEqual('allowlist-2');
  });
});
