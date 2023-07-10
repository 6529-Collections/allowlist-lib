import { AllowlistCreator } from '../src/allowlist/allowlist-creator';
import { AllowlistOperation } from '../src/allowlist/allowlist-operation';
import { AllowlistOperationCode } from '../src/allowlist/allowlist-operation-code';
import { Pool } from '../src/app-types';

describe('AllowlistCreator e2e tests', () => {
  let allowlistCreator: AllowlistCreator;

  beforeEach(async () => {
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
    if (!etherscanApiKey) {
      throw new Error('Environment variable ETHERSCAN_API_KEY is not defined');
    }
    allowlistCreator = AllowlistCreator.getInstance({
      etherscanApiKey: etherscanApiKey,
      seizeApiPath: '',
      onAfterOperation: (operation: AllowlistOperation) => {
        // console.log('after', operation);
        return;
      },
      onBeforeOperation: (operation: AllowlistOperation) => {
        // console.log('before', operation);
        return;
      },
    });
  });

  it.skip(
    'works',
    async () => {
      const operations: AllowlistOperation[] = [
        {
          code: AllowlistOperationCode.CREATE_ALLOWLIST,
          params: {
            id: 'allowlist-1',
            name: 'MEME CARD 95 DISTRIBUTION',
            description: 'Allowlist for meme card 95 distribution',
          },
        },
        {
          code: AllowlistOperationCode.GET_COLLECTION_TRANSFERS,
          params: {
            id: 'transfer-pool-1',
            name: 'The memes',
            description: 'Transfers of the memes',
            contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
            blockNo: 17185669,
          },
        },
        {
          code: AllowlistOperationCode.GET_COLLECTION_TRANSFERS,
          params: {
            id: 'transfer-pool-2',
            name: 'Gradient',
            description: 'Transfers of the gradient',
            contract: '0x0c58ef43ff3032005e472cb5709f8908acb00205',
            blockNo: 17185669,
          },
        },
        {
          code: AllowlistOperationCode.GET_COLLECTION_TRANSFERS,
          params: {
            id: 'transfer-pool-3',
            name: 'raw',
            description: 'Transfers of the raw',
            contract: '0x07e24ee32163da59297b5341bef8f8a2eead271e',
            blockNo: 17185669,
          },
        },
        {
          code: AllowlistOperationCode.GET_COLLECTION_TRANSFERS,
          params: {
            id: 'transfer-pool-4',
            name: 'Foundation',
            description: 'Foundation',
            contract: '0x3b3ee1931dc30c1957379fac9aba94d1c48a5405',
            blockNo: 17185669,
          },
        },
        {
          code: AllowlistOperationCode.CREATE_TOKEN_POOL,
          params: {
            id: 'token-pool-1',
            name: '6529 Meme Cards 1 to 94',
            description: 'Meme Cards 1 to 94',
            transferPoolId: 'transfer-pool-1',
            tokenIds: '1-94',
          },
        },
        {
          code: AllowlistOperationCode.CREATE_TOKEN_POOL,
          params: {
            id: 'token-pool-2',
            name: 'Gradient',
            description: 'Gradient Cards',
            transferPoolId: 'transfer-pool-2',
          },
        },
        {
          code: AllowlistOperationCode.CREATE_TOKEN_POOL,
          params: {
            id: 'token-pool-3',
            name: 'raw',
            description: 'raw Cards',
            transferPoolId: 'transfer-pool-3',
          },
        },
        {
          code: AllowlistOperationCode.CREATE_TOKEN_POOL,
          params: {
            id: 'token-pool-4',
            name: '65291/1s',
            description: '65291/1s',
            tokenIds: '113532',
            transferPoolId: 'transfer-pool-4',
          },
        },
        {
          code: AllowlistOperationCode.CREATE_CUSTOM_TOKEN_POOL,
          params: {
            id: 'custom-token-pool-1',
            name: 'Artist choice',
            description: 'Artist choice',
            tokens: [
              { owner: '0x01fdc1943701784250906f2dd1a0b90e24045e29' },
              { owner: '0x035da52e7aa085f7e71764c0c8a1ce6690e3dfef' },
              { owner: '0x038db6c62d0f072616e2b8db7d3d7cfc829f7f65' },
              { owner: '0x07d3088a697dc1647413e0b7393746dd2d6c8a55' },
              { owner: '0x092cd1a6d222a167f5d0767e6444c8b45c92cc72' },
            ],
          },
        },
        {
          code: AllowlistOperationCode.CREATE_CUSTOM_TOKEN_POOL,
          params: {
            id: 'custom-token-pool-2',
            name: 'Team',
            description: 'Team wallets',
            tokens: [
              { owner: '0xfd22004806a6846ea67ad883356be810f0428793' },
              { owner: '0xc3c9737cce778d7583f31ae7c4f2ab8782ed51e5' },
              { owner: '0xA62DA2Ea9F5bB03a58174060535ae32131973178' },
              { owner: '0xE16dF6503Acd3c79b6E032f62c61752bEC16eeF2' },
              { owner: '0x9769334FC882775F4951865aA473481880669D47' },
              { owner: '0x3852471D266d9e2222CA9Fdd922BAFC904Dc49e5' },
              { owner: '0x88D3574660711e03196aF8A96f268697590000Fa' },
              { owner: '0x885846850aaBf20d8f8e051f400354D94a32FF55' },
              { owner: '0x61D9d9cc8C3203daB7100eA79ceD77587201C990' },
              { owner: '0xE359aB04cEC41AC8C62bc5016C10C749c7De5480' },
              { owner: '0xfe3b3F0D64F354b69A5B40D02f714E69cA4B09bd' },
              { owner: '0x8889EBB11295F456541901f50BCB5f382047cAaC' },
              { owner: '0x4269AaDfd043b58cbA893BfE6029C9895C25cb61' },
              { owner: '0xbDf82b13580b918ebc3c24b4034E8468EA168E21' },
              { owner: '0x83EE335ca72759CAeDeD7b1afD11dCF75F48436b' },
              { owner: '0xddA3cb2741FaC4a87CAebec9EFC7963087304097' },
              { owner: '0xF9e129817BC576f937e4774E3C3Aec98787Cfb91' },
              { owner: '0x8e63380aC1e34c7D61bf404aF63e885875C18Ce3' },
              { owner: '0xaf5c021754Ab82Bf556BC6C90650dE21Cf92d1c7' },
              { owner: '0x7f3774EAdae4beB01919deC7f32A72e417Ab5DE3' },
              { owner: '0xC03E57b6acE9Dd62C84A095E11E494E3C8FD4D42' },
              { owner: '0xe70d73c76fF3b4388EE9C58747F0EaA06C6b645B' },
              { owner: '0x8BA68CFe71550EfC8988D81d040473709B7F9218' },
              { owner: '0xa743c8c57c425B84Cb2eD18C6B9ae3aD21629Cb5' },
              { owner: '0x1b7844CfaE4C823Ac6389855D47106a70c84F067' },
              { owner: '0x76D078D7e5755B66fF50166863329D27F2566b43' },
            ],
          },
        },
        {
          code: AllowlistOperationCode.CREATE_WALLET_POOL,
          params: {
            id: 'wallet-pool-1',
            name: 'Wallets to remove',
            description: 'Wallets to remove',
            wallets: [
              '0x3a3548e060be10c2614d0a4cb0c03cc9093fd799',
              '0x4b76837f8d8ad0a28590d06e53dcd44b6b7d4554',
              '0x0887773b5f43c58f0da7bd0402fc2d49482eb845',
              '0xcda72070e455bb31c7690a170224ce43623d0b6f',
              '0x41a322b28d0ff354040e2cbc676f0320d8c8850d',
              '0x000000000000000000000000000000000000dead',
            ],
          },
        },
        {
          code: AllowlistOperationCode.ADD_PHASE,
          params: {
            id: 'phase-1',
            name: 'Phase 1',
            description: 'Phase 1',
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: 'component-1',
            name: 'Meme Cards 1 to 94',
            description: 'Meme Cards 1 to 94',
            phaseId: 'phase-1',
          },
        },
        {
          code: AllowlistOperationCode.ADD_ITEM,
          params: {
            id: 'item-1',
            name: 'Meme Cards 1 to 94',
            description: 'Meme Cards 1 to 94',
            componentId: 'component-1',
            poolType: Pool.TOKEN_POOL,
            poolId: 'token-pool-1',
          },
        },
        {
          code: AllowlistOperationCode.ADD_ITEM,
          params: {
            id: 'item-2',
            name: 'Gradient',
            description: 'Gradient',
            componentId: 'component-1',
            poolType: Pool.TOKEN_POOL,
            poolId: 'token-pool-2',
          },
        },
      ];
      await allowlistCreator.execute(operations);
    },
    60 * 60 * 1000,
  );

  it.skip(
    'TEST',
    async () => {
      const operations: AllowlistOperation[] = [
        {
          code: AllowlistOperationCode.CREATE_ALLOWLIST,
          params: {
            id: '610d2cbe-80d4-4ee1-b315-140fbb377e48',
            name: 'all',
            description: 'lost',
          },
        },
        {
          code: AllowlistOperationCode.GET_COLLECTION_TRANSFERS,
          params: {
            id: '648ae504008f4fb03fcf1266',
            name: 'memes',
            description: 'memes',
            contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
            blockNo: 17484632,
          },
        },
        {
          code: AllowlistOperationCode.CREATE_TOKEN_POOL,
          params: {
            id: '648afe2cd22d8348621cfa37',
            name: 'token',
            description: 'pool',
            transferPoolId: '648ae504008f4fb03fcf1266',
          },
        },
        {
          code: AllowlistOperationCode.CREATE_CUSTOM_TOKEN_POOL,
          params: {
            id: '648b0d6d87f8473f3dbfeecf',
            name: 'custom',
            description: 'pool',
            tokens: [
              {
                owner: '0xe477a9d753ebe88faab8c1db234d55c2339ddc0b',
                id: '1',
              },
              {
                owner: '0x907a5662e7a462da00901924fa919911fbecf0cf',
                id: '2',
              },
              {
                owner: '0x1aef08f515388c71032f97d6afb16b43f1223131',
                id: '3',
              },
              {
                owner: '0x487204784f13a3050dacad3b6ca0753687240ac1',
                id: '3',
              },
              {
                owner: '0x6a6c417065befa6be9b945db073d23655a393115',
                id: '4',
              },
              {
                owner: '0x387fd01eb7b7fd5b99a5f5b8419148288d3898a4',
                id: '5',
              },
              {
                owner: '0xd7801ad20240d5bb473306c33f734f6c82eaaeb5',
                id: '6',
              },
              {
                owner: '0xce40d25250908462d28fea69d702a3c3add3ad15',
                id: '7',
              },
              {
                owner: '0x22e091333eed4fd5ec370992592b2a70e6042ada',
                id: '8',
              },
              {
                owner: '0xcedfcfacab68b65e0a79b5b8ed0d36e859e9129c',
                id: '9',
              },
              {
                owner: '0xc623483a440a6fb5c0d41f8e30a9f3df49a237ad',
                id: '1',
              },
              {
                owner: '0xb3c08dd532e2aba78cd399f3f38eca3279bcb7fd',
                id: '2',
              },
              {
                owner: '0x01f6cb6a691c1a313b94e69f980e2453e934b9a9',
                id: '3',
              },
              {
                owner: '0xd0837868be885f4d266c4e34483ac80edbd20ead',
                id: '4',
              },
              {
                owner: '0xf3380cfbacaf3a2c0c69a7b2d5aa2013a33094cf',
                id: '5',
              },
              {
                owner: '0x3b05e72c00165d255b761a97b9cac24c3faa16f1',
                id: '6',
              },
              {
                owner: '0x137b29f0aea2e2b008214d7bc74f2dcd4935f95a',
                id: '7',
              },
              {
                owner: '0x88106159fab8669a30976f50827a0ca064974826',
                id: '8',
              },
              {
                owner: '0x11a8ba98031d286633ed4e0d6f7e53c695fd8abf',
                id: '9',
              },
              {
                owner: '0x156f04654e110d95be25e129845fa2b93db5f6aa',
                id: '2',
              },
              {
                owner: '0x02233b1de97750208f1b22ddfaccb43eebd33135',
                id: '3',
              },
              {
                owner: '0x3e8d4dd7035057d6c8d38f948c30cb6e6c888888',
                id: '4',
              },
              {
                owner: '0x2bf0c4db2aa49abc857b8fdad3b16eb8f658201c',
                id: '5',
              },
              {
                owner: '0x3e6b7ab6e2d009db8799332dddc371a370e99999',
                id: '6',
              },
              {
                owner: '0xe9b1bd51a6a8d7d8e1b9d0a19c9c47f6d948b266',
                id: '7',
              },
            ],
          },
        },
        {
          code: AllowlistOperationCode.CREATE_WALLET_POOL,
          params: {
            id: '648b0d78afd356cd8f08ab41',
            name: 'wallet',
            description: 'pool',
            wallets: [
              '0xe477a9d753ebe88faab8c1db234d55c2339ddc0b',
              '0x907a5662e7a462da00901924fa919911fbecf0cf',
              '0x1aef08f515388c71032f97d6afb16b43f1223131',
              '0x487204784f13a3050dacad3b6ca0753687240ac1',
              '0x6a6c417065befa6be9b945db073d23655a393115',
              '0x387fd01eb7b7fd5b99a5f5b8419148288d3898a4',
              '0xd7801ad20240d5bb473306c33f734f6c82eaaeb5',
              '0xce40d25250908462d28fea69d702a3c3add3ad15',
              '0x22e091333eed4fd5ec370992592b2a70e6042ada',
              '0xcedfcfacab68b65e0a79b5b8ed0d36e859e9129c',
              '0xc623483a440a6fb5c0d41f8e30a9f3df49a237ad',
              '0xb3c08dd532e2aba78cd399f3f38eca3279bcb7fd',
              '0x01f6cb6a691c1a313b94e69f980e2453e934b9a9',
              '0xd0837868be885f4d266c4e34483ac80edbd20ead',
              '0xf3380cfbacaf3a2c0c69a7b2d5aa2013a33094cf',
              '0x3b05e72c00165d255b761a97b9cac24c3faa16f1',
              '0x137b29f0aea2e2b008214d7bc74f2dcd4935f95a',
              '0x88106159fab8669a30976f50827a0ca064974826',
              '0x11a8ba98031d286633ed4e0d6f7e53c695fd8abf',
              '0x156f04654e110d95be25e129845fa2b93db5f6aa',
              '0x02233b1de97750208f1b22ddfaccb43eebd33135',
              '0x3e8d4dd7035057d6c8d38f948c30cb6e6c888888',
              '0x2bf0c4db2aa49abc857b8fdad3b16eb8f658201c',
              '0x3e6b7ab6e2d009db8799332dddc371a370e99999',
              '0xe9b1bd51a6a8d7d8e1b9d0a19c9c47f6d948b266',
            ],
          },
        },
        {
          code: AllowlistOperationCode.ADD_PHASE,
          params: {
            id: '648b0e34c362a205fdd791ec',
            name: 'phase',
            description: 'phase',
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '648b0e3d91dde6810a9dc246',
            name: 'component',
            description: 'component',
            phaseId: '648b0e34c362a205fdd791ec',
          },
        },
        {
          code: AllowlistOperationCode.ADD_ITEM,
          params: {
            id: '648b0e479bdd21d5614aa81f',
            name: 'item',
            description: 'item',
            componentId: '648b0e3d91dde6810a9dc246',
            poolId: '648afe2cd22d8348621cfa37',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: AllowlistOperationCode.ADD_ITEM,
          params: {
            id: '648b0e53f68b6cbb18a04ae1',
            name: 'item2',
            description: 'item2',
            componentId: '648b0e3d91dde6810a9dc246',
            poolId: '648b0d6d87f8473f3dbfeecf',
            poolType: 'CUSTOM_TOKEN_POOL',
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '648b0e5ea533bf762be312aa',
            name: 'compone',
            description: 'comp',
            phaseId: '648b0e34c362a205fdd791ec',
          },
        },
        {
          code: AllowlistOperationCode.ADD_ITEM,
          params: {
            id: '648b0e692e7b1485b12d969b',
            name: 'i2',
            description: 'it',
            componentId: '648b0e5ea533bf762be312aa',
            poolId: '648afe2cd22d8348621cfa37',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: AllowlistOperationCode.ADD_ITEM,
          params: {
            id: '648b0e75d51b4fa5d220deaa',
            name: 'i3',
            description: 'i2',
            componentId: '648b0e5ea533bf762be312aa',
            poolId: '648afe2cd22d8348621cfa37',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: AllowlistOperationCode.CREATE_WALLET_POOL,
          params: {
            id: '648b15d26550b9b944bc0c86',
            name: 'wall',
            description: 'pool',
            wallets: [
              '0xe477a9d753ebe88faab8c1db234d55c2339ddc0b',
              '0x907a5662e7a462da00901924fa919911fbecf0cf',
              '0x1aef08f515388c71032f97d6afb16b43f1223131',
              '0x487204784f13a3050dacad3b6ca0753687240ac1',
              '0x6a6c417065befa6be9b945db073d23655a393115',
              '0x387fd01eb7b7fd5b99a5f5b8419148288d3898a4',
              '0xd7801ad20240d5bb473306c33f734f6c82eaaeb5',
              '0xce40d25250908462d28fea69d702a3c3add3ad15',
              '0x22e091333eed4fd5ec370992592b2a70e6042ada',
              '0xcedfcfacab68b65e0a79b5b8ed0d36e859e9129c',
              '0xc623483a440a6fb5c0d41f8e30a9f3df49a237ad',
              '0xb3c08dd532e2aba78cd399f3f38eca3279bcb7fd',
              '0x01f6cb6a691c1a313b94e69f980e2453e934b9a9',
              '0xd0837868be885f4d266c4e34483ac80edbd20ead',
              '0xf3380cfbacaf3a2c0c69a7b2d5aa2013a33094cf',
              '0x3b05e72c00165d255b761a97b9cac24c3faa16f1',
              '0x137b29f0aea2e2b008214d7bc74f2dcd4935f95a',
              '0x88106159fab8669a30976f50827a0ca064974826',
              '0x11a8ba98031d286633ed4e0d6f7e53c695fd8abf',
              '0x156f04654e110d95be25e129845fa2b93db5f6aa',
              '0x02233b1de97750208f1b22ddfaccb43eebd33135',
              '0x3e8d4dd7035057d6c8d38f948c30cb6e6c888888',
              '0x2bf0c4db2aa49abc857b8fdad3b16eb8f658201c',
              '0x3e6b7ab6e2d009db8799332dddc371a370e99999',
              '0xe9b1bd51a6a8d7d8e1b9d0a19c9c47f6d948b266',
            ],
          },
        },
        {
          code: AllowlistOperationCode.ADD_PHASE,
          params: {
            id: '648b2006f7def99086b2222a',
            name: 'pha',
            description: 'pja',
          },
        },
        {
          code: AllowlistOperationCode.ADD_PHASE,
          params: {
            id: '648b2043689186965d5d7d3f',
            name: 'p',
            description: 'p',
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '648b204fe3d8e0aadcce6807',
            name: 'c',
            description: 'c',
            phaseId: '648b0e34c362a205fdd791ec',
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: {
            componentId: '648b0e3d91dde6810a9dc246',
            spots: 5,
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: {
            componentId: '648b204fe3d8e0aadcce6807',
            spots: 1,
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: {
            componentId: '648b0e5ea533bf762be312aa',
            spots: 2,
          },
        },
        {
          code: AllowlistOperationCode.CREATE_TOKEN_POOL,
          params: {
            id: '64903f0550b824934b08646c',
            name: 'szn3',
            description: 's',
            transferPoolId: '648ae504008f4fb03fcf1266',
            tokenIds: '87-109',
          },
        },
        {
          code: AllowlistOperationCode.ITEM_EXCLUE_TOKEN_IDS,
          params: {
            itemId: '648b0e479bdd21d5614aa81f',
            tokenIds: '1',
          },
        },
        {
          code: AllowlistOperationCode.ITEM_EXCLUE_TOKEN_IDS,
          params: {
            itemId: '648b0e53f68b6cbb18a04ae1',
            tokenIds: '1',
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '649c4ecac6b201a69a27876c',
            name: 'artist',
            description: 'all artist',
            phaseId: '648b0e34c362a205fdd791ec',
          },
        },
        {
          code: AllowlistOperationCode.ADD_ITEM,
          params: {
            id: '649c4ecafa5b85a00f820364',
            name: 'token',
            description: 'Snapshot',
            componentId: '649c4ecac6b201a69a27876c',
            poolId: '648afe2cd22d8348621cfa37',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: AllowlistOperationCode.ADD_ITEM,
          params: {
            id: '649c4ecaf870d55c69f1201b',
            name: 'szn3',
            description: 'Snapshot',
            componentId: '649c4ecac6b201a69a27876c',
            poolId: '64903f0550b824934b08646c',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: {
            componentId: '649c4ecac6b201a69a27876c',
            spots: 1,
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '649c4f9f1e86b3a17f0a94ab',
            name: 'mycomp',
            description: 'com',
            phaseId: '648b0e34c362a205fdd791ec',
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: {
            componentId: '649c4f9f1e86b3a17f0a94ab',
            spots: 3,
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '649c4fb17d8e08edd356c5ea',
            name: 'newcomp',
            description: 'compcomp',
            phaseId: '648b0e34c362a205fdd791ec',
          },
        },
        {
          code: AllowlistOperationCode.ADD_ITEM,
          params: {
            id: '649c4fb10d37fc1b680ea89e',
            name: 'token',
            description: 'Snapshot',
            componentId: '649c4fb17d8e08edd356c5ea',
            poolId: '648afe2cd22d8348621cfa37',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: AllowlistOperationCode.ADD_ITEM,
          params: {
            id: '649c4fb160456c9b149da2c0',
            name: 'szn3',
            description: 'Snapshot',
            componentId: '649c4fb17d8e08edd356c5ea',
            poolId: '64903f0550b824934b08646c',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: {
            componentId: '649c4fb17d8e08edd356c5ea',
            spots: 2,
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '649c5043ed76a737b45cc4b6',
            name: 'f',
            description: 'f',
            phaseId: '648b0e34c362a205fdd791ec',
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: {
            componentId: '649c5043ed76a737b45cc4b6',
            spots: 3,
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '649c5082d9af6ebdeeb48abf',
            name: 'd',
            description: 'd',
            phaseId: '648b0e34c362a205fdd791ec',
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: {
            componentId: '649c5082d9af6ebdeeb48abf',
            spots: 1,
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '649c50cf33aa10a917252946',
            name: 'x',
            description: 'x',
            phaseId: '648b0e34c362a205fdd791ec',
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: {
            componentId: '649c50cf33aa10a917252946',
            spots: 1,
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '649c50fb898a0092f7e4cf8c',
            name: '1',
            description: '2',
            phaseId: '648b0e34c362a205fdd791ec',
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: {
            componentId: '649c50fb898a0092f7e4cf8c',
            spots: 1,
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '649c51352d3be20b2d7168b5',
            name: '1',
            description: '2',
            phaseId: '648b0e34c362a205fdd791ec',
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '649c51f48e695fe95afe34cb',
            name: '2',
            description: '2',
            phaseId: '648b0e34c362a205fdd791ec',
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '649c520c103dab9c38e5e84a',
            name: '3',
            description: '3',
            phaseId: '648b0e34c362a205fdd791ec',
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: {
            componentId: '649c520c103dab9c38e5e84a',
            spots: 3,
          },
        },
        {
          code: AllowlistOperationCode.GET_COLLECTION_TRANSFERS,
          params: {
            id: '649c53fa9b553aefd4cf17c8',
            name: 'smth',
            description: 'smth',
            contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
            blockNo: 17484632,
          },
        },
        {
          code: AllowlistOperationCode.CREATE_TOKEN_POOL,
          params: {
            id: '649c53fa85057a74b9a142e9',
            name: 'smth',
            description: 'smth',
            transferPoolId: '649c53fa9b553aefd4cf17c8',
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '649c548519af9f90abc5a24a',
            name: 'd',
            description: 'd',
            phaseId: '648b0e34c362a205fdd791ec',
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: {
            componentId: '649c548519af9f90abc5a24a',
            spots: 2,
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '64a80dadfbdd9366870048e7',
            phaseId: '648b0e34c362a205fdd791ec',
            name: 'group',
            description: 'group',
          },
        },
        {
          code: AllowlistOperationCode.ADD_ITEM,
          params: {
            id: '64a80dad66cfc20b9e71e8e3',
            name: 'token',
            description: 'Snapshot',
            componentId: '64a80dadfbdd9366870048e7',
            poolId: '648afe2cd22d8348621cfa37',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: AllowlistOperationCode.ITEM_SORT_WALLETS_BY_TOTAL_TOKENS_COUNT,
          params: {
            itemId: '64a80dad66cfc20b9e71e8e3',
          },
        },
        {
          code: AllowlistOperationCode.ITEM_SELECT_FIRST_N_WALLETS,
          params: {
            itemId: '64a80dad66cfc20b9e71e8e3',
            count: 1500,
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: {
            componentId: '64a80dadfbdd9366870048e7',
            spots: 1,
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '64a80f8de4fffe1170c7d6d3',
            phaseId: '648b2006f7def99086b2222a',
            name: 'group2',
            description: 'grpiü2',
          },
        },
        {
          code: AllowlistOperationCode.ADD_ITEM,
          params: {
            id: '64a80f8d93017fc6e72d8e88',
            name: 'token',
            description: 'Snapshot',
            componentId: '64a80f8de4fffe1170c7d6d3',
            poolId: '648afe2cd22d8348621cfa37',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: AllowlistOperationCode.ITEM_REMOVE_WALLETS_FROM_CERTAIN_COMPONENTS,
          params: {
            itemId: '64a80f8d93017fc6e72d8e88',
            componentIds: [
              '648b0e3d91dde6810a9dc246',
              '648b0e5ea533bf762be312aa',
              '648b204fe3d8e0aadcce6807',
              '649c4ecac6b201a69a27876c',
              '649c4f9f1e86b3a17f0a94ab',
              '649c4fb17d8e08edd356c5ea',
              '649c5043ed76a737b45cc4b6',
              '649c5082d9af6ebdeeb48abf',
              '649c50cf33aa10a917252946',
              '649c50fb898a0092f7e4cf8c',
              '649c51352d3be20b2d7168b5',
              '649c51f48e695fe95afe34cb',
              '649c520c103dab9c38e5e84a',
              '649c548519af9f90abc5a24a',
              '64a80dadfbdd9366870048e7',
            ],
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: {
            componentId: '64a80f8de4fffe1170c7d6d3',
            spots: 1,
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '64a80fdd1b45588f0f410ee6',
            phaseId: '648b2006f7def99086b2222a',
            name: 'group3',
            description: 'grpiü2',
          },
        },
        {
          code: AllowlistOperationCode.ADD_ITEM,
          params: {
            id: '64a80fdd5b537d3f9fc1e5d9',
            name: 'szn3',
            description: 'Snapshot',
            componentId: '64a80fdd1b45588f0f410ee6',
            poolId: '64903f0550b824934b08646c',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: AllowlistOperationCode.ITEM_SORT_WALLETS_BY_UNIQUE_TOKENS_COUNT,
          params: {
            itemId: '64a80fdd5b537d3f9fc1e5d9',
          },
        },
        {
          code: AllowlistOperationCode.ITEM_REMOVE_FIRST_N_WALLETS,
          params: {
            itemId: '64a80fdd5b537d3f9fc1e5d9',
            count: 99,
          },
        },
        {
          code: AllowlistOperationCode.ITEM_SELECT_FIRST_N_WALLETS,
          params: {
            itemId: '64a80fdd5b537d3f9fc1e5d9',
            count: 901,
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: {
            componentId: '64a80fdd1b45588f0f410ee6',
            spots: 1,
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '64a8105d72898463ac00eb9e',
            phaseId: '648b2006f7def99086b2222a',
            name: 'w',
            description: 'w',
          },
        },
        {
          code: AllowlistOperationCode.ADD_ITEM,
          params: {
            id: '64a8105d48d35ce605eadda3',
            name: 'smth',
            description: 'Snapshot',
            componentId: '64a8105d72898463ac00eb9e',
            poolId: '649c53fa85057a74b9a142e9',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: AllowlistOperationCode.ITEM_SORT_WALLETS_BY_UNIQUE_TOKENS_COUNT,
          params: {
            itemId: '64a8105d48d35ce605eadda3',
          },
        },
        {
          code: AllowlistOperationCode.ITEM_SELECT_FIRST_N_WALLETS,
          params: {
            itemId: '64a8105d48d35ce605eadda3',
            count: 1000,
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: {
            componentId: '64a8105d72898463ac00eb9e',
            spots: 1,
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '64a8121b1e27ca75f45c9f96',
            phaseId: '648b0e34c362a205fdd791ec',
            name: 's',
            description: 's',
          },
        },
        {
          code: AllowlistOperationCode.ADD_ITEM,
          params: {
            id: '64a8121b9cd1da64e0322c31',
            name: 'token',
            description: 'Snapshot',
            componentId: '64a8121b1e27ca75f45c9f96',
            poolId: '648afe2cd22d8348621cfa37',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: {
            componentId: '64a8121b1e27ca75f45c9f96',
            spots: 1,
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '64ac1c5fb4e5c1d8aedcfe88',
            phaseId: '648b0e34c362a205fdd791ec',
            name: 's',
            description: 's',
          },
        },
        {
          code: AllowlistOperationCode.ADD_ITEM,
          params: {
            id: '64ac1c5f16b1ae406185b117',
            name: 'token',
            description: 'Snapshot',
            componentId: '64ac1c5fb4e5c1d8aedcfe88',
            poolId: '648afe2cd22d8348621cfa37',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_SELECT_RANDOM_WALLETS,
          params: {
            componentId: '64ac1c5fb4e5c1d8aedcfe88',
            count: 100,
            seed: '610d2cbe-80d4-4ee1-b315-140fbb377e48',
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: {
            componentId: '64ac1c5fb4e5c1d8aedcfe88',
            spots: 1,
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '64ac1cd0a3a171b9636e4dc4',
            phaseId: '648b0e34c362a205fdd791ec',
            name: 's',
            description: 's',
          },
        },
        {
          code: AllowlistOperationCode.ADD_ITEM,
          params: {
            id: '64ac1cd0a6f3598ec7af3c24',
            name: 'token',
            description: 'Snapshot',
            componentId: '64ac1cd0a3a171b9636e4dc4',
            poolId: '648afe2cd22d8348621cfa37',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_SELECT_RANDOM_WALLETS,
          params: {
            componentId: '64ac1cd0a3a171b9636e4dc4',
            count: 90,
            seed: '610d2cbe-80d4-4ee1-b315-140fbb377e48',
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: {
            componentId: '64ac1cd0a3a171b9636e4dc4',
            spots: 1,
          },
        },
      ];
      await allowlistCreator.execute(operations);
    },
    60 * 60 * 1000,
  );
});
