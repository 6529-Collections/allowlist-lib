import { ConsolidationMapping } from '../../services/seize/consolidation-mapping';
import { AllowlistItemToken } from './allowlist-item';
import { TokenOwnership } from './token-ownership';
import { Transfer } from './transfer';
import * as fs from 'fs';

export const anAllowlistLargeItemTokens = (): AllowlistItemToken[] => [
  {
    id: '1',
    owner: '0xfd22004806a6846ea67ad883356be810f0428793',
  },
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
    id: '2',
    owner: '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
  },
  {
    id: '3',
    owner: '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
  },
  {
    id: '1',
    owner: '0xE16dF6503Acd3c79b6E032f62c61752bEC16eeF2',
  },
  {
    id: '2',
    owner: '0xE16dF6503Acd3c79b6E032f62c61752bEC16eeF2',
  },
  {
    id: '3',
    owner: '0xE16dF6503Acd3c79b6E032f62c61752bEC16eeF2',
  },
  {
    id: '4',
    owner: '0xE16dF6503Acd3c79b6E032f62c61752bEC16eeF2',
  },
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

export const anAllowlistSmallItemTokens = (): AllowlistItemToken[] => [
  {
    id: '1',
    owner: '0xc3c9737cce778d7583f31ae7c4f2ab8782ed51e5',
  },
  {
    id: '1',
    owner: '0xA62DA2Ea9F5bB03a58174060535ae32131973178',
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
    owner: '0xfd22004806a6846ea67ad883356be810f0428793',
  },
];

