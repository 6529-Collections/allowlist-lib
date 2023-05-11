import { defaultLogFactory } from './../../../logging/logging-emitter';
import {
  anAllowlistComponent,
  anAllowlistItem,
  anAllowlistItemToken,
  anAllowlistPhase,
  anAllowlistState,
} from '../../../allowlist/state-types/allowlist-state.test.fixture';
import { AllowlistState } from '../../../allowlist/state-types/allowlist-state';
import { ItemExcludeTokenIdsParams } from './item-exclude-token-ids.types';
import { ItemExcludeTokenIdsOperation } from './item-exclude-token-ids-operation';

describe('ItemExcludeTokenIdsOperation', () => {
  const op = new ItemExcludeTokenIdsOperation(defaultLogFactory);
  let state: AllowlistState;
  let params: ItemExcludeTokenIdsParams;

  beforeEach(() => {
    state = anAllowlistState({
      phases: [
        anAllowlistPhase({
          components: [
            anAllowlistComponent({
              items: [
                anAllowlistItem({
                  tokens: [
                    anAllowlistItemToken(),
                    anAllowlistItemToken({
                      id: '2',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
    params = {
      itemId: 'item-1',
      tokenIds: '1,2,3',
    };
  });

  it('throws error if item does not exist', () => {
    expect(() =>
      op.execute({
        params: { ...params, itemId: 'item-2' },
        state,
      }),
    ).toThrow(
      "ITEM_EXCLUDE_TOKEN_IDS: Item 'item-2' does not exist, itemId: item-2",
    );
  });

  it('throws error if tokenIds is not defined', () => {
    expect(() =>
      op.execute({
        params: { ...params, tokenIds: undefined },
        state,
      }),
    ).toThrow('ITEM_EXCLUDE_TOKEN_IDS: No token ids provided, itemId: item-1');
  });

  it('throws error if tokenIds is empty', () => {
    expect(() =>
      op.execute({
        params: { ...params, tokenIds: '' },
        state,
      }),
    ).toThrow('ITEM_EXCLUDE_TOKEN_IDS: No token ids provided, itemId: item-1');
  });

  it('throws error if tokenIds is not a string', () => {
    expect(() =>
      op.execute({
        params: { ...params, tokenIds: 123 as any },
        state,
      }),
    ).toThrow('ITEM_EXCLUDE_TOKEN_IDS: No token ids provided, itemId: item-1');
  });

  it('throws error if tokenIds is not a string of comma separated numbers', () => {
    expect(() =>
      op.execute({
        params: { ...params, tokenIds: '1,2,3,abc' },
        state,
      }),
    ).toThrow(
      'ITEM_EXCLUE_TOKEN_IDS: TokenIds must be in format: 1, 2, 3, 45, 100-115, 203-780, 999, id: item-1',
    );
  });

  it('excludes tokens from item', () => {
    op.execute({
      params: { ...params, tokenIds: '10' },
      state,
    });
    expect(
      state.phases['phase-1'].components['component-1'].items['item-1'].tokens,
    ).toEqual([
      anAllowlistItemToken({
        id: '2',
      }),
    ]);
  });
});
