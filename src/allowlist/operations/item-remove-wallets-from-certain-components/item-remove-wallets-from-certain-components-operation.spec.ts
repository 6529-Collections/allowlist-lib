import { ItemRemoveWalletsFromCertainComponentsOperation } from './item-remove-wallets-from-certain-components-operation';
import { defaultLogFactory } from './../../../logging/logging-emitter';
import { AllowlistState } from './../../../allowlist/state-types/allowlist-state';
import { ItemRemoveWalletsFromCertainComponentsParams } from './item-remove-wallets-from-certain-components.types';
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

describe('ItemRemoveWalletsFromCertainComponentsOperation', () => {
  const op = new ItemRemoveWalletsFromCertainComponentsOperation(
    defaultLogFactory,
  );
  let state: AllowlistState;
  let params: ItemRemoveWalletsFromCertainComponentsParams;
  const itemOneTokens = anAllowlistSmallItemTokens();
  const itemTwoTokens = anAllowlistLargeItemTokens().slice(0, 10);

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
                  tokens: itemOneTokens,
                }),
              ],
              winners: itemOneTokens.reduce<{ [wallet: string]: number }>(
                (acc, token) => {
                  return {
                    ...acc,
                    [token.owner]: 1,
                  };
                },
                {},
              ),
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
                  tokens: itemTwoTokens,
                }),
              ],
              winners: itemTwoTokens.reduce<{ [wallet: string]: number }>(
                (acc, token) => {
                  return {
                    ...acc,
                    [token.owner]: 1,
                  };
                },
                {},
              ),
            }),
            anAllowlistComponent({
              id: 'component-3',
              items: [
                anAllowlistItem({
                  id: 'item-3',
                  tokens: anAllowlistLargeItemTokens(),
                }),
              ],
            }),
          ],
        }),
      ],
    });
    params = {
      itemId: 'item-3',
      componentIds: ['component-1', 'component-2'],
    };
  });

  it('throws an error if itemId is missing', () => {
    expect(() => op.validate({ ...params, itemId: undefined })).toThrow(
      'Invalid itemId',
    );
  });

  it('throws an error if itemId is not a string', () => {
    expect(() => op.validate({ ...params, itemId: 123 })).toThrow(
      'Invalid itemId',
    );
  });

  it('throws an error if itemId is empty', () => {
    expect(() => op.validate({ ...params, itemId: '' })).toThrow(
      'Invalid itemId',
    );
  });

  it('throws an error if componentIds is missing', () => {
    expect(() => op.validate({ ...params, componentIds: undefined })).toThrow(
      'Invalid componentIds',
    );
  });

  it('throws an error if componentIds is not an array', () => {
    expect(() => op.validate({ ...params, componentIds: 123 })).toThrow(
      'Invalid componentIds',
    );
  });

  it('throws an error if componentIds is empty', () => {
    expect(() => op.validate({ ...params, componentIds: [] })).toThrow(
      'Invalid componentIds',
    );
  });

  it('throws an error if componentIds contains non-string values', () => {
    expect(() =>
      op.validate({ ...params, componentIds: ['component-1', 123] }),
    ).toThrow('Invalid componentIds');
  });

  it('throws an error if componentIds contains empty strings', () => {
    expect(() =>
      op.validate({ ...params, componentIds: ['component-1', ''] }),
    ).toThrow('Invalid componentIds');
  });

  it('validates the params', () => {
    expect(op.validate(params)).toEqual(true);
  });

  it('throws an error if item is not found', () => {
    expect(() =>
      op.execute({
        params: {
          ...params,
          itemId: 'item-unknown',
        },
        state,
      }),
    ).toThrow("Item with id 'item-unknown' does not exist");
  });

  it('throws an error if component is not found', () => {
    expect(() =>
      op.execute({
        params: {
          ...params,
          componentIds: ['component-unknown'],
        },
        state,
      }),
    ).toThrow("Component with id 'component-unknown' does not exist");
  });

  it('removes the wallets from item', () => {
    op.execute({ params, state });
    const expectedTokens = [
      {
        id: '1',
        owner: '0x9769334FC882775F4951865aA473481880669D47',
      },
      {
        id: '2',
        owner: '0x9769334FC882775F4951865aA473481880669D47',
      },
      {
        id: '3',
        owner: '0x9769334FC882775F4951865aA473481880669D47',
      },
      {
        id: '4',
        owner: '0x9769334FC882775F4951865aA473481880669D47',
      },
      {
        id: '5',
        owner: '0x9769334FC882775F4951865aA473481880669D47',
      },
      {
        id: '6',
        owner: '0x3852471D266d9e2222CA9Fdd922BAFC904Dc49e5',
      },
      {
        id: '7',
        owner: '0x88D3574660711e03196aF8A96f268697590000Fa',
      },
      {
        id: '8',
        owner: '0x885846850aaBf20d8f8e051f400354D94a32FF55',
      },
      {
        id: '9',
        owner: '0x61D9d9cc8C3203daB7100eA79ceD77587201C990',
      },
      {
        id: '10',
        owner: '0xE359aB04cEC41AC8C62bc5016C10C749c7De5480',
      },
      {
        id: '11',
        owner: '0xfe3b3F0D64F354b69A5B40D02f714E69cA4B09bd',
      },
      {
        id: '12',
        owner: '0x8889EBB11295F456541901f50BCB5f382047cAaC',
      },
      {
        id: '13',
        owner: '0x4269AaDfd043b58cbA893BfE6029C9895C25cb61',
      },
      {
        id: '14',
        owner: '0xbDf82b13580b918ebc3c24b4034E8468EA168E21',
      },
      {
        id: '15',
        owner: '0x83EE335ca72759CAeDeD7b1afD11dCF75F48436b',
      },
      {
        id: '16',
        owner: '0xddA3cb2741FaC4a87CAebec9EFC7963087304097',
      },
      {
        id: '17',
        owner: '0xF9e129817BC576f937e4774E3C3Aec98787Cfb91',
      },
      {
        id: '18',
        owner: '0x8e63380aC1e34c7D61bf404aF63e885875C18Ce3',
      },
      {
        id: '19',
        owner: '0xaf5c021754Ab82Bf556BC6C90650dE21Cf92d1c7',
      },
      {
        id: '20',
        owner: '0x7f3774EAdae4beB01919deC7f32A72e417Ab5DE3',
      },
      {
        id: '21',
        owner: '0xC03E57b6acE9Dd62C84A095E11E494E3C8FD4D42',
      },
      {
        id: '22',
        owner: '0xe70d73c76fF3b4388EE9C58747F0EaA06C6b645B',
      },
      {
        id: '23',
        owner: '0x8BA68CFe71550EfC8988D81d040473709B7F9218',
      },
      {
        id: '24',
        owner: '0xa743c8c57c425B84Cb2eD18C6B9ae3aD21629Cb5',
      },
      {
        id: '25',
        owner: '0x1b7844CfaE4C823Ac6389855D47106a70c84F067',
      },
      {
        id: '26',
        owner: '0x76D078D7e5755B66fF50166863329D27F2566b43',
      },
    ];
    expect(
      state.phases['phase-2'].components['component-3'].items['item-3'].tokens,
    ).toEqual(expectedTokens);
  });
});
