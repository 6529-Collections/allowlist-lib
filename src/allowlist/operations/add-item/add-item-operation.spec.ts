import { AddItemOperation } from './add-item-operation';
import {
  anAllowlistComponent,
  anAllowlistPhase,
  anAllowlistState,
} from '../../state-types/allowlist-state.test.fixture';
import { defaultLogFactory } from '../../../logging/logging-emitter';

describe('AddItemOperation', () => {
  const op = new AddItemOperation(defaultLogFactory);
  it('should add a new item with correct insertion order', () => {
    const state = anAllowlistState();
    op.execute({
      params: {
        componentId: anAllowlistComponent().id,
        id: 'item-2',
        name: 'Item 2',
        description: 'Item 2 description',
      },
      state: state,
    });
    expect(
      state.phases[anAllowlistPhase().id].components[anAllowlistComponent().id]
        .items['item-2']._insertionOrder,
    ).toEqual(1);
  });

  it('should throw an error if component does not exist', () => {
    const state = anAllowlistState();
    expect(() =>
      op.execute({
        params: {
          componentId: 'component-2',
          id: 'item-2',
          name: 'Item 2',
          description: 'Item 2 description',
        },
        state: state,
      }),
    ).toThrowError("Component 'component-2' does not exist");
  });

  it('should throw an error if component is not defined', () => {
    const state = anAllowlistState();
    expect(() =>
      op.execute({
        params: {
          componentId: 'component-2',
          id: 'item-1',
          name: 'Item 1',
          description: 'Item 1 description',
        },
        state: state,
      }),
    ).toThrowError("Component 'component-2' does not exist");
  });
});
