import { ItemSortWalletsByUniqueTokensCountOperation } from './item-sort-wallets-by-unique-tokens-count-operation';
import { defaultLogFactory } from './../../../logging/logging-emitter';
import { AllowlistState } from './../../../allowlist/state-types/allowlist-state';
import { ItemSortWalletsByUniqueTokensCountParams } from './item-sort-wallets-by-unique-tokens-count.types';
import {
  anAllowlistComponent,
  anAllowlistItem,
  anAllowlistPhase,
  anAllowlistState,
} from '../../../allowlist/state-types/allowlist-state.test.fixture';
import {
  anAllowlistLargeItemTokens,
  anAllowlistSmallItemTokens,
} from '../../state-types/allowlist-state.test.fixture.large';

describe('ItemSortWalletsByUniqueTokensCountOperation', () => {
  const op = new ItemSortWalletsByUniqueTokensCountOperation(defaultLogFactory);
  let state: AllowlistState;
  let params: ItemSortWalletsByUniqueTokensCountParams;

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
                  tokens: anAllowlistSmallItemTokens(),
                }),
              ],
              winners: {},
            }),
          ],
        }),
      ],
    });
    params = {
      itemId: 'item-1',
    };
  });

  it('throws error if itemId is missing', () => {
    expect(() => op.validate({})).toThrowError('Missing itemId');
  });

  it('throws error if itemId is not a string', () => {
    expect(() => op.validate({ itemId: 1 })).toThrowError('Invalid itemId');
  });

  it('throws error if itemId is empty', () => {
    expect(() => op.validate({ itemId: '' })).toThrowError('Invalid itemId');
  });

  it('returns true if params are valid', () => {
    expect(op.validate(params)).toBe(true);
  });

  it('throws error if item is not found', () => {
    const itemId = 'item-2';
    expect(() =>
      op.execute({
        params: {
          ...params,
          itemId,
        },
        state,
      }),
    ).toThrowError(`Item '${itemId}' not found`);
  });

  it('sorts wallets by unique tokens count', () => {
    op.execute({
      params,
      state,
    });
    expect(
      state.phases['phase-1'].components['component-1'].items['item-1'].tokens,
    ).toEqual([
      {
        id: '1',
        owner: '0xc3c9737cce778d7583f31ae7c4f2ab8782ed51e5',
      },
      {
        id: '2',
        owner: '0xc3c9737cce778d7583f31ae7c4f2ab8782ed51e5',
      },
      {
        id: '1',
        owner: '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
      },
      {
        id: '1',
        owner: '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
      },
      {
        id: '1',
        owner: '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
      },
      {
        id: '1',
        owner: '0xfd22004806a6846ea67ad883356be810f0428793',
      },
    ]);
  });
});
