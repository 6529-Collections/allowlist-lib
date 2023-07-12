import { ItemSortWalletsByMemesTdhOperation } from './item-sort-wallets-by-memes-tdh-operation';
import { defaultLogFactory } from './../../../logging/logging-emitter';
import { AllowlistState } from './../../../allowlist/state-types/allowlist-state';
import { ItemSortWalletsByMemesTdhParams } from './item-sort-wallets-by-memes-tdh.types';
import {
  anAllowlistComponent,
  anAllowlistItem,
  anAllowlistPhase,
  anAllowlistState,
} from '../../../allowlist/state-types/allowlist-state.test.fixture';
import { anAllowlistRandomMemes100Tokens } from '../../state-types/allowlist-state.test.fixture.large';
import * as fs from 'fs';
import { Mutable } from '../../../app-types';

describe('ItemSortWalletsByMemesTdhOperation', () => {
  const op = new ItemSortWalletsByMemesTdhOperation(
    {
      getUploadsForBlock: jest
        .fn()
        .mockResolvedValue(
          JSON.parse(fs.readFileSync(`mock-data/random100Tdh.json`, 'utf8')),
        ),
    } as any,
    defaultLogFactory,
  );
  let state: AllowlistState;
  let params: Mutable<
    ItemSortWalletsByMemesTdhParams,
    'itemId' | 'tdhBlockNumber'
  >;

  beforeEach(() => {
    state = anAllowlistState({
      phases: [
        anAllowlistPhase({
          components: [
            anAllowlistComponent({
              items: [
                anAllowlistItem({
                  tokens: anAllowlistRandomMemes100Tokens(),
                }),
              ],
            }),
          ],
        }),
      ],
    });
    params = {
      itemId: 'item-1',
      tdhBlockNumber: 17676050,
    };
  });

  it('throws if missing itemId', async () => {
    delete params.itemId;
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Missing itemId',
    );
  });

  it('throws if itemId is not a string', async () => {
    params.itemId = 1 as any;
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Invalid itemId',
    );
  });

  it('thorws if itemId is empty string', async () => {
    params.itemId = '';
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Invalid itemId',
    );
  });

  it('throws if missing tdhBlockNumber', async () => {
    delete params.tdhBlockNumber;
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Missing tdhBlockNumber',
    );
  });

  it('throws if tdhBlockNumber is not a number', async () => {
    params.tdhBlockNumber = '1' as any;
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Invalid tdhBlockNumber',
    );
  });

  it('throws if tdhBlockNumber is not an integer', async () => {
    params.tdhBlockNumber = 1.1;
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Invalid tdhBlockNumber',
    );
  });

  it('throws if tdhBlockNumber is negative', async () => {
    params.tdhBlockNumber = -1;
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Invalid tdhBlockNumber',
    );
  });

  it('validates params', async () => {
    expect(op.validate(params)).toEqual(true);
  });

  it('throws if item does not exist', async () => {
    params.itemId = 'item-2';
    await expect(op.execute({ params, state })).rejects.toThrow(
      "Item 'item-2' not found",
    );
  });

  it('sorts item wallets by memes tdh', async () => {
    await op.execute({ params, state });
    expect(
      state.phases['phase-1'].components['component-1'].items['item-1'].tokens,
    ).toEqual([
      {
        id: '53',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1673615663,
      },
      {
        id: '64',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1675794827,
      },
      {
        id: '62',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1675422431,
      },
      {
        id: '8',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1658589638,
      },
      {
        id: '52',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1673438687,
      },
      {
        id: '73',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1677667247,
      },
      {
        id: '8',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1658589638,
      },
      {
        id: '75',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1678109387,
      },
      {
        id: '82',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1679486159,
      },
      {
        id: '58',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1674674627,
      },
      {
        id: '60',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1675089851,
      },
      {
        id: '52',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1673438687,
      },
      {
        id: '2',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1654795065,
      },
      {
        id: '86',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1680261131,
      },
      {
        id: '88',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1681903127,
      },
      {
        id: '65',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1676043803,
      },
      {
        id: '83',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1679659835,
      },
      {
        id: '51',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1673263343,
      },
      {
        id: '19',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1664456555,
      },
      {
        id: '56',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1674222155,
      },
      {
        id: '2',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1654795065,
      },
      {
        id: '66',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1676298299,
      },
      {
        id: '67',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1676466527,
      },
      {
        id: '77',
        owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        since: 1678454519,
      },
      {
        id: '27',
        owner: '0x248458947c120ca057ec028b3fe7e4b3f26fdb3d',
        since: 1666371707,
      },
      {
        id: '74',
        owner: '0x69cb3b1de24e08f1cfc2994171b6c6930498f750',
        since: 1677860159,
      },
      {
        id: '67',
        owner: '0x69cb3b1de24e08f1cfc2994171b6c6930498f750',
        since: 1676466527,
      },
      {
        id: '17',
        owner: '0xcaa1c396e70384db58dd33be74b26fb119e98c3a',
        since: 1664378387,
      },
      {
        id: '54',
        owner: '0x6f566a6672f615c2975f6c48224c46153e12ffcf',
        since: 1673885183,
      },
      {
        id: '83',
        owner: '0xea39c551834d07ee2ee87f1ceff843c308e089af',
        since: 1679871299,
      },
      {
        id: '25',
        owner: '0xc7bb15c11595c877302ddfb330a4082d92f5bcd7',
        since: 1665988079,
      },
      {
        id: '49',
        owner: '0xee2c055f7706b9dfcd98cd5a23d5629d6316c0bd',
        since: 1672849811,
      },
      {
        id: '81',
        owner: '0xf1f476f144df01480297dca47efca565e8b0c9f1',
        since: 1679330495,
      },
      {
        id: '60',
        owner: '0x5de26d392ea46ffc17131042e2584fe6ba46206f',
        since: 1675089851,
      },
      {
        id: '51',
        owner: '0x3852471d266d9e2222ca9fdd922bafc904dc49e5',
        since: 1673263343,
      },
      {
        id: '7',
        owner: '0x19e7a132bd4b42f580f546197f42e19c42cdfe6c',
        since: 1658352372,
      },
      {
        id: '33',
        owner: '0x5f656037e30a003862cf878db24ab5f537177fd9',
        since: 1667837147,
      },
      {
        id: '26',
        owner: '0xe16df6503acd3c79b6e032f62c61752bec16eef2',
        since: 1666276523,
      },
      {
        id: '19',
        owner: '0x96e861634b4c0e0a9e7c6a65dec549cc2a8a0e56',
        since: 1664456555,
      },
      {
        id: '14',
        owner: '0xbdf82b13580b918ebc3c24b4034e8468ea168e21',
        since: 1661954242,
      },
      {
        id: '43',
        owner: '0x81974c1a09e53c5129c6e4f74e547fda0adf4d2d',
        since: 1675461251,
      },
      {
        id: '54',
        owner: '0x13928eb9a86c8278a45b6ff2935c7730b58ac675',
        since: 1675362659,
      },
      {
        id: '70',
        owner: '0xc78cd2e1e8ad4a288eddafb139c9d0891ad01ae7',
        since: 1677081707,
      },
      {
        id: '62',
        owner: '0xb6cf25f5cf8a1e1727d988facdd47f1dfc492caf',
        since: 1675440047,
      },
      {
        id: '28',
        owner: '0xd1dd467f1630be10d67205d6c816429f8ee49124',
        since: 1675744403,
      },
      {
        id: '67',
        owner: '0xea0ed16746257eb2bc11de2fefd63cdeece23a98',
        since: 1676512919,
      },
      {
        id: '12',
        owner: '0x147f466fef6bd04617fc0c8037ea01c73bc25a3f',
        since: 1664192963,
      },
      {
        id: '78',
        owner: '0x29c2188c6c318ab5cae4ae4b11a49edf2ec9ab0e',
        since: 1678723583,
      },
      {
        id: '90',
        owner: '0x2c9646bf2477a747897047b69ca1a1913ae5f611',
        since: 1682348435,
      },
      {
        id: '79',
        owner: '0x74d50ea9f8cf5652e75102c3fa049c01534dd6c4',
        since: 1678897139,
      },
      {
        id: '13',
        owner: '0x367dc97068ab54ba1dfbfc0fad12fbcb7b3a0d09',
        since: 1671441623,
      },
      {
        id: '5',
        owner: '0xe1c22662f4f1320c6e5319d002b3c3d52f0d0135',
        since: 1662305239,
      },
      {
        id: '64',
        owner: '0x6140f00e4ff3936702e68744f2b5978885464cbb',
        since: 1675794827,
      },
      {
        id: '44',
        owner: '0xf84408070b4de16d6bb0ab2fd8b19d37e3fd1422',
        since: 1676321999,
      },
      {
        id: '29',
        owner: '0x17e31bf839acb700e0f584797574a2c1fde46d0b',
        since: 1666934195,
      },
      {
        id: '61',
        owner: '0x6d1db4a7e83dae0eee7e95d421722d46d2a7e94b',
        since: 1675267667,
      },
      {
        id: '58',
        owner: '0x6d1db4a7e83dae0eee7e95d421722d46d2a7e94b',
        since: 1675119743,
      },
      {
        id: '41',
        owner: '0xe96ba1a10f72b58934b9ac0e3fb471d2ba65b757',
        since: 1673963159,
      },
      {
        id: '5',
        owner: '0x2d1543711bd262108fd8a1afb43d8871f76c134c',
        since: 1669663511,
      },
      {
        id: '51',
        owner: '0x2d1543711bd262108fd8a1afb43d8871f76c134c',
        since: 1673329559,
      },
      {
        id: '25',
        owner: '0x0843e80240f9304f3fe7059f25f3e1a66886a0eb',
        since: 1665682655,
      },
      {
        id: '52',
        owner: '0x2a0a412e0a0d436cca7ddba177c4dd9f29801062',
        since: 1674843131,
      },
      {
        id: '42',
        owner: '0xa0f1de4882a5cd1851989d9a1e9bbe9b4604e9a9',
        since: 1670879375,
      },
      {
        id: '87',
        owner: '0x886478d3cf9581b624cb35b5446693fc8a58b787',
        since: 1681743671,
      },
      {
        id: '15',
        owner: '0x16f3d833bb91aebb5066884501242d8b3c3b5e61',
        since: 1669397303,
      },
      {
        id: '3',
        owner: '0x2a462fb59a5b0885b60ad31c5fe473d5ba0d79fd',
        since: 1672148807,
      },
      {
        id: '62',
        owner: '0xc1966d218b7492dd9cd672a5a237cef4d82004e5',
        since: 1675440059,
      },
      {
        id: '57',
        owner: '0xc18d4c2fee42accfe7bfdce98bfacbabf76242e9',
        since: 1674576131,
      },
      {
        id: '7',
        owner: '0xc18d4c2fee42accfe7bfdce98bfacbabf76242e9',
        since: 1658351753,
      },
      {
        id: '50',
        owner: '0x0d6b4f304b91a3b67b1db34776ef7e95effbc729',
        since: 1680617927,
      },
      {
        id: '43',
        owner: '0x774a34da2ee2e2d242180819f1ee88783215f7b9',
        since: 1674626183,
      },
      {
        id: '68',
        owner: '0xffe6832850476eb6d5ff184d747ed84f1b686aa9',
        since: 1676649707,
      },
      {
        id: '46',
        owner: '0x128ad42b82c752c5b4c7f679231d8956c98038eb',
        since: 1671477611,
      },
      {
        id: '16',
        owner: '0x45133db3eadd8718f5c3a868ec2f7148e460dcfd',
        since: 1674551627,
      },
      {
        id: '32',
        owner: '0x4d7e6948fb5ed2d92897de0605cd642eff69fbf4',
        since: 1674519191,
      },
      {
        id: '90',
        owner: '0x64f02c24bb510e27b5eaec705eaa840ff7b4df15',
        since: 1682438027,
      },
      {
        id: '66',
        owner: '0x69c8c2923005d26eaeea9500d7602eff8c81c848',
        since: 1676304287,
      },
      {
        id: '59',
        owner: '0xb1c11a879c47debc22e3816e7b727fc8bbe3c8ac',
        since: 1674861431,
      },
      {
        id: '74',
        owner: '0x8623a32af48544b055fb6ae64f33eb43edf091ff',
        since: 1679727539,
      },
      {
        id: '81',
        owner: '0xe8a05c7f4e9c1aa060cf941dbb50381f342d7d43',
        since: 1679328023,
      },
      {
        id: '51',
        owner: '0x4b6c1d196e06446eb0534326bbfb02cc3d073a2b',
        since: 1673263343,
      },
      {
        id: '39',
        owner: '0x167a4e6066d6c96d5c012006f5cffc9f606131ec',
        since: 1674179759,
      },
      {
        id: '5',
        owner: '0x730a94e8935bf2c1c2e9ffc010cff0d4881d35df',
        since: 1682098319,
      },
      {
        id: '72',
        owner: '0x44f301b1de6c3fec0f8a8aea53311f5cca499904',
        since: 1677513719,
      },
      {
        id: '85',
        owner: '0xfed52d251e31178ff8bf4a0d611721c544f74fc0',
        since: 1680093287,
      },
      {
        id: '53',
        owner: '0x22418183c90741bab6606c0e0d240ae6c3a148f0',
        since: 1675984115,
      },
      {
        id: '18',
        owner: '0x22418183c90741bab6606c0e0d240ae6c3a148f0',
        since: 1664381531,
      },
      {
        id: '18',
        owner: '0x04294157cfba9ff0892f48f8345ea3539995f449',
        since: 1673893523,
      },
      {
        id: '84',
        owner: '0x0dd38657d7c8024e7d62bde3d0423ca34769be50',
        since: 1680312287,
      },
      {
        id: '50',
        owner: '0x28e6c1352950238be088ef2a741f3c8b91b9ffad',
        since: 1675078079,
      },
      {
        id: '39',
        owner: '0x3d3af253b037d3b22c4c810673c5d14de16d1af3',
        since: 1674762683,
      },
      {
        id: '74',
        owner: '0xfe7ace0f186a54c0be46f992dd3072e0053a1010',
        since: 1677859583,
      },
      {
        id: '17',
        owner: '0x32e263cb9003f7fef329080bdcbc82f5cfd6c02f',
        since: 1664294675,
      },
      {
        id: '85',
        owner: '0xd981a38d80de1c1528349b841833d3a9a745cb37',
        since: 1680093503,
      },
      {
        id: '87',
        owner: '0x9ad53944b52e271f1114028b918202cfaaec0a3d',
        since: 1681767143,
      },
      {
        id: '31',
        owner: '0x14abeea8db07c46b37a79bfa856d4c2da6d3e6df',
        since: 1674944447,
      },
      {
        id: '78',
        owner: '0x3bc161e3a5604165f3165ed8aaaf0d490e559324',
        since: 1678723391,
      },
      {
        id: '51',
        owner: '0xfff39900273ffb1045c7cfde62df1720b63fd6bd',
        since: 1673280023,
      },
      {
        id: '39',
        owner: '0xa4b61e227361a9cd9e62ca10946c27748a382cab',
        since: 1669651247,
      },
      {
        id: '2',
        owner: '0xc522289168311a765cf17c067f0118578c99cf08',
        since: 1674364463,
      },
      {
        id: '93',
        owner: '0x03024d05b1aea10b64ff3af1fed6a3df9adeebb7',
        since: 1682953679,
      },
      {
        id: '48',
        owner: '0x1033caf4e55579e8aa1cc59c3c302d7d924f9f89',
        since: 1681472495,
      },
      {
        id: '3',
        owner: '0xd74e767c77d2e9f9e467e7914f2379da81b63a44',
        since: 1679697299,
      },
      {
        id: '84',
        owner: '0x215cbb1b60e2cc1f1e8626cadca386b278aa0dee',
        since: 1679993819,
      },
      {
        id: '8',
        owner: '0x42e5abe19ba467b0b32a4d042d3dfd4ba2e196af',
        since: 1674274067,
      },
      {
        id: '33',
        owner: '0xa7c342af335ea7e0747452ae2e3c1901498a9a76',
        since: 1674897767,
      },
      {
        id: '76',
        owner: '0xb335326c7f2cd2e4eb09ce3d1745c92f66497b7e',
        since: 1678291355,
      },
      {
        id: '19',
        owner: '0xe418a9a5e49dde0d13e1ef51d4bfb7fcc51c28df',
        since: 1682400767,
      },
      {
        id: '68',
        owner: '0xe418a9a5e49dde0d13e1ef51d4bfb7fcc51c28df',
        since: 1676663891,
      },
      {
        id: '88',
        owner: '0x986d1bfc94671b5633d90d0540820bd3813e3a50',
        since: 1681976231,
      },
      {
        id: '9',
        owner: '0xae72c6a6fad9fa9d82d089e1ebf73b3043855425',
        since: 1659530787,
      },
      {
        id: '45',
        owner: '0x159e5998669ec6628a6b670c2ef1ddbd93084698',
        since: 1670861003,
      },
      {
        id: '8',
        owner: '0xe4c8335467ce3b1854dd828f14bbb33aa4771818',
        since: 1669036847,
      },
      {
        id: '93',
        owner: '0xc03e57b6ace9dd62c84a095e11e494e3c8fd4d42',
        since: 1682928731,
      },
      {
        id: '63',
        owner: '0xc13d5024c2ee14c5f80847afd09275f8b550a135',
        since: 1676304611,
      },
      {
        id: '81',
        owner: '0x7e0051a0b48f3c5848e66fd02bea3400f979a89a',
        since: 1679362619,
      },
      {
        id: '77',
        owner: '0x571493b6bb0b99dda41e2da1774b8c9b5bc302af',
        since: 1678584779,
      },
      {
        id: '78',
        owner: '0x21f023839e7b6fee67d33e4548791fa388564a02',
        since: 1678724639,
      },
      {
        id: '62',
        owner: '0x6e1ac9b3f4499a73385dd8d2daed6449406d49f4',
        since: 1675440059,
      },
      {
        id: '43',
        owner: '0x2e299b7faa9b906117181a4550d828b1300b48d1',
        since: 1670428871,
      },
      {
        id: '11',
        owner: '0x30f2a414945ba487f6a9ca909d0cc0919c6a1812',
        since: 1673526791,
      },
      {
        id: '46',
        owner: '0x3d20c3f372207074df1a0ab5272c7168ce23d178',
        since: 1671033623,
      },
      {
        id: '27',
        owner: '0x9feba45425c51b03890604d6ad51f4ee7c9d4866',
        since: 1674428207,
      },
      {
        id: '71',
        owner: '0x956f7db2fdb52de9453ae184d51d1883b8cd9d68',
        since: 1677271415,
      },
      {
        id: '41',
        owner: '0x88ccdfe9dd047b4cec4c1102d2d803e2d8bf683e',
        since: 1675520375,
      },
      {
        id: '23',
        owner: '0xfe8312a959e031c7d4cbe3f9cdd3ec8726d0d80e',
        since: 1675000283,
      },
      {
        id: '55',
        owner: '0x0fb7f9eb8e9bee4dd70dc334b94dee2621a32fb3',
        since: 1674057611,
      },
      {
        id: '41',
        owner: '0x3a10fd1387555cd75db8142393fbaba98efe28d4',
        since: 1671043847,
      },
      {
        id: '63',
        owner: '0x8d5e59e11838cff72af5fb0681d96a9136ad0604',
        since: 1675708847,
      },
      {
        id: '25',
        owner: '0x8dcd5fa47d7ef22db41b2b66504923ccca5065a3',
        since: 1671222983,
      },
      {
        id: '60',
        owner: '0x97a45305513133c62b2e3a1f2181dfb5ffdbb450',
        since: 1675094411,
      },
      {
        id: '73',
        owner: '0xff3bc8de74bb1d2f9066c9687f62bf810c66c5ea',
        since: 1677915647,
      },
      {
        id: '16',
        owner: '0x98172111480cc81621fd8b12bed2fb5095be11a5',
        since: 1674763067,
      },
      {
        id: '75',
        owner: '0x53b2da71db2e266882a465d9aeeaae3e8beeb9ee',
        since: 1678118435,
      },
      {
        id: '75',
        owner: '0x791967551708fe99eb2cd8dd580ef98c61e67ac3',
        since: 1678166183,
      },
      {
        id: '85',
        owner: '0xa9237c4eeebc879208e59c867cb6d7cbffc1df30',
        since: 1680093503,
      },
      {
        id: '33',
        owner: '0x9fc80955aee9e3eb8c511a50a72b7e589700ffd6',
        since: 1674409871,
      },
      {
        id: '54',
        owner: '0x4e61548d94c8649ebfc2f5f54d2272fcbc687bf2',
        since: 1673884835,
      },
      {
        id: '85',
        owner: '0xc4c65d75dd6579671db24990bad1f502d7c96c8c',
        since: 1680093503,
      },
      {
        id: '43',
        owner: '0x9d52fd3f58557f3b5fcd2b10314bf566cabca60a',
        since: 1671556727,
      },
      {
        id: '64',
        owner: '0x9c7471c6d03cddab9ef6e1db6ed93fb8f9328072',
        since: 1675918859,
      },
      {
        id: '56',
        owner: '0x71e22168b702bcff528b8974cd4b723250b67609',
        since: 1674230483,
      },
      {
        id: '21',
        owner: '0xa222204acf1be4077d34102fab38a759060b77c2',
        since: 1664904671,
      },
      {
        id: '76',
        owner: '0xe01a97fc4607a388a41626d5e039fdecbfc6acd9',
        since: 1678383983,
      },
      {
        id: '54',
        owner: '0x32dd9f6885332ccf8633a18cb0c2e25e68fe03d1',
        since: 1673904815,
      },
      {
        id: '56',
        owner: '0xaaae5c0a8e05ee5b3824b2e9fe939d5dc3ba3336',
        since: 1674286523,
      },
      {
        id: '9',
        owner: '0xe8cc7c453eca25450ca16d551db93d5f5740e054',
        since: 1659530787,
      },
      {
        id: '6',
        owner: '0x59aa4d2140ec130a76cd69cb0974cec4dbd110a3',
        since: 1672775855,
      },
      {
        id: '39',
        owner: '0x50002a9b8e9938d509de84dc3eb3aabfbec1451e',
        since: 1673362367,
      },
      {
        id: '50',
        owner: '0xa2b55ffb7ada20a70a1e6e79073f2f4d6623d72c',
        since: 1675114907,
      },
      {
        id: '60',
        owner: '0xcfd648eb66b736351f48dbd5a1752708371c10f4',
        since: 1675094447,
      },
      {
        id: '5',
        owner: '0x84f8bff48b845e7cc2f5a9175860ef6b0016c1d6',
        since: 1657626417,
      },
      {
        id: '61',
        owner: '0xe74419fda5425b88fe288923f5df60a5cda057be',
        since: 1680558083,
      },
      {
        id: '1',
        owner: '0xceab2935e06c646e560e2f6083c55db6e8e12099',
        since: 1660703509,
      },
      {
        id: '67',
        owner: '0x13c942e3f8be4faf966ef03e6038b33d000db22f',
        since: 1677175571,
      },
      {
        id: '63',
        owner: '0xcc4405ee3ee4db06e96b8cf74f7a55b7a9d194f5',
        since: 1679870171,
      },
      {
        id: '41',
        owner: '0x6b32a10fab26bab0a92dea063f2261a196982c40',
        since: 1680558071,
      },
      {
        id: '13',
        owner: '0x3f0fdcd6f59fc4ff885006678e4ada78de1b0dd9',
        since: 1675099115,
      },
      {
        id: '26',
        owner: '0x75d7d7972a62b00ff7ef071741c929f59d185ee6',
        since: 1676548187,
      },
      {
        id: '8',
        owner: '0x7426b39865d11207b8f795b10d70843fc3289051',
        since: 1680802775,
      },
      {
        id: '56',
        owner: '0xa42098ea9ba9296a80a49c11e22a66c07a5e8212',
        since: 1674253739,
      },
      {
        id: '8',
        owner: '0xf2dca9d0652c43784522397c11b19694c73074a6',
        since: 1658698543,
      },
      {
        id: '60',
        owner: '0xcc97dc4b6488ca9731c98e1bd5656599b08bac91',
        since: 1678754015,
      },
      {
        id: '15',
        owner: '0xdbe2258624f94ab8ee30ceb67b2a078b24bb6d6d',
        since: 1672187327,
      },
      {
        id: '65',
        owner: '0x9b5f50146a361f82b1fedf63c5d04d4918a730c3',
        since: 1680557603,
      },
      {
        id: '73',
        owner: '0x3667e767a12f9057ef12dc58764400b34cd88320',
        since: 1677686483,
      },
      {
        id: '70',
        owner: '0x79fc35270a2e7082538bb01487053bc695bf5781',
        since: 1681636823,
      },
      {
        id: '52',
        owner: '0x96545a59ce81bb6acaf95957ea09cf577889112f',
        since: 1675882163,
      },
      {
        id: '79',
        owner: '0x33def458065819613e73f6ed3172db2673b7850e',
        since: 1678886519,
      },
      {
        id: '65',
        owner: '0xfded90a3b1348425577688866f798f94d77a0d02',
        since: 1676043803,
      },
      {
        id: '58',
        owner: '0xad43d2aea785e775bd38b5bbf4c5808572758373',
        since: 1677624875,
      },
      {
        id: '88',
        owner: '0x75b772f2bb4f47fbb31b14d6e034b81cb0a03730',
        since: 1681916483,
      },
      {
        id: '23',
        owner: '0xc6761b1e064eac2b6058f59fd0c4954ddcd1f513',
        since: 1675083215,
      },
      {
        id: '56',
        owner: '0xfc58ab0c3d7810b05af4b347653dab8187e22c1b',
        since: 1680609839,
      },
      {
        id: '49',
        owner: '0xc8b28b6a310904c83d128be83b3797073b5c5302',
        since: 1672841807,
      },
      {
        id: '88',
        owner: '0x01db485f57dc000e761b85641f78c9d212a2eeab',
        since: 1681903127,
      },
      {
        id: '67',
        owner: '0xa35f29893418c61ab675557ee5228e5225e78ba4',
        since: 1676479511,
      },
      {
        id: '43',
        owner: '0x16dac8fcb28cbda1db793a612847a0be1a04e554',
        since: 1670444663,
      },
      {
        id: '59',
        owner: '0x9aa2b4782b7cf35b7dfc699604a4de16d80adfd6',
        since: 1674835679,
      },
      {
        id: '55',
        owner: '0x1ffc29a768e26ab393ea93e4284773410a84b660',
        since: 1674041171,
      },
      {
        id: '62',
        owner: '0xf2f2503d93cc1afd87ae80d38d76cba64249acf5',
        since: 1675440527,
      },
      {
        id: '82',
        owner: '0x7af061a6ec9616135231cb8de2ed2a0a4140e90b',
        since: 1679525687,
      },
      {
        id: '9',
        owner: '0x82f23de5a474fc904041c357576afe53c30dd250',
        since: 1659530787,
      },
      {
        id: '91',
        owner: '0x9bdce45a073e42b157b808e9b5a97f0e467889fb',
        since: 1682508059,
      },
      {
        id: '91',
        owner: '0xc7cbf5e1a25d53b12f8ea53cd0b8ddd0c999e127',
        since: 1682508059,
      },
      {
        id: '65',
        owner: '0x2307482c97ffa776ab7a391a707889e15d62dd98',
        since: 1676044859,
      },
      {
        id: '67',
        owner: '0x7165a04c41c9e5e67d4850eab1dc6ede84d117f0',
        since: 1676497955,
      },
      {
        id: '67',
        owner: '0xeb44f8ac5e0988a51448c472143a7555743e01a5',
        since: 1676572043,
      },
      {
        id: '42',
        owner: '0x3cf5ec55ec96f649a05c3a380d8a2b972a04abff',
        since: 1679440247,
      },
      {
        id: '8',
        owner: '0x2f39d00a1fc21f2dc9eb5671147c7ae98f254b6a',
        since: 1669177415,
      },
      {
        id: '8',
        owner: '0xd4cf19f76addb489d079d0f60f41d6e91e7c79e1',
        since: 1681805339,
      },
      {
        id: '8',
        owner: '0x0000000000000000000000000000000000000000',
        since: 1669533911,
      },
      {
        id: '89',
        owner: '0x13b75d28f53a4335a544e05a54ed4b52d19a16ec',
        since: 1682089559,
      },
      {
        id: '91',
        owner: '0xac9169946d4f6fea622900fa6aa1812d5500bade',
        since: 1682585903,
      },
      {
        id: '93',
        owner: '0xa530f7739413e787c205233658185edc1e68c25e',
        since: 1682953235,
      },
      {
        id: '8',
        owner: '0x0000000000000000000000000000000000000000',
        since: 1669533911,
      },
      {
        id: '8',
        owner: '0x0000000000000000000000000000000000000000',
        since: 1669533911,
      },
      {
        id: '8',
        owner: '0x0000000000000000000000000000000000000000',
        since: 1669533911,
      },
      {
        id: '8',
        owner: '0x0000000000000000000000000000000000000000',
        since: 1669533911,
      },
      {
        id: '8',
        owner: '0x0000000000000000000000000000000000000000',
        since: 1669533911,
      },
    ]);
  });
});
