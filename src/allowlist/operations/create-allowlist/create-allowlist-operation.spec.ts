import { createAllowlistState } from '../../state-types/allowlist-state';
import { CreateAllowlistOperation } from './create-allowlist-operation';
import { anAllowlistState } from '../../state-types/allowlist-state.test.fixture';
import { defaultLogFactory } from '../../../logging/logging-emitter';

describe('CreateAllowlistOperation', () => {
  const op = new CreateAllowlistOperation(defaultLogFactory);
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

  it('should throw an error if phase id is not globally unique', () => {
    const state = createAllowlistState();

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
