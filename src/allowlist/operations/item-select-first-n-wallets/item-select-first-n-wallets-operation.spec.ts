import { ItemSelectFirstNWalletsOperation } from './item-select-first-n-wallets-operation';
import { defaultLogFactory } from './../../../logging/logging-emitter';
import { AllowlistState } from './../../../allowlist/state-types/allowlist-state';
import { ItemSelectFirstNWalletsParams } from './item-select-first-n-wallets.types';
import {
  anAllowlistComponent,
  anAllowlistItem,
  anAllowlistPhase,
  anAllowlistState,
} from '../../../allowlist/state-types/allowlist-state.test.fixture';
import { anAllowlistSmallItemTokens } from '../../state-types/allowlist-state.test.fixture.large';

describe('ItemSelectFirstNWalletsOperation', () => {
  const op = new ItemSelectFirstNWalletsOperation(defaultLogFactory);
  let state: AllowlistState;
  let params: ItemSelectFirstNWalletsParams;

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
      "ITEM_SELECT_FIRST_N_WALLETS: Item 'item-2' does not exist, itemId: item-2",
    );
  });

  it('selects first wallet from item', () => {
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
        owner: '0xc3c9737cce778d7583f31ae7c4f2ab8782ed51e5',
        since: 1627987200,
      },
      {
        id: '2',
        owner: '0xc3c9737cce778d7583f31ae7c4f2ab8782ed51e5',
        since: 1627987200,
      },
    ]);
  });

  it('selects first 2 wallets from item', () => {
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
        owner: '0xc3c9737cce778d7583f31ae7c4f2ab8782ed51e5',
        since: 1627987200,
      },
      {
        id: '1',
        owner: '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
        since: 1627987200,
      },
      {
        id: '2',
        owner: '0xc3c9737cce778d7583f31ae7c4f2ab8782ed51e5',
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
    ]);
  });
});
