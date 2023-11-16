import { AllowlistOperation } from '../allowlist-operation';
import { AllowlistOperationCode } from '../allowlist-operation-code';
import { removeEntity } from './operation-remover';

describe('Operation remover', () => {
  let operations: AllowlistOperation[];
  beforeEach(() => {
    operations = [
      {
        code: AllowlistOperationCode.CREATE_ALLOWLIST,
        params: {
          id: '16aebb17-63cc-496a-99f6-dfbc814de95f',
          name: 'd',
          description: 'd',
        },
      },
      {
        code: AllowlistOperationCode.CREATE_TOKEN_POOL,
        params: {
          id: '64f6f2b3eafdf959947ae339',
          name: 'The Memes by 6529',
          description: 'The Memes by 6529',
          contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
          blockNo: 18069339,
          consolidateBlockNo: 18069339,
        },
      },
      {
        code: AllowlistOperationCode.ADD_PHASE,
        params: {
          id: '64f887c9ccfb7c6aaf87684d',
          name: 'phase 1',
          description: 'phase 1',
        },
      },
      {
        code: AllowlistOperationCode.CREATE_TOKEN_POOL,
        params: {
          id: '64f9a8eaf85e38ae7d04f520',
          name: 'The Memes by 6529 SZN1',
          description: 'The Memes by 6529 SZN1',
          contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
          blockNo: 18084015,
          consolidateBlockNo: 18084015,
          tokenIds: '1-47',
        },
      },
      {
        code: AllowlistOperationCode.CREATE_TOKEN_POOL,
        params: {
          id: '64f9a8efc0571c3f83915c33',
          name: 'The Memes by 6529 SZN2',
          description: 'The Memes by 6529 SZN2',
          contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
          blockNo: 18084015,
          consolidateBlockNo: 18084015,
          tokenIds: '48-86',
        },
      },
      {
        code: AllowlistOperationCode.CREATE_TOKEN_POOL,
        params: {
          id: '64f9a8f6feb9e9849a921ab1',
          name: 'The Memes by 6529 SZN3',
          description: 'The Memes by 6529 SZN3',
          contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
          blockNo: 18084015,
          consolidateBlockNo: 18084015,
          tokenIds: '87-118',
        },
      },
      {
        code: AllowlistOperationCode.CREATE_CUSTOM_TOKEN_POOL,
        params: {
          id: '64f9a9b41d2b7e0effba286f',
          name: 'team',
          description: 'team',
          tokens: [
            { owner: '0xe477a9d753ebe88faab8c1db234d55c2339ddc0b' },
            { owner: '0x907a5662e7a462da00901924fa919911fbecf0cf' },
            { owner: '0x1aef08f515388c71032f97d6afb16b43f1223131' },
            { owner: '0x487204784f13a3050dacad3b6ca0753687240ac1' },
            { owner: '0x6a6c417065befa6be9b945db073d23655a393115' },
            { owner: '0x387fd01eb7b7fd5b99a5f5b8419148288d3898a4' },
            { owner: '0xd7801ad20240d5bb473306c33f734f6c82eaaeb5' },
            { owner: '0xce40d25250908462d28fea69d702a3c3add3ad15' },
            { owner: '0x22e091333eed4fd5ec370992592b2a70e6042ada' },
            { owner: '0xcedfcfacab68b65e0a79b5b8ed0d36e859e9129c' },
            { owner: '0xc623483a440a6fb5c0d41f8e30a9f3df49a237ad' },
            { owner: '0xb3c08dd532e2aba78cd399f3f38eca3279bcb7fd' },
            { owner: '0x01f6cb6a691c1a313b94e69f980e2453e934b9a9' },
            { owner: '0xd0837868be885f4d266c4e34483ac80edbd20ead' },
            { owner: '0xf3380cfbacaf3a2c0c69a7b2d5aa2013a33094cf' },
            { owner: '0x3b05e72c00165d255b761a97b9cac24c3faa16f1' },
            { owner: '0x137b29f0aea2e2b008214d7bc74f2dcd4935f95a' },
            { owner: '0x88106159fab8669a30976f50827a0ca064974826' },
            { owner: '0x11a8ba98031d286633ed4e0d6f7e53c695fd8abf' },
            { owner: '0x156f04654e110d95be25e129845fa2b93db5f6aa' },
            { owner: '0x02233b1de97750208f1b22ddfaccb43eebd33135' },
            { owner: '0x3e8d4dd7035057d6c8d38f948c30cb6e6c888888' },
            { owner: '0x2bf0c4db2aa49abc857b8fdad3b16eb8f658201c' },
            { owner: '0x3e6b7ab6e2d009db8799332dddc371a370e99999' },
            { owner: '0xe9b1bd51a6a8d7d8e1b9d0a19c9c47f6d948b266' },
          ],
        },
      },
      {
        code: AllowlistOperationCode.ADD_PHASE,
        params: {
          id: '64f9a9bb997985ed49736f84',
          name: 'phase 2',
          description: 'phase 2',
        },
      },
      {
        code: AllowlistOperationCode.ADD_COMPONENT,
        params: {
          id: '64f9aa3da1d580909341b9c5',
          phaseId: '64f887c9ccfb7c6aaf87684d',
          name: 'g 1',
          description: 'g1',
        },
      },
      {
        code: AllowlistOperationCode.ADD_ITEM,
        params: {
          id: '64f9aa3dc0749bde346fcdd3',
          name: 'g 1',
          description: 'g 1',
          componentId: '64f9aa3da1d580909341b9c5',
          poolId: '64f6f2b3eafdf959947ae339',
          poolType: 'TOKEN_POOL',
        },
      },
      {
        code: AllowlistOperationCode.ITEM_REMOVE_WALLETS_FROM_CERTAIN_TOKEN_POOLS,
        params: {
          itemId: '64f9aa3dc0749bde346fcdd3',
          pools: [
            { poolType: 'TOKEN_POOL', poolId: '64f9a8eaf85e38ae7d04f520' },
          ],
        },
      },
      {
        code: AllowlistOperationCode.ITEM_SORT_WALLETS_BY_TOTAL_TOKENS_COUNT,
        params: { itemId: '64f9aa3dc0749bde346fcdd3' },
      },
      {
        code: AllowlistOperationCode.ITEM_REMOVE_FIRST_N_WALLETS,
        params: { itemId: '64f9aa3dc0749bde346fcdd3', count: 99 },
      },
      {
        code: AllowlistOperationCode.ITEM_SELECT_FIRST_N_WALLETS,
        params: { itemId: '64f9aa3dc0749bde346fcdd3', count: 101 },
      },
      {
        code: AllowlistOperationCode.ADD_ITEM,
        params: {
          id: '64f9aa3d663d0520326fa540',
          name: 'g 1',
          description: 'g 1',
          componentId: '64f9aa3da1d580909341b9c5',
          poolId: '64f6f2b3eafdf959947ae339',
          poolType: 'TOKEN_POOL',
        },
      },
      {
        code: AllowlistOperationCode.ITEM_REMOVE_WALLETS_FROM_CERTAIN_TOKEN_POOLS,
        params: {
          itemId: '64f9aa3d663d0520326fa540',
          pools: [
            { poolType: 'TOKEN_POOL', poolId: '64f9a8efc0571c3f83915c33' },
          ],
        },
      },
      {
        code: AllowlistOperationCode.ITEM_SORT_WALLETS_BY_UNIQUE_TOKENS_COUNT,
        params: { itemId: '64f9aa3d663d0520326fa540' },
      },
      {
        code: AllowlistOperationCode.ITEM_REMOVE_FIRST_N_WALLETS,
        params: { itemId: '64f9aa3d663d0520326fa540', count: 199 },
      },
      {
        code: AllowlistOperationCode.ITEM_SELECT_FIRST_N_WALLETS,
        params: { itemId: '64f9aa3d663d0520326fa540', count: 101 },
      },
      {
        code: AllowlistOperationCode.ADD_ITEM,
        params: {
          id: '64f9aa3d60199f24e23cc341',
          name: 'g 1',
          description: 'g 1',
          componentId: '64f9aa3da1d580909341b9c5',
          poolId: '64f9a8eaf85e38ae7d04f520',
          poolType: 'TOKEN_POOL',
        },
      },
      {
        code: AllowlistOperationCode.ITEM_REMOVE_WALLETS_FROM_CERTAIN_TOKEN_POOLS,
        params: {
          itemId: '64f9aa3d60199f24e23cc341',
          pools: [
            { poolType: 'TOKEN_POOL', poolId: '64f9a8efc0571c3f83915c33' },
          ],
        },
      },
      {
        code: AllowlistOperationCode.ITEM_SORT_WALLETS_BY_MEMES_TDH,
        params: {
          itemId: '64f9aa3d60199f24e23cc341',
          tdhBlockNumber: 18084015,
        },
      },
      {
        code: AllowlistOperationCode.ITEM_REMOVE_FIRST_N_WALLETS,
        params: { itemId: '64f9aa3d60199f24e23cc341', count: 499 },
      },
      {
        code: AllowlistOperationCode.ITEM_SELECT_FIRST_N_WALLETS,
        params: { itemId: '64f9aa3d60199f24e23cc341', count: 101 },
      },
      {
        code: AllowlistOperationCode.COMPONENT_SELECT_RANDOM_WALLETS,
        params: {
          componentId: '64f9aa3da1d580909341b9c5',
          seed: '16aebb17-63cc-496a-99f6-dfbc814de95f',
          weightType: 'UNIQUE_CARDS',
          count: 100,
        },
      },
      {
        code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
        params: { componentId: '64f9aa3da1d580909341b9c5', spots: 1 },
      },
    ];
  });

  it('should remove operation', () => {
    const entityId = operations.at(3).params.id;
    const result = removeEntity({ entityId, operations });
    expect(result).toStrictEqual([
      {
        code: 'CREATE_ALLOWLIST',
        params: {
          id: '16aebb17-63cc-496a-99f6-dfbc814de95f',
          name: 'd',
          description: 'd',
        },
      },
      {
        code: 'CREATE_TOKEN_POOL',
        params: {
          id: '64f6f2b3eafdf959947ae339',
          name: 'The Memes by 6529',
          description: 'The Memes by 6529',
          contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
          blockNo: 18069339,
          consolidateBlockNo: 18069339,
        },
      },
      {
        code: 'ADD_PHASE',
        params: {
          id: '64f887c9ccfb7c6aaf87684d',
          name: 'phase 1',
          description: 'phase 1',
        },
      },
      {
        code: 'CREATE_TOKEN_POOL',
        params: {
          id: '64f9a8efc0571c3f83915c33',
          name: 'The Memes by 6529 SZN2',
          description: 'The Memes by 6529 SZN2',
          contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
          blockNo: 18084015,
          consolidateBlockNo: 18084015,
          tokenIds: '48-86',
        },
      },
      {
        code: 'CREATE_TOKEN_POOL',
        params: {
          id: '64f9a8f6feb9e9849a921ab1',
          name: 'The Memes by 6529 SZN3',
          description: 'The Memes by 6529 SZN3',
          contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
          blockNo: 18084015,
          consolidateBlockNo: 18084015,
          tokenIds: '87-118',
        },
      },
      {
        code: 'CREATE_CUSTOM_TOKEN_POOL',
        params: {
          id: '64f9a9b41d2b7e0effba286f',
          name: 'team',
          description: 'team',
          tokens: [
            { owner: '0xe477a9d753ebe88faab8c1db234d55c2339ddc0b' },
            { owner: '0x907a5662e7a462da00901924fa919911fbecf0cf' },
            { owner: '0x1aef08f515388c71032f97d6afb16b43f1223131' },
            { owner: '0x487204784f13a3050dacad3b6ca0753687240ac1' },
            { owner: '0x6a6c417065befa6be9b945db073d23655a393115' },
            { owner: '0x387fd01eb7b7fd5b99a5f5b8419148288d3898a4' },
            { owner: '0xd7801ad20240d5bb473306c33f734f6c82eaaeb5' },
            { owner: '0xce40d25250908462d28fea69d702a3c3add3ad15' },
            { owner: '0x22e091333eed4fd5ec370992592b2a70e6042ada' },
            { owner: '0xcedfcfacab68b65e0a79b5b8ed0d36e859e9129c' },
            { owner: '0xc623483a440a6fb5c0d41f8e30a9f3df49a237ad' },
            { owner: '0xb3c08dd532e2aba78cd399f3f38eca3279bcb7fd' },
            { owner: '0x01f6cb6a691c1a313b94e69f980e2453e934b9a9' },
            { owner: '0xd0837868be885f4d266c4e34483ac80edbd20ead' },
            { owner: '0xf3380cfbacaf3a2c0c69a7b2d5aa2013a33094cf' },
            { owner: '0x3b05e72c00165d255b761a97b9cac24c3faa16f1' },
            { owner: '0x137b29f0aea2e2b008214d7bc74f2dcd4935f95a' },
            { owner: '0x88106159fab8669a30976f50827a0ca064974826' },
            { owner: '0x11a8ba98031d286633ed4e0d6f7e53c695fd8abf' },
            { owner: '0x156f04654e110d95be25e129845fa2b93db5f6aa' },
            { owner: '0x02233b1de97750208f1b22ddfaccb43eebd33135' },
            { owner: '0x3e8d4dd7035057d6c8d38f948c30cb6e6c888888' },
            { owner: '0x2bf0c4db2aa49abc857b8fdad3b16eb8f658201c' },
            { owner: '0x3e6b7ab6e2d009db8799332dddc371a370e99999' },
            { owner: '0xe9b1bd51a6a8d7d8e1b9d0a19c9c47f6d948b266' },
          ],
        },
      },
      {
        code: 'ADD_PHASE',
        params: {
          id: '64f9a9bb997985ed49736f84',
          name: 'phase 2',
          description: 'phase 2',
        },
      },
      {
        code: 'ADD_COMPONENT',
        params: {
          id: '64f9aa3da1d580909341b9c5',
          phaseId: '64f887c9ccfb7c6aaf87684d',
          name: 'g 1',
          description: 'g1',
        },
      },
      {
        code: 'ADD_ITEM',
        params: {
          id: '64f9aa3dc0749bde346fcdd3',
          name: 'g 1',
          description: 'g 1',
          componentId: '64f9aa3da1d580909341b9c5',
          poolId: '64f6f2b3eafdf959947ae339',
          poolType: 'TOKEN_POOL',
        },
      },
      {
        code: 'ITEM_SORT_WALLETS_BY_TOTAL_TOKENS_COUNT',
        params: { itemId: '64f9aa3dc0749bde346fcdd3' },
      },
      {
        code: 'ITEM_REMOVE_FIRST_N_WALLETS',
        params: { itemId: '64f9aa3dc0749bde346fcdd3', count: 99 },
      },
      {
        code: 'ITEM_SELECT_FIRST_N_WALLETS',
        params: { itemId: '64f9aa3dc0749bde346fcdd3', count: 101 },
      },
      {
        code: 'ADD_ITEM',
        params: {
          id: '64f9aa3d663d0520326fa540',
          name: 'g 1',
          description: 'g 1',
          componentId: '64f9aa3da1d580909341b9c5',
          poolId: '64f6f2b3eafdf959947ae339',
          poolType: 'TOKEN_POOL',
        },
      },
      {
        code: 'ITEM_REMOVE_WALLETS_FROM_CERTAIN_TOKEN_POOLS',
        params: {
          itemId: '64f9aa3d663d0520326fa540',
          pools: [
            { poolType: 'TOKEN_POOL', poolId: '64f9a8efc0571c3f83915c33' },
          ],
        },
      },
      {
        code: 'ITEM_SORT_WALLETS_BY_UNIQUE_TOKENS_COUNT',
        params: { itemId: '64f9aa3d663d0520326fa540' },
      },
      {
        code: 'ITEM_REMOVE_FIRST_N_WALLETS',
        params: { itemId: '64f9aa3d663d0520326fa540', count: 199 },
      },
      {
        code: 'ITEM_SELECT_FIRST_N_WALLETS',
        params: { itemId: '64f9aa3d663d0520326fa540', count: 101 },
      },
      {
        code: 'COMPONENT_SELECT_RANDOM_WALLETS',
        params: {
          componentId: '64f9aa3da1d580909341b9c5',
          seed: '16aebb17-63cc-496a-99f6-dfbc814de95f',
          weightType: 'UNIQUE_CARDS',
          count: 100,
        },
      },
      {
        code: 'COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS',
        params: { componentId: '64f9aa3da1d580909341b9c5', spots: 1 },
      },
    ]);
  });
});
