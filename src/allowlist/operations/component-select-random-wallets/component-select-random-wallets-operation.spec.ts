import { ComponentSelectRandomWalletsOperation } from './component-select-random-wallets-operation';
import { defaultLogFactory } from './../../../logging/logging-emitter';
import { AllowlistState } from './../../../allowlist/state-types/allowlist-state';
import { ComponentSelectRandomWalletsParams } from './component-select-random-wallets.types';
import {
  anAllowlistComponent,
  anAllowlistItem,
  anAllowlistPhase,
  anAllowlistState,
} from '../../../allowlist/state-types/allowlist-state.test.fixture';
import { anAllowlistLargeItemTokens } from '../../state-types/allowlist-state.test.fixture.large';
import { getComponentPath } from '../../../utils/path.utils';
import { CardStatistics } from '../../../app-types';

describe('ComponentSelectRandomWalletsOperation', () => {
  const op = new ComponentSelectRandomWalletsOperation(defaultLogFactory);
  let state: AllowlistState;
  let params: ComponentSelectRandomWalletsParams;

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
                  tokens: anAllowlistLargeItemTokens().slice(0, 20),
                }),
                anAllowlistItem({
                  id: 'item-2',
                  tokens: anAllowlistLargeItemTokens().slice(10, 30),
                }),
              ],
              winners: {},
            }),
          ],
        }),
      ],
    });
    params = {
      componentId: 'component-1',
      count: 10,
      seed: 'seed',
    };
  });

  it('throws error if componentId is missing', () => {
    expect(() => {
      op.validate({
        count: 1,
        seed: 'seed',
      });
    }).toThrow('Missing componentId');
  });

  it('throws error if componentId is not a string', () => {
    expect(() =>
      op.validate({
        componentId: 1,
        count: 1,
        seed: 'seed',
      }),
    ).toThrow('Invalid componentId');
  });

  it('throws error if componentId is empty', () => {
    expect(() =>
      op.validate({
        componentId: '',
        count: 1,
        seed: 'seed',
      }),
    ).toThrow('Invalid componentId');
  });

  it('throws error if count is missing', () => {
    expect(() => {
      op.validate({
        componentId: 'component-1',
        seed: 'seed',
      });
    }).toThrow('Missing count');
  });

  it('throws error if count is not a number', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        count: '1',
        seed: 'seed',
      }),
    ).toThrow('Invalid count');
  });

  it('throws error if count is less than 1', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        count: 0,
        seed: 'seed',
      }),
    ).toThrow('Invalid count');
  });

  it('throws error if seed is missing', () => {
    expect(() => {
      op.validate({
        componentId: 'component-1',
        count: 1,
      });
    }).toThrow('Missing seed');
  });

  it('throws error if seed is not a string', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        count: 1,
        seed: 1,
      }),
    ).toThrow('Invalid seed');
  });

  it('throws error if seed is empty', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        count: 1,
        seed: '',
      }),
    ).toThrow('Invalid seed');
  });

  it('should validate params', () => {
    expect(op.validate(params)).toBe(true);
  });
  it('throws error if component does not exist', () => {
    expect(() => {
      op.execute({
        params: { ...params, componentId: 'component-6' },
        state,
      });
    }).toThrow(
      "COMPONENT_SELECT_RANDOM_WALLETS: Component 'component-6' does not exist, componentId: component-6",
    );
  });

  it('selects random wallets', () => {
    op.execute({
      params,
      state,
    });

    const { phaseId } = getComponentPath({
      state,
      componentId: params.componentId,
    });
    const component = state.phases[phaseId].components[params.componentId];
    expect(
      new Set(
        Object.values(component.items).flatMap((item) =>
          item.tokens.map((token) => token.owner),
        ),
      ),
    ).toEqual(
      new Set([
        '0xfd22004806a6846ea67ad883356be810f0428793',
        '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
        '0xE16dF6503Acd3c79b6E032f62c61752bEC16eeF2',
        '0x88D3574660711e03196aF8A96f268697590000Fa',
        '0xfe3b3F0D64F354b69A5B40D02f714E69cA4B09bd',
        '0x8889EBB11295F456541901f50BCB5f382047cAaC',
        '0x83EE335ca72759CAeDeD7b1afD11dCF75F48436b',
        '0xF9e129817BC576f937e4774E3C3Aec98787Cfb91',
        '0x8e63380aC1e34c7D61bf404aF63e885875C18Ce3',
        '0x7f3774EAdae4beB01919deC7f32A72e417Ab5DE3',
      ]),
    );
  });

  it('selects random wallets weighted by by TOTAL_CARDS', () => {
    op.execute({
      params: {
        ...params,
        weightType: CardStatistics.TOTAL_CARDS,
      },
      state,
    });

    const { phaseId } = getComponentPath({
      state,
      componentId: params.componentId,
    });
    const component = state.phases[phaseId].components[params.componentId];
    expect(
      Object.values(component.items).flatMap((item) =>
        item.tokens.map((token) => token.owner),
      ),
    ).toEqual([
      '0xfd22004806a6846ea67ad883356be810f0428793',
      '0xc3c9737cce778d7583f31ae7c4f2ab8782ed51e5',
      '0xc3c9737cce778d7583f31ae7c4f2ab8782ed51e5',
      '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
      '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
      '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
      '0xE16dF6503Acd3c79b6E032f62c61752bEC16eeF2',
      '0xE16dF6503Acd3c79b6E032f62c61752bEC16eeF2',
      '0xE16dF6503Acd3c79b6E032f62c61752bEC16eeF2',
      '0xE16dF6503Acd3c79b6E032f62c61752bEC16eeF2',
      '0x9769334FC882775F4951865aA473481880669D47',
      '0x9769334FC882775F4951865aA473481880669D47',
      '0x9769334FC882775F4951865aA473481880669D47',
      '0x9769334FC882775F4951865aA473481880669D47',
      '0x9769334FC882775F4951865aA473481880669D47',
      '0x885846850aaBf20d8f8e051f400354D94a32FF55',
      '0x61D9d9cc8C3203daB7100eA79ceD77587201C990',
      '0x9769334FC882775F4951865aA473481880669D47',
      '0x9769334FC882775F4951865aA473481880669D47',
      '0x9769334FC882775F4951865aA473481880669D47',
      '0x9769334FC882775F4951865aA473481880669D47',
      '0x9769334FC882775F4951865aA473481880669D47',
      '0x885846850aaBf20d8f8e051f400354D94a32FF55',
      '0x61D9d9cc8C3203daB7100eA79ceD77587201C990',
      '0xbDf82b13580b918ebc3c24b4034E8468EA168E21',
      '0xddA3cb2741FaC4a87CAebec9EFC7963087304097',
      '0xaf5c021754Ab82Bf556BC6C90650dE21Cf92d1c7',
    ]);
  });

  it('selects random wallets weighted by by UNIQUE_CARDS', () => {
    op.execute({
      params: {
        ...params,
        weightType: CardStatistics.UNIQUE_CARDS,
      },
      state,
    });

    const { phaseId } = getComponentPath({
      state,
      componentId: params.componentId,
    });
    const component = state.phases[phaseId].components[params.componentId];

    expect(
      Object.values(component.items).flatMap((item) =>
        item.tokens.map((token) => token.owner),
      ),
    ).toEqual([
      '0xfd22004806a6846ea67ad883356be810f0428793',
      '0xc3c9737cce778d7583f31ae7c4f2ab8782ed51e5',
      '0xc3c9737cce778d7583f31ae7c4f2ab8782ed51e5',
      '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
      '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
      '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
      '0xE16dF6503Acd3c79b6E032f62c61752bEC16eeF2',
      '0xE16dF6503Acd3c79b6E032f62c61752bEC16eeF2',
      '0xE16dF6503Acd3c79b6E032f62c61752bEC16eeF2',
      '0xE16dF6503Acd3c79b6E032f62c61752bEC16eeF2',
      '0x88D3574660711e03196aF8A96f268697590000Fa',
      '0x88D3574660711e03196aF8A96f268697590000Fa',
      '0xfe3b3F0D64F354b69A5B40D02f714E69cA4B09bd',
      '0x8889EBB11295F456541901f50BCB5f382047cAaC',
      '0xddA3cb2741FaC4a87CAebec9EFC7963087304097',
      '0xF9e129817BC576f937e4774E3C3Aec98787Cfb91',
      '0x7f3774EAdae4beB01919deC7f32A72e417Ab5DE3',
    ]);
  });
});
