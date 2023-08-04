import { ItemRemoveWalletsFromCertainTokenPoolsOperation } from './item-remove-wallets-from-certain-token-pools-operation';
import { defaultLogFactory } from './../../../logging/logging-emitter';
import { AllowlistState } from './../../../allowlist/state-types/allowlist-state';
import { ItemRemoveWalletsFromCertainTokenPoolsParams } from './item-remove-wallets-from-certain-token-pools.types';
import {
  aCustomTokenPool,
  aTokenPool,
  aWalletPool,
  anAllowlistComponent,
  anAllowlistItem,
  anAllowlistPhase,
  anAllowlistState,
} from '../../../allowlist/state-types/allowlist-state.test.fixture';
import { Pool } from '../../../app-types';
import { getItemPath } from '../../../utils/path.utils';
import { anAllowlistLargeItemTokens } from '../../state-types/allowlist-state.test.fixture.large';

describe('ItemRemoveWalletsFromCertainTokenPoolsOperation', () => {
  const op = new ItemRemoveWalletsFromCertainTokenPoolsOperation(
    defaultLogFactory,
  );
  let state: AllowlistState;
  let params: ItemRemoveWalletsFromCertainTokenPoolsParams;

  beforeEach(() => {
    state = anAllowlistState({
      tokenPools: [
        aTokenPool({
          id: 'token-pool-1',
          tokens: anAllowlistLargeItemTokens()
            .slice(0, 10)
            .map((token) => ({
              id: token.id,
              owner: token.owner,
              contract: '0x0000000',
            })),
        }),
      ],
      customTokenPools: [
        aCustomTokenPool({
          id: 'custom-token-pool-1',
          tokens: anAllowlistLargeItemTokens()
            .slice(10, 20)
            .map((token) => ({
              id: token.id,
              owner: token.owner,
            })),
        }),
      ],
      walletPools: [
        aWalletPool({
          id: 'wallet-pool-1',
          wallets: anAllowlistLargeItemTokens()
            .slice(20, 30)
            .map((token) => token.owner),
        }),
      ],
      phases: [
        anAllowlistPhase({
          id: 'phase-1',
          components: [
            anAllowlistComponent({
              id: 'component-1',
              items: [
                anAllowlistItem({
                  id: 'item-1',
                  tokens: anAllowlistLargeItemTokens(),
                }),
              ],
            }),
          ],
        }),
      ],
    });
    params = {
      itemId: 'item-1',
      pools: [
        {
          poolType: Pool.TOKEN_POOL,
          poolId: 'token-pool-1',
        },
        {
          poolType: Pool.CUSTOM_TOKEN_POOL,
          poolId: 'custom-token-pool-1',
        },
        {
          poolType: Pool.WALLET_POOL,
          poolId: 'wallet-pool-1',
        },
      ],
    };
  });

  it('throws if itemId is missing', () => {
    expect(() =>
      op.validate({
        ...params,
        itemId: undefined as any,
      }),
    ).toThrowError();
  });

  it('throws if itemId is not a string', () => {
    expect(() =>
      op.validate({
        ...params,
        itemId: 123 as any,
      }),
    ).toThrowError();
  });

  it('throws if itemId is empty', () => {
    expect(() =>
      op.validate({
        ...params,
        itemId: '',
      }),
    ).toThrowError();
  });

  it('throws if pools is missing', () => {
    expect(() =>
      op.validate({
        ...params,
        pools: undefined as any,
      }),
    ).toThrowError();
  });

  it('throws if pools is not an array', () => {
    expect(() =>
      op.validate({
        ...params,
        pools: 123 as any,
      }),
    ).toThrowError();
  });

  it('throws if pools is empty', () => {
    expect(() =>
      op.validate({
        ...params,
        pools: [],
      }),
    ).toThrowError();
  });

  it('throws if pools contains non-object values', () => {
    expect(() =>
      op.validate({
        ...params,
        pools: [...params.pools, 123 as any],
      }),
    ).toThrowError();
  });

  it('throws if pools contains empty objects', () => {
    expect(() =>
      op.validate({
        ...params,
        pools: [...params.pools, {} as any],
      }),
    ).toThrowError();
  });

  it('throws if pools contains objects with missing poolType', () => {
    expect(() =>
      op.validate({
        ...params,
        pools: [...params.pools, { poolId: 'pool-1' } as any],
      }),
    ).toThrowError();
  });

  it('throws if pools contains objects with missing poolId', () => {
    expect(() =>
      op.validate({
        ...params,
        pools: [...params.pools, { poolType: Pool.TOKEN_POOL } as any],
      }),
    ).toThrowError();
  });

  it('throws if pools contains objects with invalid poolType', () => {
    expect(() =>
      op.validate({
        ...params,
        pools: [
          ...params.pools,
          { poolType: 'invalid-pool-type', poolId: 'pool-1' } as any,
        ],
      }),
    ).toThrowError();
  });

  it('throws if pools contains objects with empty poolType', () => {
    expect(() =>
      op.validate({
        ...params,
        pools: [...params.pools, { poolType: '', poolId: 'pool-1' } as any],
      }),
    ).toThrowError();
  });

  it('throws if pools contains objects with empty poolId', () => {
    expect(() =>
      op.validate({
        ...params,
        pools: [...params.pools, { poolType: Pool.TOKEN_POOL, poolId: '' }],
      }),
    ).toThrowError();
  });

  it('throws if pools contains objects with non string poolId', () => {
    expect(() =>
      op.validate({
        ...params,
        pools: [
          ...params.pools,
          { poolType: Pool.TOKEN_POOL, poolId: 123 as any },
        ],
      }),
    ).toThrowError();
  });

  it('validates params', () => {
    expect(op.validate(params)).toEqual(true);
  });

  it('removes wallets from the specified token pools', () => {
    const { phaseId, componentId } = getItemPath({
      itemId: params.itemId,
      state,
    });

    op.execute({ state, params });
    expect(
      state.phases[phaseId].components[componentId].items[params.itemId].tokens,
    ).toEqual(anAllowlistLargeItemTokens().slice(30));
  });
});
