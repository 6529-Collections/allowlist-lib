import { defaultLogFactory } from '../../../logging/logging-emitter';
import { AllowlistState } from '../../state-types/allowlist-state';
import {
  anAllowlistState,
  anAllowlistPhase,
  anAllowlistComponent,
  anAllowlistItem,
} from '../../state-types/allowlist-state.test.fixture';
import { anAllowlistLargeItemTokens } from '../../state-types/allowlist-state.test.fixture.large';
import { ComponentAddSpotsToAllItemWalletsOperation } from './component-add-spots-to-all-item-wallets-operation';
import { ComponentAddSpotsToAllItemWalletsParams } from './component-add-spots-to-all-item-wallets.types';

describe('ComponentAddSpotsToAllItemWalletsOperation', () => {
  const op = new ComponentAddSpotsToAllItemWalletsOperation(defaultLogFactory);
  let state: AllowlistState;
  let params: ComponentAddSpotsToAllItemWalletsParams;

  beforeEach(() => {
    state = anAllowlistState({
      phases: [
        anAllowlistPhase({
          components: [
            anAllowlistComponent({
              items: [
                anAllowlistItem({
                  tokens: anAllowlistLargeItemTokens(),
                }),
              ],
              winners: {},
            }),
          ],
        }),
      ],
    });
    params = {
      componentId: 'component-1',
      spots: 10,
    };
  });

  it('throws error if component does not exist', () => {
    expect(() =>
      op.execute({
        params: { ...params, componentId: 'component-2' },
        state,
      }),
    ).toThrow(
      "COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS: Component 'component-2' does not exist, componentId: component-2 ",
    );
  });

  it('throws error if spots is not defined', () => {
    expect(() =>
      op.execute({
        params: { ...params, spots: undefined },
        state,
      }),
    ).toThrow(
      'COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS: Invalid spots provided, componentId: component-1',
    );
  });

  it('throws error if spots is not a number', () => {
    expect(() =>
      op.execute({
        params: { ...params, spots: 'spots' as any },
        state,
      }),
    ).toThrow(
      'COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS: Invalid spots provided, componentId: component-1',
    );
  });

  it('throws error if spots is not a positive number', () => {
    expect(() =>
      op.execute({
        params: { ...params, spots: -1 },
        state,
      }),
    ).toThrow(
      'COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS: Invalid spots provided, componentId: component-1',
    );
  });

  it('adds spots to all item wallets', () => {
    op.execute({
      params,
      state,
    });

    const uniqueWallets = [
      ...new Set(
        Object.values(
          state.phases['phase-1'].components['component-1'].items,
        ).flatMap((item) => {
          return item.tokens.map((token) => {
            return token.owner;
          });
        }),
      ),
    ];

    expect(state.phases['phase-1'].components['component-1'].winners).toEqual(
      uniqueWallets.reduce((acc, wallet) => {
        acc[wallet] = params.spots;
        return acc;
      }, {}),
    );
  });
});
