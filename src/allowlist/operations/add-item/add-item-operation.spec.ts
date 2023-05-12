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

  it('should throw an error if id is missing', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        name: 'Item 1',
        description: 'Item 1 description',
      }),
    ).toThrowError('Missing id');
  });

  it('should throw an error if id is not a string', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        id: 1,
        name: 'Item 1',
        description: 'Item 1 description',
      }),
    ).toThrowError('Invalid id');
  });

  it('should throw an error if id is empty', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        id: '',
        name: 'Item 1',
        description: 'Item 1 description',
      }),
    ).toThrowError('Invalid id');
  });

  it('should throw an error if componentId is missing', () => {
    expect(() =>
      op.validate({
        id: 'item-1',
        name: 'Item 1',
        description: 'Item 1 description',
      }),
    ).toThrowError('Missing componentId');
  });

  it('should throw an error if componentId is not a string', () => {
    expect(() =>
      op.validate({
        componentId: 1,
        id: 'item-1',
        name: 'Item 1',
        description: 'Item 1 description',
      }),
    ).toThrowError('Invalid componentId');
  });

  it('should throw an error if componentId is empty', () => {
    expect(() =>
      op.validate({
        componentId: '',
        id: 'item-1',
        name: 'Item 1',
        description: 'Item 1 description',
      }),
    ).toThrowError('Invalid componentId');
  });

  it('should throw an error if name is missing', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        id: 'item-1',
        description: 'Item 1 description',
      }),
    ).toThrowError('Missing name');
  });

  it('should throw an error if name is not a string', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        id: 'item-1',
        name: 1,
        description: 'Item 1 description',
      }),
    ).toThrowError('Invalid name');
  });

  it('should throw an error if name is empty', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        id: 'item-1',
        name: '',
        description: 'Item 1 description',
      }),
    ).toThrowError('Invalid name');
  });

  it('should throw an error if description is missing', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        id: 'item-1',
        name: 'Item 1',
      }),
    ).toThrowError('Missing description');
  });

  it('should throw an error if description is not a string', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        id: 'item-1',
        name: 'Item 1',
        description: 1,
      }),
    ).toThrowError('Invalid description');
  });

  it('should throw an error if description is empty', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        id: 'item-1',
        name: 'Item 1',
        description: '',
      }),
    ).toThrowError('Invalid description');
  });

  it('should throw an error if poolId is missing', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        id: 'item-1',
        name: 'Item 1',
        description: 'Item 1 description',
        poolType: Pool.TOKEN_POOL,
      }),
    ).toThrowError('Missing poolId');
  });

  it('should throw an error if poolId is not a string', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        id: 'item-1',
        name: 'Item 1',
        description: 'Item 1 description',
        poolId: 1,
        poolType: Pool.TOKEN_POOL,
      }),
    ).toThrowError('Invalid poolId');
  });

  it('should throw an error if poolId is empty', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        id: 'item-1',
        name: 'Item 1',
        description: 'Item 1 description',
        poolId: '',
        poolType: Pool.TOKEN_POOL,
      }),
    ).toThrowError('Invalid poolId');
  });

  it('should throw an error if poolType is missing', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        id: 'item-1',
        name: 'Item 1',
        description: 'Item 1 description',
        poolId: 'token-pool-1',
      }),
    ).toThrowError('Missing poolType');
  });

  it('should throw an error if poolType is not a string', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        id: 'item-1',
        name: 'Item 1',
        description: 'Item 1 description',
        poolId: 'token-pool-1',
        poolType: 1,
      }),
    ).toThrowError('Invalid poolType');
  });

  it('should throw an error if poolType is empty', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        id: 'item-1',
        name: 'Item 1',
        description: 'Item 1 description',
        poolId: 'token-pool-1',
        poolType: '',
      }),
    ).toThrowError('Invalid poolType');
  });

  it('should throw an error if poolType is not a valid pool type', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        id: 'item-1',
        name: 'Item 1',
        description: 'Item 1 description',
        poolId: 'token-pool-1',
        poolType: Pool.WALLET_POOL,
      }),
    ).toThrowError('Invalid poolType');
  });

  it('should validate params', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        id: 'item-1',
        name: 'Item 1',
        description: 'Item 1 description',
        poolId: 'token-pool-1',
        poolType: Pool.TOKEN_POOL,
      }),
    ).not.toThrowError();
  });

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
    ).toThrowError('Invalid poolType');
  });
});
