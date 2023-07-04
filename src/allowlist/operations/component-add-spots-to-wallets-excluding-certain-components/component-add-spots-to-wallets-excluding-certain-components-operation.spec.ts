import { ComponentAddSpotsToWalletsExcludingCertainComponentsOperation } from './component-add-spots-to-wallets-excluding-certain-components-operation';
import { defaultLogFactory } from './../../../logging/logging-emitter';
import { AllowlistState } from './../../../allowlist/state-types/allowlist-state';
import { ComponentAddSpotsToWalletsExcludingCertainComponentsParams } from './component-add-spots-to-wallets-excluding-certain-components.types';
import {
  anAllowlistComponent,
  anAllowlistItem,
  anAllowlistPhase,
  anAllowlistState,
} from '../../../allowlist/state-types/allowlist-state.test.fixture';
import { anAllowlistLargeItemTokens } from '../../state-types/allowlist-state.test.fixture.large';
import { getComponentPath } from '../../../utils/path.utils';

describe('ComponentAddSpotsToWalletsExcludingCertainComponentsOperation', () => {
  const op = new ComponentAddSpotsToWalletsExcludingCertainComponentsOperation(
    defaultLogFactory,
  );
  let state: AllowlistState;
  let params: ComponentAddSpotsToWalletsExcludingCertainComponentsParams;

  beforeEach(() => {
    state = anAllowlistState({
      phases: [
        anAllowlistPhase({
          id: 'phase-1',
          components: [
            anAllowlistComponent({
              id: 'component-1',
              items: [
                anAllowlistItem({
                  id: 'item-1',
                  tokens: anAllowlistLargeItemTokens().slice(0, 10),
                }),
              ],
              winners: {},
            }),
          ],
        }),
        anAllowlistPhase({
          id: 'phase-2',
          components: [
            anAllowlistComponent({
              id: 'component-2',
              items: [
                anAllowlistItem({
                  id: 'item-2',
                  tokens: anAllowlistLargeItemTokens().slice(5, 15),
                }),
              ],
              winners: anAllowlistLargeItemTokens()
                .slice(5, 15)
                .reduce(
                  (acc, token) => ({
                    ...acc,
                    [token.owner]: 1,
                  }),
                  {},
                ),
            }),
            anAllowlistComponent({
              id: 'component-3',
              items: [
                anAllowlistItem({
                  id: 'item-3',
                  tokens: anAllowlistLargeItemTokens().slice(10, 20),
                }),
              ],
              winners: {},
            }),
          ],
        }),
        anAllowlistPhase({
          id: 'phase-3',
          components: [
            anAllowlistComponent({
              id: 'component-4',
              items: [
                anAllowlistItem({
                  id: 'item-4',
                  tokens: anAllowlistLargeItemTokens().slice(15, 25),
                }),
              ],
              winners: {},
            }),
            anAllowlistComponent({
              id: 'component-5',
              items: [
                anAllowlistItem({
                  id: 'item-5',
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
      componentId: 'component-5',
      spots: 1,
      excludedComponentIds: ['component-2'],
    };
  });

  it('throws error if componentId is missing', () => {
    expect(() => {
      op.validate({
        sports: 10,
      });
    }).toThrow('Missing componentId');
  });

  it('throws error if componentId is not a string', () => {
    expect(() =>
      op.validate({
        componentId: 1,
        spots: 10,
      }),
    ).toThrow('Invalid componentId');
  });

  it('throws error if componentId is empty', () => {
    expect(() =>
      op.validate({
        componentId: '',
        spots: 10,
      }),
    ).toThrow('Invalid componentId');
  });

  it('throws error if spots is missing', () => {
    expect(() => {
      op.validate({
        componentId: 'component-1',
      });
    }).toThrow('Missing spots');
  });

  it('throws error if spots is not a number', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        spots: '10',
      }),
    ).toThrow('Invalid spots');
  });

  it('throws error if spots is not an integer', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        spots: 10.5,
      }),
    ).toThrow('Invalid spots');
  });

  it('throws error if spots is less than 1', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        spots: 0,
      }),
    ).toThrow('Invalid spots');
  });

  it('throws error if excludedComponentIds is not an array', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        spots: 10,
        excludedComponentIds: 1,
      }),
    ).toThrow('Invalid excludedComponentIds');
  });

  it('throws error if excludedComponentIds contains non-string values', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        spots: 10,
        excludedComponentIds: [1],
      }),
    ).toThrow('Invalid excludedComponentIds');
  });

  it('throws error if excludedComponentIds contains empty strings', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        spots: 10,
        excludedComponentIds: [''],
      }),
    ).toThrow('Invalid excludedComponentIds');
  });

  it('should validate params', () => {
    expect(() => {
      op.validate(params);
    }).not.toThrow();
  });

  it('throws error if component does not exist', () => {
    expect(() => {
      op.execute({
        params: { ...params, componentId: 'component-6' },
        state,
      });
    }).toThrow(
      "COMPONENT_ADD_SPOTS_TO_WALLETS_EXCLUDING_CERTAIN_COMPONENTS: Component 'component-6' does not exist, componentId: component-6",
    );
  });

  it('throws error if any excluded component does not exist', () => {
    expect(() => {
      op.execute({
        params: { ...params, excludedComponentIds: ['component-6'] },
        state,
      });
    }).toThrow(
      "COMPONENT_ADD_SPOTS_TO_WALLETS_EXCLUDING_CERTAIN_COMPONENTS: Excluded component 'component-6' does not exist, componentId: component-5",
    );
  });

  it('adds spots to wallets excluding certain components', () => {
    op.execute({ params, state });
    const { phaseId } = getComponentPath({
      state,
      componentId: params.componentId,
    });
    const component = state.phases[phaseId].components[params.componentId];
    const winners = component.winners;

    const excludeWallets = anAllowlistLargeItemTokens()
      .slice(5, 15)
      .reduce<Record<string, true>>(
        (acc, token) => ({
          ...acc,
          [token.owner]: true,
        }),
        {},
      );

    for (const token of anAllowlistLargeItemTokens()) {
      if (excludeWallets[token.owner]) {
        expect(winners[token.owner]).toBeUndefined();
      } else {
        expect(winners[token.owner]).toBe(params.spots);
      }
    }
  });
});
