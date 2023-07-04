import { ItemRemoveFirstNWalletsOperation } from './item-remove-first-n-wallets-operation';
import { defaultLogFactory } from './../../../logging/logging-emitter';
import { AllowlistState } from './../../../allowlist/state-types/allowlist-state';
import { ItemRemoveFirstNWalletsParams } from './item-remove-first-n-wallets.types';
import {
  anAllowlistComponent,
  anAllowlistItem,
  anAllowlistPhase,
  anAllowlistState,
} from '../../../allowlist/state-types/allowlist-state.test.fixture';
import { anAllowlistSmallItemTokens } from '../../state-types/allowlist-state.test.fixture.large';

describe('ItemRemoveFirstNWalletsOperation', () => {
  const op = new ItemRemoveFirstNWalletsOperation(defaultLogFactory);
  let state: AllowlistState;
  let params: ItemRemoveFirstNWalletsParams;

  beforeEach(() => {
    state = anAllowlistState({
      phases: [
        anAllowlistPhase({
          components: [
            anAllowlistComponent({
              items: [
                anAllowlistItem({
                  tokens: anAllowlistSmallItemTokens(),
                }),
              ],
            }),
          ],
        }),
      ],
    });
    params = {
      itemId: 'item-1',
      count: 2,
    };
  });

  it('throws error if itemId is missing', () => {
    expect(() =>
      op.validate({
        count: 2,
      }),
    ).toThrowError('Missing itemId');
  });

  it('throws error if itemId is not a string', () => {
    expect(() =>
      op.validate({
        itemId: 1,
        count: 2,
      }),
    ).toThrowError('Invalid itemId');
  });

  it('throws error if count is missing', () => {
    expect(() =>
      op.validate({
        itemId: 'item-1',
      }),
    ).toThrowError('Missing count');
  });

  it('throws error if count is not a number', () => {
    expect(() =>
      op.validate({
        itemId: 'item-1',
        count: '2',
      }),
    ).toThrowError('Invalid count');
  });

  it('throws error if count is negative', () => {
    expect(() =>
      op.validate({
        itemId: 'item-1',
        count: -1,
      }),
    ).toThrowError('Invalid count');
  });

  it('validates params', () => {
    expect(() =>
      op.validate({
        itemId: 'item-1',
        count: 2,
      }),
    ).not.toThrow();
  });

  it('throws error if item does not exist', () => {
    expect(() =>
      op.execute({
        params: { ...params, itemId: 'item-2' },
        state,
      }),
    ).toThrow(
      "ITEM_REMOVE_FIRST_N_WALLETS: Item 'item-2' does not exist, itemId: item-2",
    );
  });

  it('removes first wallet from item', () => {
    op.execute({
      params: {
        ...params,
        count: 1,
      },
      state,
    });

    expect(
      state.phases['phase-1'].components['component-1'].items['item-1'].tokens,
    ).toEqual([
      {
        id: '1',
        owner: '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
        since: 1627987200,
      },
      {
        id: '1',
        owner: '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
        since: 1627987200,
      },
      {
        id: '1',
        owner: '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
        since: 1627987200,
      },
      {
        id: '1',
        owner: '0xfd22004806a6846ea67ad883356be810f0428793',
        since: 1627987200,
      },
    ]);
  });

  it('removes first 2 wallets from item', () => {
    op.execute({
      params: {
        ...params,
        count: 2,
      },
      state,
    });
    expect(
      state.phases['phase-1'].components['component-1'].items['item-1'].tokens,
    ).toEqual([
      {
        id: '1',
        owner: '0xfd22004806a6846ea67ad883356be810f0428793',
        since: 1627987200,
      },
    ]);
  });
});