export const anAllowlistRandomMemes100Tokens = (): AllowlistItemToken[] => [
  {
    id: '54',
    owner: '0x13928eb9a86c8278a45b6ff2935c7730b58ac675',
  },
  {
    id: '74',
    owner: '0xfe7ace0f186a54c0be46f992dd3072e0053a1010',
  },
  {
    id: '8',
    owner: '0xd4cf19f76addb489d079d0f60f41d6e91e7c79e1',
  },
  {
    id: '52',
    owner: '0x96545a59ce81bb6acaf95957ea09cf577889112f',
  },
  {
    id: '90',
    owner: '0x64f02c24bb510e27b5eaec705eaa840ff7b4df15',
  },
  {
    id: '13',
    owner: '0x3f0fdcd6f59fc4ff885006678e4ada78de1b0dd9',
  },
  {
    id: '53',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '2',
    owner: '0xc522289168311a765cf17c067f0118578c99cf08',
  },
  {
    id: '64',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '81',
    owner: '0xf1f476f144df01480297dca47efca565e8b0c9f1',
  },
  {
    id: '28',
    owner: '0xd1dd467f1630be10d67205d6c816429f8ee49124',
  },
  {
    id: '5',
    owner: '0x730a94e8935bf2c1c2e9ffc010cff0d4881d35df',
  },
  {
    id: '61',
    owner: '0x6d1db4a7e83dae0eee7e95d421722d46d2a7e94b',
  },
  {
    id: '6',
    owner: '0x59aa4d2140ec130a76cd69cb0974cec4dbd110a3',
  },
  {
    id: '67',
    owner: '0xea0ed16746257eb2bc11de2fefd63cdeece23a98',
  },
  {
    id: '41',
    owner: '0x88ccdfe9dd047b4cec4c1102d2d803e2d8bf683e',
  },
  {
    id: '8',
    owner: '0x0000000000000000000000000000000000000000',
  },
  {
    id: '43',
    owner: '0x9d52fd3f58557f3b5fcd2b10314bf566cabca60a',
  },
  {
    id: '41',
    owner: '0x6b32a10fab26bab0a92dea063f2261a196982c40',
  },
  {
    id: '56',
    owner: '0x71e22168b702bcff528b8974cd4b723250b67609',
  },
  {
    id: '62',
    owner: '0x6e1ac9b3f4499a73385dd8d2daed6449406d49f4',
  },
  {
    id: '62',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '19',
    owner: '0x96e861634b4c0e0a9e7c6a65dec549cc2a8a0e56',
  },
  {
    id: '43',
    owner: '0x81974c1a09e53c5129c6e4f74e547fda0adf4d2d',
  },
  {
    id: '8',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '62',
    owner: '0xb6cf25f5cf8a1e1727d988facdd47f1dfc492caf',
  },
  {
    id: '8',
    owner: '0x7426b39865d11207b8f795b10d70843fc3289051',
  },
  {
    id: '93',
    owner: '0x03024d05b1aea10b64ff3af1fed6a3df9adeebb7',
  },
  {
    id: '62',
    owner: '0xc1966d218b7492dd9cd672a5a237cef4d82004e5',
  },
  {
    id: '43',
    owner: '0x16dac8fcb28cbda1db793a612847a0be1a04e554',
  },
  {
    id: '63',
    owner: '0xc13d5024c2ee14c5f80847afd09275f8b550a135',
  },
  {
    id: '56',
    owner: '0xfc58ab0c3d7810b05af4b347653dab8187e22c1b',
  },
  {
    id: '82',
    owner: '0x7af061a6ec9616135231cb8de2ed2a0a4140e90b',
  },
  {
    id: '26',
    owner: '0xe16df6503acd3c79b6e032f62c61752bec16eef2',
  },
  {
    id: '9',
    owner: '0x82f23de5a474fc904041c357576afe53c30dd250',
  },
  {
    id: '81',
    owner: '0x7e0051a0b48f3c5848e66fd02bea3400f979a89a',
  },
  {
    id: '29',
    owner: '0x17e31bf839acb700e0f584797574a2c1fde46d0b',
  },
  {
    id: '12',
    owner: '0x147f466fef6bd04617fc0c8037ea01c73bc25a3f',
  },
  {
    id: '65',
    owner: '0xfded90a3b1348425577688866f798f94d77a0d02',
  },
  {
    id: '75',
    owner: '0x53b2da71db2e266882a465d9aeeaae3e8beeb9ee',
  },
  {
    id: '15',
    owner: '0xdbe2258624f94ab8ee30ceb67b2a078b24bb6d6d',
  },
  {
    id: '54',
    owner: '0x4e61548d94c8649ebfc2f5f54d2272fcbc687bf2',
  },
  {
    id: '49',
    owner: '0xc8b28b6a310904c83d128be83b3797073b5c5302',
  },
  {
    id: '7',
    owner: '0x19e7a132bd4b42f580f546197f42e19c42cdfe6c',
  },
  {
    id: '85',
    owner: '0xa9237c4eeebc879208e59c867cb6d7cbffc1df30',
  },
  {
    id: '50',
    owner: '0x0d6b4f304b91a3b67b1db34776ef7e95effbc729',
  },
  {
    id: '87',
    owner: '0x886478d3cf9581b624cb35b5446693fc8a58b787',
  },
  {
    id: '9',
    owner: '0xe8cc7c453eca25450ca16d551db93d5f5740e054',
  },
  {
    id: '50',
    owner: '0xa2b55ffb7ada20a70a1e6e79073f2f4d6623d72c',
  },
  {
    id: '23',
    owner: '0xc6761b1e064eac2b6058f59fd0c4954ddcd1f513',
  },
  {
    id: '75',
    owner: '0x791967551708fe99eb2cd8dd580ef98c61e67ac3',
  },
  {
    id: '65',
    owner: '0x2307482c97ffa776ab7a391a707889e15d62dd98',
  },
  {
    id: '8',
    owner: '0xe4c8335467ce3b1854dd828f14bbb33aa4771818',
  },
  {
    id: '68',
    owner: '0xffe6832850476eb6d5ff184d747ed84f1b686aa9',
  },
  {
    id: '57',
    owner: '0xc18d4c2fee42accfe7bfdce98bfacbabf76242e9',
  },
  {
    id: '19',
    owner: '0xe418a9a5e49dde0d13e1ef51d4bfb7fcc51c28df',
  },
  {
    id: '25',
    owner: '0x8dcd5fa47d7ef22db41b2b66504923ccca5065a3',
  },
  {
    id: '27',
    owner: '0x248458947c120ca057ec028b3fe7e4b3f26fdb3d',
  },
  {
    id: '52',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '64',
    owner: '0x6140f00e4ff3936702e68744f2b5978885464cbb',
  },
  {
    id: '49',
    owner: '0xee2c055f7706b9dfcd98cd5a23d5629d6316c0bd',
  },
  {
    id: '5',
    owner: '0xe1c22662f4f1320c6e5319d002b3c3d52f0d0135',
  },
  {
    id: '74',
    owner: '0x69cb3b1de24e08f1cfc2994171b6c6930498f750',
  },
  {
    id: '15',
    owner: '0x16f3d833bb91aebb5066884501242d8b3c3b5e61',
  },
  {
    id: '72',
    owner: '0x44f301b1de6c3fec0f8a8aea53311f5cca499904',
  },
  {
    id: '50',
    owner: '0x28e6c1352950238be088ef2a741f3c8b91b9ffad',
  },
  {
    id: '89',
    owner: '0x13b75d28f53a4335a544e05a54ed4b52d19a16ec',
  },
  {
    id: '60',
    owner: '0xcc97dc4b6488ca9731c98e1bd5656599b08bac91',
  },
  {
    id: '17',
    owner: '0xcaa1c396e70384db58dd33be74b26fb119e98c3a',
  },
  {
    id: '70',
    owner: '0xc78cd2e1e8ad4a288eddafb139c9d0891ad01ae7',
  },
  {
    id: '32',
    owner: '0x4d7e6948fb5ed2d92897de0605cd642eff69fbf4',
  },
  {
    id: '91',
    owner: '0xac9169946d4f6fea622900fa6aa1812d5500bade',
  },
  {
    id: '73',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '14',
    owner: '0xbdf82b13580b918ebc3c24b4034e8468ea168e21',
  },
  {
    id: '8',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '1',
    owner: '0xceab2935e06c646e560e2f6083c55db6e8e12099',
  },
  {
    id: '46',
    owner: '0x128ad42b82c752c5b4c7f679231d8956c98038eb',
  },
  {
    id: '55',
    owner: '0x1ffc29a768e26ab393ea93e4284773410a84b660',
  },
  {
    id: '67',
    owner: '0x13c942e3f8be4faf966ef03e6038b33d000db22f',
  },
  {
    id: '59',
    owner: '0xb1c11a879c47debc22e3816e7b727fc8bbe3c8ac',
  },
  {
    id: '74',
    owner: '0x8623a32af48544b055fb6ae64f33eb43edf091ff',
  },
  {
    id: '5',
    owner: '0x2d1543711bd262108fd8a1afb43d8871f76c134c',
  },
  {
    id: '75',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '51',
    owner: '0x4b6c1d196e06446eb0534326bbfb02cc3d073a2b',
  },
  {
    id: '51',
    owner: '0xfff39900273ffb1045c7cfde62df1720b63fd6bd',
  },
  {
    id: '65',
    owner: '0x9b5f50146a361f82b1fedf63c5d04d4918a730c3',
  },
  {
    id: '82',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '8',
    owner: '0xf2dca9d0652c43784522397c11b19694c73074a6',
  },
  {
    id: '41',
    owner: '0xe96ba1a10f72b58934b9ac0e3fb471d2ba65b757',
  },
  {
    id: '53',
    owner: '0x22418183c90741bab6606c0e0d240ae6c3a148f0',
  },
  {
    id: '78',
    owner: '0x21f023839e7b6fee67d33e4548791fa388564a02',
  },
  {
    id: '90',
    owner: '0x2c9646bf2477a747897047b69ca1a1913ae5f611',
  },
  {
    id: '33',
    owner: '0x9fc80955aee9e3eb8c511a50a72b7e589700ffd6',
  },
  {
    id: '5',
    owner: '0x84f8bff48b845e7cc2f5a9175860ef6b0016c1d6',
  },
  {
    id: '55',
    owner: '0x0fb7f9eb8e9bee4dd70dc334b94dee2621a32fb3',
  },
  {
    id: '46',
    owner: '0x3d20c3f372207074df1a0ab5272c7168ce23d178',
  },
  {
    id: '42',
    owner: '0xa0f1de4882a5cd1851989d9a1e9bbe9b4604e9a9',
  },
  {
    id: '43',
    owner: '0x2e299b7faa9b906117181a4550d828b1300b48d1',
  },
  {
    id: '88',
    owner: '0x986d1bfc94671b5633d90d0540820bd3813e3a50',
  },
  {
    id: '52',
    owner: '0x2a0a412e0a0d436cca7ddba177c4dd9f29801062',
  },
  {
    id: '39',
    owner: '0x50002a9b8e9938d509de84dc3eb3aabfbec1451e',
  },
  {
    id: '58',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '56',
    owner: '0xaaae5c0a8e05ee5b3824b2e9fe939d5dc3ba3336',
  },
  {
    id: '44',
    owner: '0xf84408070b4de16d6bb0ab2fd8b19d37e3fd1422',
  },
  {
    id: '68',
    owner: '0xe418a9a5e49dde0d13e1ef51d4bfb7fcc51c28df',
  },
  {
    id: '25',
    owner: '0xc7bb15c11595c877302ddfb330a4082d92f5bcd7',
  },
  {
    id: '93',
    owner: '0xc03e57b6ace9dd62c84a095e11e494e3c8fd4d42',
  },
  {
    id: '21',
    owner: '0xa222204acf1be4077d34102fab38a759060b77c2',
  },
  {
    id: '63',
    owner: '0xcc4405ee3ee4db06e96b8cf74f7a55b7a9d194f5',
  },
  {
    id: '60',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '81',
    owner: '0xe8a05c7f4e9c1aa060cf941dbb50381f342d7d43',
  },
  {
    id: '11',
    owner: '0x30f2a414945ba487f6a9ca909d0cc0919c6a1812',
  },
  {
    id: '39',
    owner: '0x167a4e6066d6c96d5c012006f5cffc9f606131ec',
  },
  {
    id: '9',
    owner: '0xae72c6a6fad9fa9d82d089e1ebf73b3043855425',
  },
  {
    id: '52',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '91',
    owner: '0x9bdce45a073e42b157b808e9b5a97f0e467889fb',
  },
  {
    id: '87',
    owner: '0x9ad53944b52e271f1114028b918202cfaaec0a3d',
  },
  {
    id: '2',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '85',
    owner: '0xfed52d251e31178ff8bf4a0d611721c544f74fc0',
  },
  {
    id: '86',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '88',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '33',
    owner: '0xa7c342af335ea7e0747452ae2e3c1901498a9a76',
  },
  {
    id: '65',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '83',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '8',
    owner: '0x2f39d00a1fc21f2dc9eb5671147c7ae98f254b6a',
  },
  {
    id: '61',
    owner: '0xe74419fda5425b88fe288923f5df60a5cda057be',
  },
  {
    id: '23',
    owner: '0xfe8312a959e031c7d4cbe3f9cdd3ec8726d0d80e',
  },
  {
    id: '93',
    owner: '0xa530f7739413e787c205233658185edc1e68c25e',
  },
  {
    id: '26',
    owner: '0x75d7d7972a62b00ff7ef071741c929f59d185ee6',
  },
  {
    id: '83',
    owner: '0xea39c551834d07ee2ee87f1ceff843c308e089af',
  },
  {
    id: '51',
    owner: '0x2d1543711bd262108fd8a1afb43d8871f76c134c',
  },
  {
    id: '42',
    owner: '0x3cf5ec55ec96f649a05c3a380d8a2b972a04abff',
  },
  {
    id: '71',
    owner: '0x956f7db2fdb52de9453ae184d51d1883b8cd9d68',
  },
  {
    id: '54',
    owner: '0x32dd9f6885332ccf8633a18cb0c2e25e68fe03d1',
  },
  {
    id: '59',
    owner: '0x9aa2b4782b7cf35b7dfc699604a4de16d80adfd6',
  },
  {
    id: '67',
    owner: '0x69cb3b1de24e08f1cfc2994171b6c6930498f750',
  },
  {
    id: '51',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '78',
    owner: '0x29c2188c6c318ab5cae4ae4b11a49edf2ec9ab0e',
  },
  {
    id: '60',
    owner: '0xcfd648eb66b736351f48dbd5a1752708371c10f4',
  },
  {
    id: '8',
    owner: '0x0000000000000000000000000000000000000000',
  },
  {
    id: '25',
    owner: '0x0843e80240f9304f3fe7059f25f3e1a66886a0eb',
  },
  {
    id: '19',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '56',
    owner: '0xa42098ea9ba9296a80a49c11e22a66c07a5e8212',
  },
  {
    id: '27',
    owner: '0x9feba45425c51b03890604d6ad51f4ee7c9d4866',
  },
  {
    id: '76',
    owner: '0xb335326c7f2cd2e4eb09ce3d1745c92f66497b7e',
  },
  {
    id: '88',
    owner: '0x01db485f57dc000e761b85641f78c9d212a2eeab',
  },
  {
    id: '8',
    owner: '0x0000000000000000000000000000000000000000',
  },
  {
    id: '13',
    owner: '0x367dc97068ab54ba1dfbfc0fad12fbcb7b3a0d09',
  },
  {
    id: '56',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '66',
    owner: '0x69c8c2923005d26eaeea9500d7602eff8c81c848',
  },
  {
    id: '67',
    owner: '0xeb44f8ac5e0988a51448c472143a7555743e01a5',
  },
  {
    id: '63',
    owner: '0x8d5e59e11838cff72af5fb0681d96a9136ad0604',
  },
  {
    id: '54',
    owner: '0x6f566a6672f615c2975f6c48224c46153e12ffcf',
  },
  {
    id: '78',
    owner: '0x3bc161e3a5604165f3165ed8aaaf0d490e559324',
  },
  {
    id: '64',
    owner: '0x9c7471c6d03cddab9ef6e1db6ed93fb8f9328072',
  },
  {
    id: '33',
    owner: '0x5f656037e30a003862cf878db24ab5f537177fd9',
  },
  {
    id: '8',
    owner: '0x42e5abe19ba467b0b32a4d042d3dfd4ba2e196af',
  },
  {
    id: '58',
    owner: '0x6d1db4a7e83dae0eee7e95d421722d46d2a7e94b',
  },
  {
    id: '62',
    owner: '0xf2f2503d93cc1afd87ae80d38d76cba64249acf5',
  },
  {
    id: '39',
    owner: '0x3d3af253b037d3b22c4c810673c5d14de16d1af3',
  },
  {
    id: '70',
    owner: '0x79fc35270a2e7082538bb01487053bc695bf5781',
  },
  {
    id: '2',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '8',
    owner: '0x0000000000000000000000000000000000000000',
  },
  {
    id: '8',
    owner: '0x0000000000000000000000000000000000000000',
  },
  {
    id: '85',
    owner: '0xd981a38d80de1c1528349b841833d3a9a745cb37',
  },
  {
    id: '60',
    owner: '0x5de26d392ea46ffc17131042e2584fe6ba46206f',
  },
  {
    id: '60',
    owner: '0x97a45305513133c62b2e3a1f2181dfb5ffdbb450',
  },
  {
    id: '45',
    owner: '0x159e5998669ec6628a6b670c2ef1ddbd93084698',
  },
  {
    id: '16',
    owner: '0x45133db3eadd8718f5c3a868ec2f7148e460dcfd',
  },
  {
    id: '8',
    owner: '0x0000000000000000000000000000000000000000',
  },
  {
    id: '79',
    owner: '0x33def458065819613e73f6ed3172db2673b7850e',
  },
  {
    id: '16',
    owner: '0x98172111480cc81621fd8b12bed2fb5095be11a5',
  },
  {
    id: '77',
    owner: '0x571493b6bb0b99dda41e2da1774b8c9b5bc302af',
  },
  {
    id: '7',
    owner: '0xc18d4c2fee42accfe7bfdce98bfacbabf76242e9',
  },
  {
    id: '79',
    owner: '0x74d50ea9f8cf5652e75102c3fa049c01534dd6c4',
  },
  {
    id: '67',
    owner: '0x7165a04c41c9e5e67d4850eab1dc6ede84d117f0',
  },
  {
    id: '3',
    owner: '0xd74e767c77d2e9f9e467e7914f2379da81b63a44',
  },
  {
    id: '73',
    owner: '0xff3bc8de74bb1d2f9066c9687f62bf810c66c5ea',
  },
  {
    id: '66',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '48',
    owner: '0x1033caf4e55579e8aa1cc59c3c302d7d924f9f89',
  },
  {
    id: '85',
    owner: '0xc4c65d75dd6579671db24990bad1f502d7c96c8c',
  },
  {
    id: '84',
    owner: '0x215cbb1b60e2cc1f1e8626cadca386b278aa0dee',
  },
  {
    id: '17',
    owner: '0x32e263cb9003f7fef329080bdcbc82f5cfd6c02f',
  },
  {
    id: '84',
    owner: '0x0dd38657d7c8024e7d62bde3d0423ca34769be50',
  },
  {
    id: '18',
    owner: '0x04294157cfba9ff0892f48f8345ea3539995f449',
  },
  {
    id: '3',
    owner: '0x2a462fb59a5b0885b60ad31c5fe473d5ba0d79fd',
  },
  {
    id: '91',
    owner: '0xc7cbf5e1a25d53b12f8ea53cd0b8ddd0c999e127',
  },
  {
    id: '76',
    owner: '0xe01a97fc4607a388a41626d5e039fdecbfc6acd9',
  },
  {
    id: '58',
    owner: '0xad43d2aea785e775bd38b5bbf4c5808572758373',
  },
  {
    id: '41',
    owner: '0x3a10fd1387555cd75db8142393fbaba98efe28d4',
  },
  {
    id: '67',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '73',
    owner: '0x3667e767a12f9057ef12dc58764400b34cd88320',
  },
  {
    id: '88',
    owner: '0x75b772f2bb4f47fbb31b14d6e034b81cb0a03730',
  },
  {
    id: '43',
    owner: '0x774a34da2ee2e2d242180819f1ee88783215f7b9',
  },
  {
    id: '39',
    owner: '0xa4b61e227361a9cd9e62ca10946c27748a382cab',
  },
  {
    id: '31',
    owner: '0x14abeea8db07c46b37a79bfa856d4c2da6d3e6df',
  },
  {
    id: '51',
    owner: '0x3852471d266d9e2222ca9fdd922bafc904dc49e5',
  },
  {
    id: '77',
    owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
  },
  {
    id: '67',
    owner: '0xa35f29893418c61ab675557ee5228e5225e78ba4',
  },
  {
    id: '18',
    owner: '0x22418183c90741bab6606c0e0d240ae6c3a148f0',
  },
];

