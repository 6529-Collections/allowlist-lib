import { ItemSelectLastNTokensOperation } from './item-select-last-n-tokens-operation';
import { defaultLogFactory } from '../../../logging/logging-emitter';
import { AllowlistState } from '../../state-types/allowlist-state';
import { ItemSelectLastNTokensParams } from './item-select-last-n-tokens.types';
import {
  anAllowlistComponent,
  anAllowlistItem,
  anAllowlistPhase,
  anAllowlistState,
} from '../../state-types/allowlist-state.test.fixture';
import { anAllowlistLargeItemTokens } from '../../state-types/allowlist-state.test.fixture.large';

describe('ItemSelectLastNTokensOperation', () => {
  const op = new ItemSelectLastNTokensOperation(defaultLogFactory);
  let state: AllowlistState;
  let params: ItemSelectLastNTokensParams;

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
            }),
          ],
        }),
      ],
    });
    params = {
      itemId: 'item-1',
      count: 5,
    };
  });

  it('throws error if item does not exist', () => {
    expect(() =>
      op.execute({
        params: { ...params, itemId: 'item-2' },
        state,
      }),
    ).toThrow(
      "ITEM_SELECT_LAST_N_TOKENS: Item 'item-2' does not exist, itemId: item-2",
    );
  });

  it('throws error if count is not defined', () => {
    expect(() =>
      op.execute({
        params: { ...params, count: undefined },
        state,
      }),
    ).toThrow(
      'ITEM_SELECT_LAST_N_TOKENS: Invalid count provided, itemId: item-1',
    );
  });

  it('throws error if count is not a number', () => {
    expect(() =>
      op.execute({
        params: { ...params, count: '5' as any },
        state,
      }),
    ).toThrow(
      'ITEM_SELECT_LAST_N_TOKENS: Invalid count provided, itemId: item-1',
    );
  });

  it('throws error if count is not a positive number', () => {
    expect(() =>
      op.execute({
        params: { ...params, count: -1 },
        state,
      }),
    ).toThrow(
      'ITEM_SELECT_LAST_N_TOKENS: Invalid count provided, itemId: item-1',
    );
  });

  it('throws error if count is greater than item tokens', () => {
    expect(() =>
      op.execute({
        params: { ...params, count: 100 },
        state,
      }),
    ).toThrow(
      'ITEM_SELECT_LAST_N_TOKENS: Count must be less than or equal to the number of tokens in the item, itemId: item-1',
    );
  });

  it('selects last n tokens from item', () => {
    op.execute({
      params,
      state,
    });
    expect(
      state.phases['phase-1'].components['component-1'].items['item-1'].tokens,
    ).toEqual(anAllowlistLargeItemTokens().slice(-params.count));
  });
});
