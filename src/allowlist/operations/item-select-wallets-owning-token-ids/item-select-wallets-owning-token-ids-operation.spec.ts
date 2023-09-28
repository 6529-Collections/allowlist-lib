import { ItemSelectWalletsOwningTokenIdsOperation } from './item-select-wallets-owning-token-ids-operation';
import { defaultLogFactory } from './../../../logging/logging-emitter';
import { AllowlistState } from './../../../allowlist/state-types/allowlist-state';
import { ItemSelectWalletsOwningTokenIdsParams } from './item-select-wallets-owning-token-ids.types';
import {
  anAllowlistComponent,
  anAllowlistItem,
  anAllowlistPhase,
  anAllowlistState,
} from '../../../allowlist/state-types/allowlist-state.test.fixture';
import { anAllowlistLargeItemTokens } from '../../state-types/allowlist-state.test.fixture.large';

describe('ItemSelectWalletsOwningTokenIdsOperation', () => {
  const op = new ItemSelectWalletsOwningTokenIdsOperation(defaultLogFactory);
  let state: AllowlistState;
  let params: ItemSelectWalletsOwningTokenIdsParams;

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
        params: {
          itemId: 'item-999',
          tokenIds: '1,2,3',
        },
        state,
      }),
    ).toThrowError(`Invalid itemId`);
  });

  it('selects wallets owning token ids', () => {
    op.execute({
      params,
      state,
    });

    expect(
      state.phases['phase-1'].components['component-1'].items['item-1'].tokens,
    ).toEqual([
      { id: '1', owner: '0xA62DA2Ea9F5bB03a58174060535ae32131973178' },
      { id: '2', owner: '0xA62DA2Ea9F5bB03a58174060535ae32131973178' },
      { id: '3', owner: '0xA62DA2Ea9F5bB03a58174060535ae32131973178' },
      { id: '1', owner: '0xE16dF6503Acd3c79b6E032f62c61752bEC16eeF2' },
      { id: '2', owner: '0xE16dF6503Acd3c79b6E032f62c61752bEC16eeF2' },
      { id: '3', owner: '0xE16dF6503Acd3c79b6E032f62c61752bEC16eeF2' },
      { id: '4', owner: '0xE16dF6503Acd3c79b6E032f62c61752bEC16eeF2' },
      { id: '1', owner: '0x9769334FC882775F4951865aA473481880669D47' },
      { id: '2', owner: '0x9769334FC882775F4951865aA473481880669D47' },
      { id: '3', owner: '0x9769334FC882775F4951865aA473481880669D47' },
      { id: '4', owner: '0x9769334FC882775F4951865aA473481880669D47' },
      { id: '5', owner: '0x9769334FC882775F4951865aA473481880669D47' },
    ]);
  });
});
