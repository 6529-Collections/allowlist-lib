import { AddItemOperation } from './add-item-operation';
import {
  anAllowlistComponent,
  anAllowlistPhase,
  anAllowlistState,
} from '../../state-types/allowlist-state.test.fixture';
import { defaultLogFactory } from '../../../logging/logging-emitter';
import { Pool } from '../../../app-types';

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
        poolId: 'token-pool-1',
        poolType: Pool.TOKEN_POOL,
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
          poolId: 'token-pool-1',
          poolType: Pool.TOKEN_POOL,
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
          poolId: 'token-pool-1',
          poolType: Pool.TOKEN_POOL,
        },
        state: state,
      }),
    ).toThrowError("Component 'component-2' does not exist");
  });

  it('should throw an error if token pool does not exist', () => {
    const state = anAllowlistState();
    expect(() =>
      op.execute({
        params: {
          componentId: anAllowlistComponent().id,
          id: 'item-1',
          name: 'Item 1',
          description: 'Item 1 description',
          poolId: 'token-pool-2',
          poolType: Pool.TOKEN_POOL,
        },
        state: state,
      }),
    ).toThrowError("Token pool 'token-pool-2' does not exist");
  });

  it('should throw an error if custom token pool does not exist', () => {
    const state = anAllowlistState();
    expect(() =>
      op.execute({
        params: {
          componentId: anAllowlistComponent().id,
          id: 'item-1',
          name: 'Item 1',
          description: 'Item 1 description',
          poolId: 'custom-token-pool-2',
          poolType: Pool.CUSTOM_TOKEN_POOL,
        },
        state: state,
      }),
    ).toThrowError("Custom token pool 'custom-token-pool-2' does not exist");
  });

  it('should throw an error if wallet pool is used', () => {
    const state = anAllowlistState();
    expect(() =>
      op.execute({
        params: {
          componentId: anAllowlistComponent().id,
          id: 'item-1',
          name: 'Item 1',
          description: 'Item 1 description',
          poolId: 'wallet-pool-1',
          poolType: Pool.WALLET_POOL,
        },
        state: state,
      }),
    ).toThrowError("Wallet pool 'wallet-pool-1' cannot be used for item");
  });
});
