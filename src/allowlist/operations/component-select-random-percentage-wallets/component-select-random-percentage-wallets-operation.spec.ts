import { ComponentSelectRandomPercentageWalletsOperation } from './component-select-random-percentage-wallets-operation';
import { defaultLogFactory } from './../../../logging/logging-emitter';
import { AllowlistState } from './../../../allowlist/state-types/allowlist-state';
import { ComponentSelectRandomPercentageWalletsParams } from './component-select-random-percentage-wallets.types';
import {
  anAllowlistComponent,
  anAllowlistItem,
  anAllowlistPhase,
  anAllowlistState,
} from '../../../allowlist/state-types/allowlist-state.test.fixture';
import { anAllowlistLargeItemTokens } from '../../state-types/allowlist-state.test.fixture.large';
import { getComponentPath } from '../../../utils/path.utils';
import { CardStatistics } from '../../../app-types';

describe('ComponentSelectRandomPercentageWalletsOperation', () => {
  const op = new ComponentSelectRandomPercentageWalletsOperation(
    defaultLogFactory,
  );
  let state: AllowlistState;
  let params: ComponentSelectRandomPercentageWalletsParams;

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
      percentage: 20,
      seed: 'seed',
    };
  });

  it('throws error if componentId is missing', () => {
    expect(() => {
      op.validate({
        percentage: 1,
        seed: 'seed',
      });
    }).toThrow('Missing componentId');
  });

  it('throws error if componentId is not a string', () => {
    expect(() => {
      op.validate({
        componentId: 1,
        percentage: 1,
        seed: 'seed',
      });
    }).toThrow('Invalid componentId');
  });

  it('throws error if componentId is empty', () => {
    expect(() =>
      op.validate({
        componentId: '',
        percentage: 1,
        seed: 'seed',
      }),
    ).toThrow('Invalid componentId');
  });

  it('throws error if percentage is missing', () => {
    expect(() => {
      op.validate({
        componentId: 'component-1',
        seed: 'seed',
      });
    }).toThrow('Missing percentage');
  });

  it('throws error if percentage is not a number', () => {
    expect(() => {
      op.validate({
        componentId: 'component-1',
        percentage: '1',
        seed: 'seed',
      });
    }).toThrow('Invalid percentage');
  });

  it('throws error if percentage is less than 0', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        percentage: -1,
        seed: 'seed',
      }),
    ).toThrow('Invalid percentage');
  });

  it('throws error if percentage is greater than 100', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        percentage: 101,
        seed: 'seed',
      }),
    ).toThrow('Invalid percentage');
  });

  it('throws error if seed is missing', () => {
    expect(() => {
      op.validate({
        componentId: 'component-1',
        percentage: 1,
      });
    }).toThrow('Missing seed');
  });

  it('throws error if seed is not a string', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        percentage: 1,
        seed: 1,
      }),
    ).toThrow('Invalid seed');
  });

  it('throws error if seed is empty', () => {
    expect(() =>
      op.validate({
        componentId: 'component-1',
        percentage: 1,
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
      "COMPONENT_SELECT_RANDOM_PERCENTAGE_WALLETS: Component 'component-6' does not exist, componentId: component-6",
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
        '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
        '0xfe3b3F0D64F354b69A5B40D02f714E69cA4B09bd',
        '0x8889EBB11295F456541901f50BCB5f382047cAaC',
        '0xF9e129817BC576f937e4774E3C3Aec98787Cfb91',
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
      '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
      '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
      '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
      '0x9769334FC882775F4951865aA473481880669D47',
      '0x9769334FC882775F4951865aA473481880669D47',
      '0x9769334FC882775F4951865aA473481880669D47',
      '0x9769334FC882775F4951865aA473481880669D47',
      '0x9769334FC882775F4951865aA473481880669D47',
      '0x9769334FC882775F4951865aA473481880669D47',
      '0x9769334FC882775F4951865aA473481880669D47',
      '0x9769334FC882775F4951865aA473481880669D47',
      '0x9769334FC882775F4951865aA473481880669D47',
      '0x9769334FC882775F4951865aA473481880669D47',
      '0xbDf82b13580b918ebc3c24b4034E8468EA168E21',
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
      '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
      '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
      '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
      '0x88D3574660711e03196aF8A96f268697590000Fa',
      '0x88D3574660711e03196aF8A96f268697590000Fa',
      '0xddA3cb2741FaC4a87CAebec9EFC7963087304097',
      '0x7f3774EAdae4beB01919deC7f32A72e417Ab5DE3',
    ]);
  });
});