export const anAllowlistLargeTransfers = (): Transfer[] => [
  {
    contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
    tokenID: '1',
    blockNumber: 14934338,
    timeStamp: 1654803541,
    logIndex: 101,
    from: '0x8bace3a49a375027868cdd34e84521eed1f1b01d',
    to: '0x02567d98dba79f6acf3798521fb517aa6f40a888',
    amount: 1,
    transactionHash:
      '0xbb9ace4c1d7865e3e51b28a1baf03418dd4438de70a361494ee04ecd75101126',
    transactionIndex: 75,
  },
  {
    contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
    tokenID: '3',
    blockNumber: 14934362,
    timeStamp: 1654803891,
    logIndex: 129,
    from: '0x8cd40fe6b8c6e663096668cb6fe47687593f7d99',
    to: '0xbbc37f68e9876d64b2c55016081528ae0a85d8b2',
    amount: 1,
    transactionHash:
      '0x1524bab13fe327f10edddc5b75f273e90ee1a2c1a3d7d94650575b29273ca896',
    transactionIndex: 59,
  },
  {
    contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
    tokenID: '3',
    blockNumber: 14934366,
    timeStamp: 1654803953,
    logIndex: 169,
    from: '0x8cd40fe6b8c6e663096668cb6fe47687593f7d99',
    to: '0xb2e7f7cf519020c8b6ff32a088fec95b03ccc715',
    amount: 1,
    transactionHash:
      '0xe4d4b79d7f092510f14e7cc1806ded90e5d9b8c6735b8e677eab0973a42ecae1',
    transactionIndex: 141,
  },
  {
    contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
    tokenID: '3',
    blockNumber: 14934369,
    timeStamp: 1654804113,
    logIndex: 318,
    from: '0x8cd40fe6b8c6e663096668cb6fe47687593f7d99',
    to: '0xfe3b3f0d64f354b69a5b40d02f714e69ca4b09bd',
    amount: 1,
    transactionHash:
      '0xbeb4fdffca415fd95bcf419e49cf52f3e579fcc2f7054c9c4fc8f6b5b1ef438d',
    transactionIndex: 421,
  },
  {
    contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
    tokenID: '2',
    blockNumber: 14934373,
    timeStamp: 1654804144,
    logIndex: 318,
    from: '0x8cd40fe6b8c6e663096668cb6fe47687593f7d99',
    to: '0xfe3b3f0d64f354b69a5b40d02f714e69ca4b09bd',
    amount: 1,
    transactionHash:
      '0x2bf1ededa0f43e5cbfff511fa58a41c55dac35285484d8e6e075966e646f2848',
    transactionIndex: 141,
  },
  {
    contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
    tokenID: '1',
    blockNumber: 14934376,
    timeStamp: 1654804235,
    logIndex: 51,
    from: '0x8cd40fe6b8c6e663096668cb6fe47687593f7d99',
    to: '0xfe3b3f0d64f354b69a5b40d02f714e69ca4b09bd',
    amount: 1,
    transactionHash:
      '0x0b8d89e416202c680775d61d9ddc916ca91b85aa3ef378303bef34ba4b49882f',
    transactionIndex: 47,
  },
  {
    contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
    tokenID: '1',
    blockNumber: 14934383,
    timeStamp: 1654804371,
    logIndex: 35,
    from: '0x8cd40fe6b8c6e663096668cb6fe47687593f7d99',
    to: '0x8ba68cfe71550efc8988d81d040473709b7f9218',
    amount: 9,
    transactionHash:
      '0x9361533b7ec128489297ba3e637337424775723f48795a45cf0b5830d3c43161',
    transactionIndex: 42,
  },
  {
    contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
    tokenID: '2',
    blockNumber: 14934394,
    timeStamp: 1654804482,
    logIndex: 168,
    from: '0x8cd40fe6b8c6e663096668cb6fe47687593f7d99',
    to: '0x8ba68cfe71550efc8988d81d040473709b7f9218',
    amount: 9,
    transactionHash:
      '0x7df3b52ddec8754b78458b76c18accb39ba9592020d0eb4d28210228f3d888e4',
    transactionIndex: 127,
  },
  {
    contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
    tokenID: '3',
    blockNumber: 14934399,
    timeStamp: 1654804541,
    logIndex: 271,
    from: '0x8cd40fe6b8c6e663096668cb6fe47687593f7d99',
    to: '0x8ba68cfe71550efc8988d81d040473709b7f9218',
    amount: 9,
    transactionHash:
      '0x1ba754da6b7c9bbb2dbaab82bb891e94be4fd5e34a9dc2a84ad7bf444446b9c1',
    transactionIndex: 122,
  },
  {
    contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
    tokenID: '3',
    blockNumber: 14934413,
    timeStamp: 1654804675,
    logIndex: 26,
    from: '0x8cd40fe6b8c6e663096668cb6fe47687593f7d99',
    to: '0xa743c8c57c425b84cb2ed18c6b9ae3ad21629cb5',
    amount: 9,
    transactionHash:
      '0xb4dd8f93b6e5879dd0252f69a6fa14c1e15d8aebd4ba8b870435f21d6e91997a',
    transactionIndex: 44,
  },
  {
    contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
    tokenID: '2',
    blockNumber: 14934431,
    timeStamp: 1654804878,
    logIndex: 401,
    from: '0x8cd40fe6b8c6e663096668cb6fe47687593f7d99',
    to: '0xa743c8c57c425b84cb2ed18c6b9ae3ad21629cb5',
    amount: 1,
    transactionHash:
      '0xf907c47a7aa8a7af1adffaf26e68812a89e2e64b21d3db3c63d151718dc0a071',
    transactionIndex: 433,
  },
  {
    contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
    tokenID: '2',
    blockNumber: 14935531,
    timeStamp: 1654821186,
    logIndex: 517,
    from: '0x6f12bbd7ede77b8dbbdc06dbb0a894412a863fa8',
    to: '0x32ffe815277ff53dd2a73557664e229899e6501e',
    amount: 1,
    transactionHash:
      '0x2604747d4a05a329978561b46a64dc222a3a8c5ddbaa9ab86832f07cc86d5518',
    transactionIndex: 242,
  },
  {
    contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
    tokenID: '1',
    blockNumber: 14935737,
    timeStamp: 1654824232,
    logIndex: 64,
    from: '0x6f12bbd7ede77b8dbbdc06dbb0a894412a863fa8',
    to: '0x32ffe815277ff53dd2a73557664e229899e6501e',
    amount: 1,
    transactionHash:
      '0xf6392d54a356b42afd823f2578029aec9408f935e31db56093a60047942c5188',
    transactionIndex: 35,
  },
  {
    contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
    tokenID: '3',
    blockNumber: 14935737,
    timeStamp: 1654824232,
    logIndex: 65,
    from: '0x6f12bbd7ede77b8dbbdc06dbb0a894412a863fa8',
    to: '0x32ffe815277ff53dd2a73557664e229899e6501e',
    amount: 1,
    transactionHash:
      '0xf6392d54a356b42afd823f2578029aec9408f935e31db56093a60047942c5188',
    transactionIndex: 35,
  },
  {
    contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
    tokenID: '1',
    blockNumber: 14935854,
    timeStamp: 1654825956,
    logIndex: 108,
    from: '0x6f12bbd7ede77b8dbbdc06dbb0a894412a863fa8',
    to: '0xbbc37f68e9876d64b2c55016081528ae0a85d8b2',
    amount: 1,
    transactionHash:
      '0x5212f50a089ad045f6b5ee08174a5029d3b3d15428ec55d09c59a57b2fc237ed',
    transactionIndex: 158,
  },
  {
    contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
    tokenID: '2',
    blockNumber: 14935854,
    timeStamp: 1654825956,
    logIndex: 109,
    from: '0x6f12bbd7ede77b8dbbdc06dbb0a894412a863fa8',
    to: '0xbbc37f68e9876d64b2c55016081528ae0a85d8b2',
    amount: 1,
    transactionHash:
      '0x5212f50a089ad045f6b5ee08174a5029d3b3d15428ec55d09c59a57b2fc237ed',
    transactionIndex: 158,
  },
  {
    contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
    tokenID: '2',
    blockNumber: 14936282,
    timeStamp: 1654832133,
    logIndex: 92,
    from: '0x6f12bbd7ede77b8dbbdc06dbb0a894412a863fa8',
    to: '0x4076eca4db9684fa1d9bfac231cb516889a33e5a',
    amount: 1,
    transactionHash:
      '0x99d0d7fb948a0fc51e6a96f7a19fcc541d82872c8a4dc9e756f3876dc8b0e2b1',
    transactionIndex: 73,
  },
  {
    contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
    tokenID: '3',
    blockNumber: 14936289,
    timeStamp: 1654832190,
    logIndex: 400,
    from: '0x6f12bbd7ede77b8dbbdc06dbb0a894412a863fa8',
    to: '0x4076eca4db9684fa1d9bfac231cb516889a33e5a',
    amount: 1,
    transactionHash:
      '0xcde8d31c80260f045bf346e565e72ecce86fdae20e78feb8a1466ddb44ccfa64',
    transactionIndex: 187,
  },
  {
    contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
    tokenID: '1',
    blockNumber: 14936885,
    timeStamp: 1654841240,
    logIndex: 382,
    from: '0x6f12bbd7ede77b8dbbdc06dbb0a894412a863fa8',
    to: '0xc839de0fed241607d50aa4107ae582443b906e4c',
    amount: 1,
    transactionHash:
      '0xcdcfb1e50ff4de267cba3d5a26d91896a10da6fe49d011f8a2c7e36877f15706',
    transactionIndex: 190,
  },
  {
    contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
    tokenID: '2',
    blockNumber: 14936885,
    timeStamp: 1654841240,
    logIndex: 383,
    from: '0x6f12bbd7ede77b8dbbdc06dbb0a894412a863fa8',
    to: '0xc839de0fed241607d50aa4107ae582443b906e4c',
    amount: 1,
    transactionHash:
      '0xcdcfb1e50ff4de267cba3d5a26d91896a10da6fe49d011f8a2c7e36877f15706',
    transactionIndex: 190,
  },
];

