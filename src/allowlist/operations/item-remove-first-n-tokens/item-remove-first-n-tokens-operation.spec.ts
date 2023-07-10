import { defaultLogFactory } from '../../../logging/logging-emitter';
import { AllowlistState } from '../../state-types/allowlist-state';
import {
  anAllowlistComponent,
  anAllowlistItem,
  anAllowlistPhase,
  anAllowlistState,
} from '../../state-types/allowlist-state.test.fixture';
import { anAllowlistLargeItemTokens } from '../../state-types/allowlist-state.test.fixture.large';
import { ItemRemoveFirstNTokensOperation } from './item-remove-first-n-tokens-operation';
import { ItemRemoveFirstNTokensParams } from './item-remove-first-n-tokens.types';

describe('ItemRemoveFirstNTokensOperation', () => {
  const op = new ItemRemoveFirstNTokensOperation(defaultLogFactory);
  let state: AllowlistState;
  let params: ItemRemoveFirstNTokensParams;

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
      "ITEM_REMOVE_FIRST_N_ITEMS: Item 'item-2' does not exist, itemId: item-2",
    );
  });

  it('removes the first n tokens from the item', () => {
    op.execute({
      params,
      state,
    });
    expect(
      state.phases['phase-1'].components['component-1'].items['item-1'].tokens,
    ).toEqual(anAllowlistLargeItemTokens().slice(params.count));
  });
});
