import { defaultLogFactory } from '../../../logging/logging-emitter';
import { AllowlistState } from '../../state-types/allowlist-state';
import {
  anAllowlistState,
  anAllowlistPhase,
  anAllowlistComponent,
  anAllowlistItem,
  anAllowlistItemToken,
} from '../../state-types/allowlist-state.test.fixture';
import { ItemSelectTokenIdsOperation } from './item-select-token-ids-operation';
import { ItemSelectTokenIdsParams } from './item-select-token-ids.types';

describe('ItemSelectTokenIdsOperation', () => {
  const op = new ItemSelectTokenIdsOperation(defaultLogFactory);
  let state: AllowlistState;
  let params: ItemSelectTokenIdsParams;

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

  it('throws error if itemId is missing', () => {
    expect(() =>
      op.validate({
        tokenIds: '1,2,3',
      }),
    ).toThrowError('Missing itemId');
  });

  it('throws error if itemId is not a string', () => {
    expect(() =>
      op.validate({
        itemId: 1,
        tokenIds: '1,2,3',
      }),
    ).toThrowError('Invalid itemId');
  });

  it('throws error if itemId is empty', () => {
    expect(() =>
      op.validate({
        itemId: '',
        tokenIds: '1,2,3',
      }),
    ).toThrowError('Invalid itemId');
  });

  it('throws error if tokenIds is missing', () => {
    expect(() =>
      op.validate({
        itemId: 'item-1',
      }),
    ).toThrowError('Missing tokenIds');
  });

  it('throws error if tokenIds is not a string', () => {
    expect(() =>
      op.validate({
        itemId: 'item-1',
        tokenIds: 1,
      }),
    ).toThrowError('Invalid tokenIds');
  });

  it('throws error if tokenIds is empty', () => {
    expect(() =>
      op.validate({
        itemId: 'item-1',
        tokenIds: '',
      }),
    ).toThrowError('Invalid tokenIds');
  });

  it('throws error if itemIds is not valid', () => {
    expect(() =>
      op.validate({
        itemId: 'item-1',
        tokenIds: '1,2,3,x',
      }),
    ).toThrowError('Invalid tokenIds');
  });

  it('validates params', () => {
    expect(
      op.validate({
        itemId: 'item-1',
        tokenIds: '1,2,3',
      }),
    ).toEqual(true);
  });

  it('throws error if item does not exist', () => {
    expect(() =>
      op.execute({
        params: { ...params, itemId: 'item-2' },
        state,
      }),
    ).toThrow(
      "ITEM_SELECT_TOKEN_IDS: Item 'item-2' does not exist, itemId: item-2",
    );
  });

  it('selects tokens for item', () => {
    op.execute({
      params: { ...params, tokenIds: '2' },
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