export const anMemeTokenPoolTokens = (): TokenOwnership[] => {
  return JSON.parse(
    fs.readFileSync('mock-data/meme-token-pool-17719473.json', 'utf8'),
  );
};

export const anMemeConsolidations = (): ConsolidationMapping[] => [
  {
    consolidation_display: '0x5b5...827 - sundayfunday.eth',
    wallets: [
      '0x5b513d7bb62f7f28bc3aba2d52fe6167a9b3a827',
      '0x69cb3b1de24e08f1cfc2994171b6c6930498f750',
    ],
    primary: '0x69cb3b1de24e08f1cfc2994171b6c6930498f750',
  },
  {
    consolidation_display: '0x087...184 - 0x997...920 - lotsofreasons.eth',
    wallets: [
      '0x087042b6e9716c2f04aaa45e48e7e87d63467184',
      '0x997a03f7011bfee9e058e15060b20eb2e4013920',
      '0xc02e6b0d0c1a5d8cd26beeba0fe8d76c5d2f19b9',
    ],
    primary: '0xc02e6b0d0c1a5d8cd26beeba0fe8d76c5d2f19b9',
  },
  {
    consolidation_display: 'ocean.pandelic.eth - pandelic.eth',
    wallets: [
      '0x5df5342342701b8ae5bce28f74ebb73b5fc13a54',
      '0xe9b5a2529ad21454cb5e4d172dcb4bc501789463',
    ],
    primary: '0x5df5342342701b8ae5bce28f74ebb73b5fc13a54',
  },
  {
    consolidation_display: '0x022...0EE - 0x819...D2D',
    wallets: [
      '0x0220e0b5a23bf2419e643de74649a01bf77960ee',
      '0x81974c1a09e53c5129c6e4f74e547fda0adf4d2d',
    ],
    primary: '0x81974c1a09e53c5129c6e4f74e547fda0adf4d2d',
  },
  {
    consolidation_display:
      'vault.blocknoob.eth - memes.blocknoob.eth - noobmuseum.eth',
    wallets: [
      '0x3df7131fbd4f6b27be8317c69e41817498e1bc0c',
      '0x52cc2c8db59411310e130b47d478472d9f7e4597',
      '0x564a8e13d7dd23d5525160d204165bdbcb69b4db',
    ],
    primary: '0x3df7131fbd4f6b27be8317c69e41817498e1bc0c',
  },
  {
    consolidation_display: 'memesmerch.eth - suffermore.eth',
    wallets: [
      '0x2f2242b447a54cb110b8a7991cf8a27054ee6921',
      '0xc07a67f50eb5bf18fd0c140c702a3032faa3681c',
    ],
    primary: '0x2f2242b447a54cb110b8a7991cf8a27054ee6921',
  },
  {
    consolidation_display: 'johndoe8891.q00t.eth - 0xf1f...9f1',
    wallets: [
      '0xa5dce742f3775059d9406342d2ecbb0ff8e3a3c2',
      '0xf1f476f144df01480297dca47efca565e8b0c9f1',
    ],
    primary: '0xf1f476f144df01480297dca47efca565e8b0c9f1',
  },
  {
    consolidation_display: 'intrepidphotos.eth - 0x590...D50',
    wallets: [
      '0x19e7a132bd4b42f580f546197f42e19c42cdfe6c',
      '0x590e2ccd3b14227f6252617fa1a58bf8b2333d50',
    ],
    primary: '0x19e7a132bd4b42f580f546197f42e19c42cdfe6c',
  },
  {
    consolidation_display: 'koja.eth - kojavault.eth',
    wallets: [
      '0x6ecae358e99dfdd1abe900bebe5f775431c12324',
      '0xbbc37f68e9876d64b2c55016081528ae0a85d8b2',
    ],
    primary: '0xbbc37f68e9876d64b2c55016081528ae0a85d8b2',
  },
  {
    consolidation_display: '0xspe...eth - speedy.eth',
    wallets: [
      '0x53f1b3d8990472d1adcd7b76348e5508db17cea0',
      '0xb31a4974499daad3255206daee7d1f3595fa259e',
    ],
    primary: '0xb31a4974499daad3255206daee7d1f3595fa259e',
  },
  {
    consolidation_display: '0x538...39e - rockshassa.eth',
    wallets: [
      '0x538f08b2448d69d85b312274b15faa468464939e',
      '0xef5ab90a44b68d4f5e3f6be6af4bedb12cd2c66e',
    ],
    primary: '0xef5ab90a44b68d4f5e3f6be6af4bedb12cd2c66e',
  },
  {
    consolidation_display: 'burritobox.eth - 0x56C...526',
    wallets: [
      '0x2ec4a2bcd4f33c7c9aafab7cfa865ec15508bf62',
      '0x56c1e427a420119faa74c66ff345544c41cc6526',
    ],
    primary: '0x2ec4a2bcd4f33c7c9aafab7cfa865ec15508bf62',
  },
  {
    consolidation_display: 'anotherblockinthechain.eth - 0xA35...85b',
    wallets: [
      '0x144c704bf25f1865e4b24fd6596ffed7d92470b0',
      '0xa35e0b9b931b07219d0fbeeb474f72dddf95c85b',
    ],
    primary: '0x144c704bf25f1865e4b24fd6596ffed7d92470b0',
  },
  {
    consolidation_display: 'rektguy72.eth - 0x757...C34',
    wallets: [
      '0x54913cc8ea17731d62589039dd0152f306473843',
      '0x7572bc33d10d75e45b510f5af35e98059af2bc34',
    ],
    primary: '0x54913cc8ea17731d62589039dd0152f306473843',
  },
  {
    consolidation_display: 'safe.exlawyervault.eth - exlawyervault.eth',
    wallets: [
      '0x19f1a4a606a4741df1a8b6a45c33a29f43c4553a',
      '0x7fdab8c244e0b775edeeb9ebb8356b59068c6873',
    ],
    primary: '0x19f1a4a606a4741df1a8b6a45c33a29f43c4553a',
  },
  {
    consolidation_display: 'moonfront.eth - 0xa8B...266',
    wallets: [
      '0x8774be790cb9e12d5edaf2eb8a3f6c89410a497d',
      '0xa8b98abedbfa97df97c8a6cbcb6173376a7a0266',
    ],
    primary: '0x8774be790cb9e12d5edaf2eb8a3f6c89410a497d',
  },
  {
    consolidation_display: 'jpghodl.eth - ibuymemes.eth',
    wallets: [
      '0x41254fe73d3b49f0fe3cc7743b4d40ef26bb338e',
      '0x571ae158b7f1ecc0ab4f17c9474a628882624919',
    ],
    primary: '0x41254fe73d3b49f0fe3cc7743b4d40ef26bb338e',
  },
  {
    consolidation_display: 'davidkibler.eth - 0x33f...90c',
    wallets: [
      '0x13eee41d67b8d99e11174161d72cf8ccd194458c',
      '0x33fe28a35d084ee2276715bbee126c1698a4390c',
    ],
    primary: '0x13eee41d67b8d99e11174161d72cf8ccd194458c',
  },
  {
    consolidation_display: '0x806...77B - hypnodoge.eth',
    wallets: [
      '0x806146c546ccdc8bd97291705bfcc74c7bca377b',
      '0xa978eadb605761725d11d3b3a4045cf5859e2d3c',
    ],
    primary: '0xa978eadb605761725d11d3b3a4045cf5859e2d3c',
  },
  {
    consolidation_display: '0x2F0...976 - 0x749...c9d - riverofethereum.eth',
    wallets: [
      '0x2f0df01fe8aa5a257c466fbfa2a5b73c14c0e976',
      '0x7499003740393bec0ece8745e099c2eb3f59dc9d',
      '0xb692704d590e224c67fa96830c4b2526fccaf3a3',
    ],
    primary: '0xb692704d590e224c67fa96830c4b2526fccaf3a3',
  },
  {
    consolidation_display: 'chagozzino.eth - 0x1b6...426',
    wallets: [
      '0x09c52c99e701304332b5998227f07d2648e8a72c',
      '0x1b6265a40839a331ace2d81bc82b6104703c0426',
    ],
    primary: '0x1b6265a40839a331ace2d81bc82b6104703c0426',
  },
  {
    consolidation_display: 'lemoncake.eth - lemoncakevault.eth',
    wallets: [
      '0x8729250ad053ee455b55d862fccf1030c2eb4e0c',
      '0xea0ed16746257eb2bc11de2fefd63cdeece23a98',
    ],
    primary: '0xea0ed16746257eb2bc11de2fefd63cdeece23a98',
  },
  {
    consolidation_display: '0x387...F42 - tylekki.eth - 0xf16...9BE',
    wallets: [
      '0x3876be5be4998adecbfbbad26604a762467e7f42',
      '0xc9a194bb6a3855b14dc4699cabe7b2881c3f6552',
      '0xf16d9b265ae9ff61ccfec4aeb9412f54cd3e89be',
    ],
    primary: '0x3876be5be4998adecbfbbad26604a762467e7f42',
  },
  {
    consolidation_display: 'frankiedtankie.eth - 0xF2c...1a1',
    wallets: [
      '0xe5798a530bb7105e148d38ac884f05c28ed8e804',
      '0xf2c5f1fd977dbd6de9d04bc4e62dff722d4bb1a1',
    ],
    primary: '0xf2c5f1fd977dbd6de9d04bc4e62dff722d4bb1a1',
  },
  {
    consolidation_display: '0x6fF...26D - scrappyt.eth - 0xaC7...c87',
    wallets: [
      '0x6ff9be7783a2795eb8ca78c4f66adfa8079ac26d',
      '0xeff0c128d7c5c39b06924d750ffa0296066a3220',
      '0xac772daaa5079e005eec3e53314d6d1e9149dc87',
    ],
    primary: '0xac772daaa5079e005eec3e53314d6d1e9149dc87',
  },
  {
    consolidation_display: 'hugofazvault.eth - hugofaz.eth - paulobiagioni.eth',
    wallets: [
      '0x47d539d4dd9b6f21ccabc5c96bbbf7071290938e',
      '0xc839de0fed241607d50aa4107ae582443b906e4c',
      '0xfbb494b311f8790072d6f2d5ed1ab8695ea8890e',
    ],
    primary: '0x47d539d4dd9b6f21ccabc5c96bbbf7071290938e',
  },
  {
    consolidation_display: 'rektguysaregood.eth - 0xce8...897',
    wallets: [
      '0x1920dbcfdf0fd291a71bec0b66e20ff8674b01a7',
      '0xce8ad80ce1a979381d209ac230d02adafb9fa897',
    ],
    primary: '0xce8ad80ce1a979381d209ac230d02adafb9fa897',
  },
  {
    consolidation_display: '0x88a...346 - 0x90c...f2c',
    wallets: [
      '0x88a6f6ac171e24be54d95dfa7ceff80ff185b346',
      '0x90ca3831732b1fcae423f3d77798e0ec4cedcf2c',
    ],
    primary: '0x88a6f6ac171e24be54d95dfa7ceff80ff185b346',
  },
  {
    consolidation_display: '65296529.eth - sirwinston.eth',
    wallets: [
      '0x22e8efe40ddb7f13b17b4c10f768967fc7a9f875',
      '0x6ef8fd2ffd39df9e73eea701e17db9cf51ffbb7e',
    ],
    primary: '0x22e8efe40ddb7f13b17b4c10f768967fc7a9f875',
  },
  {
    consolidation_display: 'dlanes.eth - davidlanes.eth',
    wallets: [
      '0x2801dc73a6dcefb364b959606e0c61234105fd5a',
      '0x6f8f3f5463f9e4fc802687acdccbf4ea358ef5fb',
    ],
    primary: '0x2801dc73a6dcefb364b959606e0c61234105fd5a',
  },
  {
    consolidation_display: '01439.eth - 0xDd0...ecD',
    wallets: [
      '0x9b742d1e98e5bb2f4d50f9fbbc047daf288ffc8b',
      '0xdd0fb2cc4b9f81a479e1d6ee9ca930c6cd058ecd',
    ],
    primary: '0x9b742d1e98e5bb2f4d50f9fbbc047daf288ffc8b',
  },
  {
    consolidation_display: 'geekiebunny.eth - 0xd1d...124',
    wallets: [
      '0x1e47bc8b6c585dfff2e166257767050666151f0a',
      '0xd1dd467f1630be10d67205d6c816429f8ee49124',
    ],
    primary: '0xd1dd467f1630be10d67205d6c816429f8ee49124',
  },
  {
    consolidation_display: '0x690...8Ca - 0x772...56C - 0xaFc...42b',
    wallets: [
      '0x690dabe81caf23ff4f855d27785d01da66ede8ca',
      '0x7729cfd6841ec449c20fa7d3970d2e0d035c856c',
      '0xafccebed934565586a749c66ff352b0fc871042b',
    ],
    primary: '0x7729cfd6841ec449c20fa7d3970d2e0d035c856c',
  },
  {
    consolidation_display: 'smokiecold.eth - smokielogic.eth - smokiehot.eth',
    wallets: [
      '0x8854b06ba346a703a3c043e2e7b8822db3ca6b3a',
      '0xb0767b217fb1530b064bb1f835c57c047c08ae72',
      '0xd7473ef09ae9c072f2ece3fe7ce64e670eeff283',
    ],
    primary: '0x8854b06ba346a703a3c043e2e7b8822db3ca6b3a',
  },
  {
    consolidation_display: '0x5Df...2F9 - hamyao.eth',
    wallets: [
      '0x5dfc1f36bee4938b3dc8ebdb4c34f64c935fc2f9',
      '0xe25b24cebed3055236e369570a437a99e1d32602',
    ],
    primary: '0xe25b24cebed3055236e369570a437a99e1d32602',
  },
  {
    consolidation_display: 'astrodaddy.eth - 0x8E0...00D - paulwilson.eth',
    wallets: [
      '0x69fde561275b85dbcd5081d1121bcae64fb83858',
      '0x8e0f943577527f5e21be9ac1ba99c027360a300d',
      '0xb05b7ea3714a95857e45629def2b9c3577690208',
    ],
    primary: '0xb05b7ea3714a95857e45629def2b9c3577690208',
  },
  {
    consolidation_display: '0xABf...5EE - cheesebiz.eth',
    wallets: [
      '0xabfb3a0a0e4c1bc2ad036f4531217e2becd215ee',
      '0xddfd836f7c9e42055b1f6ceb005fee4c7882f161',
    ],
    primary: '0xddfd836f7c9e42055b1f6ceb005fee4c7882f161',
  },
  {
    consolidation_display:
      'justanotherblockinthechain.eth - mint.justanotherblockinthechain.eth - vault.justanotherblockinthechain.eth',
    wallets: [
      '0x32ffe815277ff53dd2a73557664e229899e6501e',
      '0x98dc45a0a69a60e63f7a042507ab38e4d492cd69',
      '0xf9eeea18a0ae0b90d0840d2b8501b4687822c2f1',
    ],
    primary: '0x32ffe815277ff53dd2a73557664e229899e6501e',
  },
  {
    consolidation_display: 'thesurgeon.eth - 0xfD8...57b',
    wallets: [
      '0x8081a75141dbc89f70d31eece08ff12cfe105e43',
      '0xfd849d8cf365fe98bc60025ff7fab45cef0f557b',
    ],
    primary: '0xfd849d8cf365fe98bc60025ff7fab45cef0f557b',
  },
  {
    consolidation_display: '0x422...6Fe - regulardad.eth',
    wallets: [
      '0x4220132c9df1ab7bd2913f0fd03297c90e7cc6fe',
      '0x7b5af6790381f932abae790e8b0d0ff50e287f8e',
    ],
    primary: '0x4220132c9df1ab7bd2913f0fd03297c90e7cc6fe',
  },
  {
    consolidation_display: '0x727...b80 - 0x933...a60',
    wallets: [
      '0x72703b554a7089f93ff1fc6cc6c0e623900a7b80',
      '0x933522fbb4c067652730bbc8e25d7820f4d72a60',
    ],
    primary: '0x933522fbb4c067652730bbc8e25d7820f4d72a60',
  },
  {
    consolidation_display: 'azogz.eth - vault.azogz.eth',
    wallets: [
      '0x2d0ddb67b7d551afa7c8fa4d31f86da9cc947450',
      '0x58059014c5952c04370bcb88a2e0503e9eafb209',
    ],
    primary: '0x58059014c5952c04370bcb88a2e0503e9eafb209',
  },
  {
    consolidation_display: 'whale.boingyboingy.eth - vibes.teamsteggy.eth',
    wallets: [
      '0x42fb73502931b58c0e32df256eaeeb6bce5720bf',
      '0xa90aa01ec98f390cb86cd1846f7c0fd342a07955',
    ],
    primary: '0xa90aa01ec98f390cb86cd1846f7c0fd342a07955',
  },
  {
    consolidation_display: 'sunrunner.eth - sunrunnervault.eth',
    wallets: [
      '0x6c0e639dcfc73e810bf66c90a9005d4ebd8a7e5d',
      '0xcb85cf75d53fceb37af86b475903817db2b99d17',
    ],
    primary: '0xcb85cf75d53fceb37af86b475903817db2b99d17',
  },
  {
    consolidation_display: 'sindhuri.eth - rrfa.eth',
    wallets: [
      '0x74d50ea9f8cf5652e75102c3fa049c01534dd6c4',
      '0xca3e7ef7596fb4258133c888dc205b4047c09307',
    ],
    primary: '0x74d50ea9f8cf5652e75102c3fa049c01534dd6c4',
  },
  {
    consolidation_display:
      'memes.chrisroc.eth - trading.chrisroc.eth - chrisroc.eth',
    wallets: [
      '0x02b294ed96e1175b8c71071a303e8a7d2396b017',
      '0xd67b2698817bee84ab2c702a091d1472063ebd58',
      '0xe840fe7f29e61e2dbc6a7c1947e51fad47f20b5d',
    ],
    primary: '0x02b294ed96e1175b8c71071a303e8a7d2396b017',
  },
  {
    consolidation_display: '0x04D...16c - 0x16b...ff0 - 0x9CE...fbc',
    wallets: [
      '0x04df8d02f912d34fef12a1b0488ee56fd6f7416c',
      '0x16b92abc4e0e0d074e927c4bb46a5c3ee54ffff0',
      '0x9ce3aebe5e73cdd5357aa4561fe1b01d78f89fbc',
    ],
    primary: '0x04df8d02f912d34fef12a1b0488ee56fd6f7416c',
  },
  {
    consolidation_display: '0x8d4...FF8 - vault.amtwo.eth',
    wallets: [
      '0x8d49f11b33f0662074cd4ebacb69c55041631ff8',
      '0xc2e8ed8cc0be70f91fc9aa903d5f4538719d7dec',
    ],
    primary: '0xc2e8ed8cc0be70f91fc9aa903d5f4538719d7dec',
  },
  {
    consolidation_display: '0x185...c33 - deconstruct3d.eth',
    wallets: [
      '0x185952b3bb31da0ae18354bbb90ae40adc840c33',
      '0x9b96980c1c018cb617f6653f6892e19ecf4f81e1',
    ],
    primary: '0x185952b3bb31da0ae18354bbb90ae40adc840c33',
  },
  {
    consolidation_display: 'ezmonet.eth - momonet.eth',
    wallets: [
      '0x0064f02799ea7748a9b51b5e78bcd274d9e7d0a1',
      '0xc4e8b752c53df925013e03fe4d2273a8ccb6c545',
    ],
    primary: '0x0064f02799ea7748a9b51b5e78bcd274d9e7d0a1',
  },
  {
    consolidation_display: '0x0Ac...959 - cindemirfatih.eth',
    wallets: [
      '0x0acabdaceab63c08bc5aea63d7e07da7c2e42959',
      '0xd62af0477b1991197da39a38cbf9c7199f4737f3',
    ],
    primary: '0x0acabdaceab63c08bc5aea63d7e07da7c2e42959',
  },
  {
    consolidation_display: '0x843...334 - 0x97a...450',
    wallets: [
      '0x843708d85621273f3bbc643b348da3a60d5b0334',
      '0x97a45305513133c62b2e3a1f2181dfb5ffdbb450',
    ],
    primary: '0x843708d85621273f3bbc643b348da3a60d5b0334',
  },
  {
    consolidation_display: 'art.moon1185.eth - windfucker.eth',
    wallets: [
      '0xb9ad9d091c6841e640dba4cab02baefaf1134cfd',
      '0xc9870f60415c62d998dfe3ded15aafc015f45acc',
    ],
    primary: '0xb9ad9d091c6841e640dba4cab02baefaf1134cfd',
  },
  {
    consolidation_display: '0x077...00A - flexis.eth',
    wallets: [
      '0x077ce6c4f0be37f5a3b2044f685dad07501b600a',
      '0x3bc161e3a5604165f3165ed8aaaf0d490e559324',
    ],
    primary: '0x3bc161e3a5604165f3165ed8aaaf0d490e559324',
  },
  {
    consolidation_display: '0x7AE...460 - 0xc8D...ed5',
    wallets: [
      '0x7ae3b0627dac32d3ee16c204ef791e37067b8460',
      '0xc8d3e10a72d2d846ebd134dfbd23e14cc26a4ed5',
    ],
    primary: '0x7ae3b0627dac32d3ee16c204ef791e37067b8460',
  },
  {
    consolidation_display: '0xd8F...747 - 0xf44...bbD',
    wallets: [
      '0xd8f3d5e9a199a35429870fca8befd159bfe48747',
      '0xf44b63f62c7b6c59a883fdc67bdcd692995b8bbd',
    ],
    primary: '0xd8f3d5e9a199a35429870fca8befd159bfe48747',
  },
  {
    consolidation_display: '0x81A...2Bb - jyppy.eth',
    wallets: [
      '0x81a9f35c011955b7fa74295b8266011ce73242bb',
      '0xc45920062985116eaac6589058ed337066d6f2e6',
    ],
    primary: '0xc45920062985116eaac6589058ed337066d6f2e6',
  },
  {
    consolidation_display: '0x0Dd...e50 - memesmovemarkets.eth',
    wallets: [
      '0x0dd38657d7c8024e7d62bde3d0423ca34769be50',
      '0xe83366a625f1e7374bd76e631010207edbc6d194',
    ],
    primary: '0x0dd38657d7c8024e7d62bde3d0423ca34769be50',
  },
  {
    consolidation_display: 'teexels.eth - 0x426...b61',
    wallets: [
      '0x0187c9a182736ba18b44ee8134ee438374cf87dc',
      '0x4269aadfd043b58cba893bfe6029c9895c25cb61',
    ],
    primary: '0x4269aadfd043b58cba893bfe6029c9895c25cb61',
  },
  {
    consolidation_display: 'sryboutya.eth - 0xe2c...911',
    wallets: [
      '0xaa1d3f5d45333e40467e989d472effac4da00da9',
      '0xe2c45347b759687c3bec81ec7d08ffb7192c6911',
    ],
    primary: '0xaa1d3f5d45333e40467e989d472effac4da00da9',
  },
  {
    consolidation_display: 'sub.teamsteggy.eth - seize.teamsteggy.eth',
    wallets: [
      '0x177a8340bddc2041cc362aabf543dee4e394e3e3',
      '0x9e1f7b007511036b5cbe5df6d39550bdd2e8bc99',
    ],
    primary: '0x9e1f7b007511036b5cbe5df6d39550bdd2e8bc99',
  },
  {
    consolidation_display: '0x5fb...9D3 - boostgrindvault.eth',
    wallets: [
      '0x5fbe799de139710a2eb644f0410fdffbd5f189d3',
      '0x8bc3757a675be4c2e459813769992ec2c60baaaf',
    ],
    primary: '0x8bc3757a675be4c2e459813769992ec2c60baaaf',
  },
  {
    consolidation_display: 'thesert-mint.eth - thesert.eth',
    wallets: [
      '0xb8eaee4a13dbd506bd8925cf7b9c950e7f5f8539',
      '0xfe7ace0f186a54c0be46f992dd3072e0053a1010',
    ],
    primary: '0xfe7ace0f186a54c0be46f992dd3072e0053a1010',
  },
  {
    consolidation_display: '0x33e...5Ef - square-pixel.eth',
    wallets: [
      '0x33e5861c89e9c457204e4c41a36ae4931baca5ef',
      '0xa41341bab6588948da8503d1dfb0a0ab0ea269cb',
    ],
    primary: '0xa41341bab6588948da8503d1dfb0a0ab0ea269cb',
  },
  {
    consolidation_display: '0x28E...FAD - 0x666...807',
    wallets: [
      '0x28e6c1352950238be088ef2a741f3c8b91b9ffad',
      '0x6666083ba28027fd6db24a3c1bf288c0f3f95807',
    ],
    primary: '0x28e6c1352950238be088ef2a741f3c8b91b9ffad',
  },
  {
    consolidation_display: 'pinkos.eth - 0xb68...D69',
    wallets: [
      '0x7f1796071eb91aebda10a03115fa3cd95efdb25f',
      '0xb68e75f5424e4dd8b97fb42c4965d08718349d69',
    ],
    primary: '0xb68e75f5424e4dd8b97fb42c4965d08718349d69',
  },
  {
    consolidation_display: '0x8f5...bC9 - 6529wagmi.eth',
    wallets: [
      '0x8f51b0f73ba6b8c0ea919a7cf3bdfa298a366bc9',
      '0x9f4fe19fed4a008a270840fe95660f25df36c734',
    ],
    primary: '0x9f4fe19fed4a008a270840fe95660f25df36c734',
  },
  {
    consolidation_display: 'notrealfranc.eth - 0xE04...c95',
    wallets: [
      '0x4f492b2a3ed9bf0c65d508dab4f7c5f5c04ca6c3',
      '0xe04da86529bc2078c8ae3474b2d67bedf1139c95',
    ],
    primary: '0x4f492b2a3ed9bf0c65d508dab4f7c5f5c04ca6c3',
  },
  {
    consolidation_display:
      'flowfeed.eth - sheltronica.eth - vault.sheltronica.eth',
    wallets: [
      '0x263a71ca9f5b938c6b5e6398e61a8c60e492bd61',
      '0x85f0a0bb2ef4192bcd79a20c47b26096c99a9907',
      '0x9e23d2db65a1b8b6f31fb57c47148907545b3ff5',
    ],
    primary: '0x9e23d2db65a1b8b6f31fb57c47148907545b3ff5',
  },
  {
    consolidation_display: 'soniateles.eth - 0xb87...eB2',
    wallets: [
      '0x8cebf0887979d86ee2c878663af7b71a35d0ba24',
      '0xb8700157128ff544c46cf35dec5a19120baa8eb2',
    ],
    primary: '0xb8700157128ff544c46cf35dec5a19120baa8eb2',
  },
  {
    consolidation_display: 'dipanjanp.eth - dipanjanvault.eth',
    wallets: [
      '0x6191c173e855202083455859e670ac16a669788d',
      '0xa6d4758ef49d2ae8e65e1a02216cb9744aee6b23',
    ],
    primary: '0xa6d4758ef49d2ae8e65e1a02216cb9744aee6b23',
  },
  {
    consolidation_display: 'vault.ac1d.eth - lolawhale.eth - ac1d.eth',
    wallets: [
      '0x70c8db61d09271f4c90950ba8c6cbaef918f12f2',
      '0x7581a5a10ab7ab75d4cec577e4669893818fbbb6',
      '0xeb0c4e7244100075c227cb60ea8107cae39c3211',
    ],
    primary: '0x70c8db61d09271f4c90950ba8c6cbaef918f12f2',
  },
  {
    consolidation_display: 'memesarehot.eth - dgmdlovesmemes.eth',
    wallets: [
      '0x2d13c884c4c418664abb1b4a7f491dd89247e42e',
      '0xd1f6e5592361257aef68b96df42aef064080c5cc',
    ],
    primary: '0xd1f6e5592361257aef68b96df42aef064080c5cc',
  },
  {
    consolidation_display: '0x31b...eth - memes.0x31bed.eth - memer01.eth',
    wallets: [
      '0x31bedb3962ab3a1d2a2e070853aa5c4acdb734f4',
      '0x3c2286342e143d511ae6b7caefd548bf38c8c1ab',
      '0xd72c8dd33954e8aa53d5c108906b751ce4b2382b',
    ],
    primary: '0x3c2286342e143d511ae6b7caefd548bf38c8c1ab',
  },
  {
    consolidation_display: 'travelpoems.eth - 0x149...ddb',
    wallets: [
      '0x01f4ab9ccf822e74cd514b1fc16068e749d37b1c',
      '0x149157a39b5966410e018c97107c641951e72ddb',
    ],
    primary: '0x01f4ab9ccf822e74cd514b1fc16068e749d37b1c',
  },
  {
    consolidation_display: 'gmtodeath.eth - youcanttouchthis.eth - bluegm.eth',
    wallets: [
      '0x410ff1f298d37046a1f7e0c07fce1d8e9f91d15d',
      '0x83ee0325fe8dd7d2734c9191bd5f7c532951dee8',
      '0x8856dcf8d1f9be083a25251b0149ad74f971b806',
    ],
    primary: '0x8856dcf8d1f9be083a25251b0149ad74f971b806',
  },
  {
    consolidation_display: '0x1DC...fb8 - 0xf56...d0e',
    wallets: [
      '0x1dcfdcb24456a7dba5342479cff0f9ff30145fb8',
      '0xf5671d951c0aa6e4bd69a854fc2d15fe707ddd0e',
    ],
    primary: '0x1dcfdcb24456a7dba5342479cff0f9ff30145fb8',
  },
  {
    consolidation_display: 'klepikovadaria.eth - 0x9AD...a3D',
    wallets: [
      '0x3e6b87ff2168d15794a865d09a6716415e7dbecf',
      '0x9ad53944b52e271f1114028b918202cfaaec0a3d',
    ],
    primary: '0x9ad53944b52e271f1114028b918202cfaaec0a3d',
  },
  {
    consolidation_display: '0x037...3FD - breadyheady.eth',
    wallets: [
      '0x037a3079e857e383454fefbea892fde12a2e83fd',
      '0xa4b61e227361a9cd9e62ca10946c27748a382cab',
    ],
    primary: '0xa4b61e227361a9cd9e62ca10946c27748a382cab',
  },
  {
    consolidation_display: '0x346...358 - memes4laugh.eth',
    wallets: [
      '0x346aaf2e75cfccb82cff0fcb8d2cdc21d5656358',
      '0x865b85a6b14efdfb42377da0469ea0e19ba203ad',
    ],
    primary: '0x346aaf2e75cfccb82cff0fcb8d2cdc21d5656358',
  },
  {
    consolidation_display: 'memesarethefuture.eth - 0x411...862',
    wallets: [
      '0x26170ef869643debab1491cd2248410dd5534bc5',
      '0x411dd34f17d5b6398f155f768ed27c32ad194862',
    ],
    primary: '0x411dd34f17d5b6398f155f768ed27c32ad194862',
  },
  {
    consolidation_display: 'xdubai.eth - 0xEee...973',
    wallets: [
      '0x176ab08b25404b8b09026731c044daeac68164ba',
      '0xeeeb5dd03eaf4ab6b72949191d8ffcfe27f7d973',
    ],
    primary: '0xeeeb5dd03eaf4ab6b72949191d8ffcfe27f7d973',
  },
  {
    consolidation_display: '0x9EA...310 - nftsvault.eth',
    wallets: [
      '0x9ea44a1dbe393a6d38d5f94ab73207279ac45310',
      '0xb00b18b3bf6ecc43e6235ee69424d4a220437a4d',
    ],
    primary: '0xb00b18b3bf6ecc43e6235ee69424d4a220437a4d',
  },
  {
    consolidation_display: 'apcvault.eth - andi-p.eth',
    wallets: [
      '0xf161ff39e19f605b2115afaeccbb3a112bbe4004',
      '0xd4012980ef607f79b839095781a31cb2595461cf',
    ],
    primary: '0xf161ff39e19f605b2115afaeccbb3a112bbe4004',
  },
  {
    consolidation_display: '0x6c4...ff2 - houndhouse.eth',
    wallets: [
      '0x6c447537ed9c6928492e0f2882278ac530892ff2',
      '0x6ce52498047b8279ccc7c25b41c95cd482525e54',
    ],
    primary: '0x6ce52498047b8279ccc7c25b41c95cd482525e54',
  },
  {
    consolidation_display: 'yossvault.eth - grimacefrommcdonalds.eth',
    wallets: [
      '0xb3b16685ca2d2a764882e2bb2a8d3d769cd74145',
      '0xde18fab0baab095bc41ca5fb2b9421e4f4fca78a',
    ],
    primary: '0xb3b16685ca2d2a764882e2bb2a8d3d769cd74145',
  },
  {
    consolidation_display: 'dolle.eth - memes.saintlouis.eth - saintlouis.eth',
    wallets: [
      '0x7465ce02a9b3eac18b580ebfe87c4ac9fbb2e628',
      '0x966133652465b15365a91a8b1f6c95276838300d',
      '0xca6b710cbef9ffe90d0ab865b76d6e6bba4db5f9',
    ],
    primary: '0x966133652465b15365a91a8b1f6c95276838300d',
  },
  {
    consolidation_display: 'realz.eth - 0x658...4e1 - 0xf62...134',
    wallets: [
      '0x6286ce57c5a2ec8eafc09a1d74034770fd92d5ef',
      '0x65876304b2e6da8248094808cf2a2f6022c534e1',
      '0xf624e9324f9b330cc0289775d7b91e945e881134',
    ],
    primary: '0xf624e9324f9b330cc0289775d7b91e945e881134',
  },
  {
    consolidation_display: 'onlyfarmers.eth - wagmi.teamsteggy.eth',
    wallets: [
      '0x70da927bc27dff979cff22493e1ba26f3a61d941',
      '0xa7c342af335ea7e0747452ae2e3c1901498a9a76',
    ],
    primary: '0xa7c342af335ea7e0747452ae2e3c1901498a9a76',
  },
  {
    consolidation_display: 'penzija.eth - 0xfCf...61e',
    wallets: [
      '0xd74e767c77d2e9f9e467e7914f2379da81b63a44',
      '0xfcf2c8a6b01af46a4bfcadbabe49b98294fce61e',
    ],
    primary: '0xd74e767c77d2e9f9e467e7914f2379da81b63a44',
  },
  {
    consolidation_display: '0x103...F89 - g1nseng.eth',
    wallets: [
      '0x1033caf4e55579e8aa1cc59c3c302d7d924f9f89',
      '0x3f4373afdde3d7de3ac433acc7de685338c3980e',
    ],
    primary: '0x1033caf4e55579e8aa1cc59c3c302d7d924f9f89',
  },
  {
    consolidation_display: '0x177...1f8 - jhsbdn.eth - 0x3d3...Af3',
    wallets: [
      '0x1773fad6563cd5b6a903e8bf81e9137127f941f8',
      '0x1b8532be318e881a6d073b6b24aa584d76d017fe',
      '0x3d3af253b037d3b22c4c810673c5d14de16d1af3',
    ],
    primary: '0x3d3af253b037d3b22c4c810673c5d14de16d1af3',
  },
  {
    consolidation_display: '0x750...22e - 0xb39...0a6',
    wallets: [
      '0x75005a05bc163b85991b9c9facbcf3155372422e',
      '0xb39556832e6fdf7a0703d5449f191d85cd9700a6',
    ],
    primary: '0x75005a05bc163b85991b9c9facbcf3155372422e',
  },
  {
    consolidation_display: '0x072...4dB - mingt.eth',
    wallets: [
      '0x07219c7136f49847a6be9fd1ce27f8afd6a074db',
      '0x9e32560cbc32e1ea4c737d65f043a0d8f8310422',
    ],
    primary: '0x9e32560cbc32e1ea4c737d65f043a0d8f8310422',
  },
  {
    consolidation_display: 'minter.husker.eth - husker.eth',
    wallets: [
      '0xb587787a8c8cde1250eda1fc2e664666720c661f',
      '0xbfe384d79969bcb583b8a0e5fedc314aee480e7e',
    ],
    primary: '0xbfe384d79969bcb583b8a0e5fedc314aee480e7e',
  },
  {
    consolidation_display: '0x4Dc...460 - a7111a.eth',
    wallets: [
      '0x4dc208f337fd51bb6a35925cb4a6b0ed168d3460',
      '0x81b55fbe66c5ffbb8468328e924af96a84438f14',
    ],
    primary: '0x81b55fbe66c5ffbb8468328e924af96a84438f14',
  },
  {
    consolidation_display: '0x4A1...55a - 0xd7D...F09',
    wallets: [
      '0x4a162ea613912dbcc7034867f67f667cb5e8855a',
      '0xd7d941ff2890bda98f40a5dda0593d239a603f09',
    ],
    primary: '0xd7d941ff2890bda98f40a5dda0593d239a603f09',
  },
  {
    consolidation_display: '0xC52...f08 - tokoloshe.eth',
    wallets: [
      '0xc522289168311a765cf17c067f0118578c99cf08',
      '0xd87ca052936bcc2b6283b87d2f0aa95cf0080584',
    ],
    primary: '0xc522289168311a765cf17c067f0118578c99cf08',
  },
  {
    consolidation_display: '0xD33...ED9 - 0xF62...5D0',
    wallets: [
      '0xd33744da3013927fad387d24f57cfa241735ded9',
      '0xf620422e1e2cbf123386ea664f536d1016e5a5d0',
    ],
    primary: '0xf620422e1e2cbf123386ea664f536d1016e5a5d0',
  },
  {
    consolidation_display: '0x94D...ee1 - mrpartypeoples.eth',
    wallets: [
      '0x94d25c0f01977452caf63d0ea939702cb1608ee1',
      '0xc39fe26e4e75074114bbd4e50972cfc1a6b3c4a3',
    ],
    primary: '0x94d25c0f01977452caf63d0ea939702cb1608ee1',
  },
  {
    consolidation_display: 'affe.eth - ayox.eth - vilay.eth',
    wallets: [
      '0x4820e3cb7d2eb357f28e6c6592968b90e54e660a',
      '0x5c99e810eb0d87f17b0e467de52b3b2b4b2a2dca',
      '0xcda2efb1de50aa4476b4a20c36bfffdf97b5ae80',
    ],
    primary: '0xcda2efb1de50aa4476b4a20c36bfffdf97b5ae80',
  },
  {
    consolidation_display: 'jahanfar.eth - 0xa40...0c0',
    wallets: [
      '0xda4c79ccfdcbfa9128b1e328f77e5f9c6ad72a44',
      '0xa40117a1394fc5cfb3576fe12632381b0b79c0c0',
    ],
    primary: '0xa40117a1394fc5cfb3576fe12632381b0b79c0c0',
  },
  {
    consolidation_display: '0x3f1...9c0 - 0x541...0d0',
    wallets: [
      '0x3f180bbcb18819dfdfcffa2ab4fa2deb681f69c0',
      '0x541db1ed2628f2f4897417d06181af6a179e90d0',
    ],
    primary: '0x541db1ed2628f2f4897417d06181af6a179e90d0',
  },
  {
    consolidation_display: '0x0fc...cfD - barnold.eth',
    wallets: [
      '0x0fca84455846d271216e5bdf0e8a984f535accfd',
      '0xafef3bb7fc3cd8ae083672b65f79e6cefd4ac619',
    ],
    primary: '0xafef3bb7fc3cd8ae083672b65f79e6cefd4ac619',
  },
  {
    consolidation_display: 'ermangulbag.eth - 0x18e...1d2',
    wallets: [
      '0x026e3a7cd4ecf91a8ad116a6124880d876af3c99',
      '0x18eb4aece6cff56f3bd4ccd844491d55b6ab21d2',
    ],
    primary: '0x18eb4aece6cff56f3bd4ccd844491d55b6ab21d2',
  },
  {
    consolidation_display: '0x26F...159 - 0x6B4...8fc',
    wallets: [
      '0x26f8fdd4f8cbf0ca1087e4f0b9e44930f5f2f159',
      '0x6b4b2cbb69b9ca07328a40e7ffff3870f627c8fc',
    ],
    primary: '0x6b4b2cbb69b9ca07328a40e7ffff3870f627c8fc',
  },
  {
    consolidation_display: 'vault.tuork.eth - tuork.eth',
    wallets: [
      '0x0936d312ba234451fa7a90f68c7ede0f4fa962c6',
      '0xe22059d454c705f70ffe2a5706844a3a27a2bec8',
    ],
    primary: '0xe22059d454c705f70ffe2a5706844a3a27a2bec8',
  },
  {
    consolidation_display: '6529jpegs.eth - 0x596...8cA',
    wallets: [
      '0x2c52248bf9f5715570ad007ef4d9c660ed8ae2e7',
      '0x596f888434b82766c8575f8c8e18c64902e548ca',
    ],
    primary: '0x2c52248bf9f5715570ad007ef4d9c660ed8ae2e7',
  },
  {
    consolidation_display: '0x638...efB - architsharma.eth',
    wallets: [
      '0x638fba3bbbe8828394d2b13f92fba75bf32c8efb',
      '0xa6b880ad5e007ce8bc681ca974d79ce58fa0424a',
    ],
    primary: '0x638fba3bbbe8828394d2b13f92fba75bf32c8efb',
  },
  {
    consolidation_display: 'antou.eth - 0x83c...196',
    wallets: [
      '0x832e47e53df5c771be86a3e03b49cde53088b156',
      '0x83ca0f19abd240c3b04bd55a2046c308d042e196',
    ],
    primary: '0x83ca0f19abd240c3b04bd55a2046c308d042e196',
  },
  {
    consolidation_display: '0x4F1...377 - flowstate01.eth',
    wallets: [
      '0x4f13eabaf32ef4ad3837ae88fcfc6c69edba0377',
      '0x7c59a1ddd7b8e5ba683941ea67b20b93864ad8f9',
    ],
    primary: '0x4f13eabaf32ef4ad3837ae88fcfc6c69edba0377',
  },
  {
    consolidation_display: '0x4C2...36a - darwinite.eth',
    wallets: [
      '0x4c26c796abcf3513807efa54d54c34405b84a36a',
      '0xd532962fd7976880fdff92db9cbe48a7369b1fc0',
    ],
    primary: '0x4c26c796abcf3513807efa54d54c34405b84a36a',
  },
  {
    consolidation_display: '0x76B...A2a - bigby.eth',
    wallets: [
      '0x76baf8a8bd1a1c02f9edd0450d4c8f58fd4c3a2a',
      '0xeee4ebaa421ed7aa32b925bbe2fe7506e33e7cd4',
    ],
    primary: '0xeee4ebaa421ed7aa32b925bbe2fe7506e33e7cd4',
  },
  {
    consolidation_display: '0x301...0Fa - jasonophoto.eth',
    wallets: [
      '0x301e2d2a98c5873ac27fd9eae85f0153959100fa',
      '0xb6c4ce4eae85066f8fc45093d12444c8b89a6aa9',
    ],
    primary: '0xb6c4ce4eae85066f8fc45093d12444c8b89a6aa9',
  },
  {
    consolidation_display: 'articulate.eth - secureid.eth',
    wallets: [
      '0x4076eca4db9684fa1d9bfac231cb516889a33e5a',
      '0x91e8be20d0dfb2293b97317e906223c1fa833a48',
    ],
    primary: '0x91e8be20d0dfb2293b97317e906223c1fa833a48',
  },
  {
    consolidation_display: '0x20a...281 - 0xDE5...89E',
    wallets: [
      '0x20aa168e6c793646f60737399c8466dd643d4281',
      '0xde5914bd516be06a67d8d09e75fad3780d18289e',
    ],
    primary: '0x20aa168e6c793646f60737399c8466dd643d4281',
  },
  {
    consolidation_display: '0x31f...157 - 0xa75...b6f',
    wallets: [
      '0x31f7d87f5f6a90f8a9ff6328e2c607b637f9c157',
      '0xa75dc095ed4ad69b088c3eb8ba2f93f1aa942b6f',
    ],
    primary: '0xa75dc095ed4ad69b088c3eb8ba2f93f1aa942b6f',
  },
  {
    consolidation_display: 'chanchito.eth - 0xeBB...5a6',
    wallets: [
      '0x9dbc84d7199c97f9adcc9b57439d69c5ca9ad103',
      '0xebbafe3ffc5ead91618e137fdfd845dd7bfd65a6',
    ],
    primary: '0x9dbc84d7199c97f9adcc9b57439d69c5ca9ad103',
  },
  {
    consolidation_display: '0xDbB...cE2 - 0xfa6...65c',
    wallets: [
      '0xdbbdd40a5c74f3853ecd10f828da2633cdbb6ce2',
      '0xfa6bc968cf39a88aa67725463698b6a84bca865c',
    ],
    primary: '0xfa6bc968cf39a88aa67725463698b6a84bca865c',
  },
  {
    consolidation_display: 'om.spritey.eth - spritey.eth',
    wallets: [
      '0x482a13a18634574bdf495c03855d95c543804de6',
      '0xe66d15146b16cee22f0231dfdc830e7e56c2d4c6',
    ],
    primary: '0x482a13a18634574bdf495c03855d95c543804de6',
  },
  {
    consolidation_display: '0x52d...0F0 - pornsoup.eth',
    wallets: [
      '0x52d232170f00607b555d97b943094b4ba866f0f0',
      '0x5b23c893ab99fa6d9ff3532d10a9019cae06383e',
    ],
    primary: '0x52d232170f00607b555d97b943094b4ba866f0f0',
  },
  {
    consolidation_display: 'btree.eth - orionvault.eth',
    wallets: [
      '0x35f7f29f154a28674c8a50d435384744b02cf42c',
      '0xc19ca6cc85de33ec664fef9595905b8e57dae13d',
    ],
    primary: '0xc19ca6cc85de33ec664fef9595905b8e57dae13d',
  },
  {
    consolidation_display: 'hotwallet.barrylime.eth - barrylime.eth',
    wallets: [
      '0xaf8c805a51ae53c3247bd6fe571a1c9aca3a2584',
      '0xf5a93410e7e32bbf28a8eaafbd7f241cf0b290fb',
    ],
    primary: '0xf5a93410e7e32bbf28a8eaafbd7f241cf0b290fb',
  },
  {
    consolidation_display: '0x5C5...9ca - 0xc14...Cdc',
    wallets: [
      '0x5c5edb285b7451b2155ec13c5d2eaff2ec6779ca',
      '0xc147faf0120101d8c4d41a4d81ee5276b8d24cdc',
    ],
    primary: '0x5c5edb285b7451b2155ec13c5d2eaff2ec6779ca',
  },
  {
    consolidation_display: 'coolmatt.eth - hide-the-money-yall.eth',
    wallets: [
      '0x06d643b9ee73de07ade8b5c9fd520fa2aa28262a',
      '0x49fbb9f90e78dd1c0569816e1eeeaf2c28414ed7',
    ],
    primary: '0x06d643b9ee73de07ade8b5c9fd520fa2aa28262a',
  },
  {
    consolidation_display: 'mickeb.eth - 0x32b...d4a',
    wallets: [
      '0x28cf5d9d465dfaf5c616958ef8b23dbee567e2b7',
      '0x32b6cc0b1d20703f551e9572c1a2cbec58063d4a',
    ],
    primary: '0x28cf5d9d465dfaf5c616958ef8b23dbee567e2b7',
  },
  {
    consolidation_display: '0x550...5EF - cuongnfts.q00t.eth',
    wallets: [
      '0x55003460d5227affc1e8c2db6696af70c669e5ef',
      '0x76b4b991d3ae570a2d0d04ed511e9779080c5340',
    ],
    primary: '0x76b4b991d3ae570a2d0d04ed511e9779080c5340',
  },
  {
    consolidation_display: '0xA40...98E - cuttlemint.eth',
    wallets: [
      '0xa4024292ea4972e7084028d0deba76d27ab1698e',
      '0xf0cf0a85c08527d8207a3ef45c5dc5af38a61da5',
    ],
    primary: '0xf0cf0a85c08527d8207a3ef45c5dc5af38a61da5',
  },
  {
    consolidation_display: 'userlaze.eth - 0x4fA...0Da',
    wallets: [
      '0x02fbd51319bee0c0b135e99e0babed20df8414d2',
      '0x4fa576f8ebff56129b9156ebe3a632963d2cd0da',
    ],
    primary: '0x02fbd51319bee0c0b135e99e0babed20df8414d2',
  },
];

export const anMemeTokenPoolConsolidatedTokens = (): TokenOwnership[] => {
  return JSON.parse(
    fs.readFileSync('mock-data/meme-tokens-consolidated-17719473.json', 'utf8'),
  );
};
