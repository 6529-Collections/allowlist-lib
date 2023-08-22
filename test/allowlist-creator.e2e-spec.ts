import { AllowlistCreator } from '../src/allowlist/allowlist-creator';
import { AllowlistOperation } from '../src/allowlist/allowlist-operation';
import { AllowlistOperationCode } from '../src/allowlist/allowlist-operation-code';
import axios from 'axios';

describe('AllowlistCreator e2e tests', () => {
  let allowlistCreator: AllowlistCreator;

  beforeEach(async () => {
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
    if (!etherscanApiKey) {
      throw new Error('Environment variable ETHERSCAN_API_KEY is not defined');
    }
    const alchemyApiKey = process.env.ALCHEMY_API_KEY;
    if (!alchemyApiKey) {
      throw new Error('Environment variable ALCHEMY_API_KEY is not defined');
    }
    allowlistCreator = AllowlistCreator.getInstance({
      etherscanApiKey: etherscanApiKey,
      alchemyApiKey: process.env.ALCHEMY_API_KEY,
      seizeApiPath: 'https://api.seize.io/api',
      seizeApiKey: process.env.SEIZE_API_KEY,
      onAfterOperation: () => {
        return;
      },
      onBeforeOperation: () => {
        return;
      },
    });
  });

  it.skip(
    'should create allowlist',
    async () => {
      const contract = '0x495f947276749ce646f68ac8c248420045cb7b5e';
      const finishBlock = 17720173;
      let targetBlock = 16822230;
      const baseUrl = 'https://allowlist-api.staging.seize.io';
      // c060ce6d-3a7f-4d94-aa11-4ef9088155d3

      while (targetBlock < finishBlock) {
        const startingTime = new Date().getTime();
        const allowlist = await axios.post(`${baseUrl}/allowlists`, {
          name: 'MEME CARD 95 DISTRIBUTION',
          description: 'Allowlist for meme card 95 distribution',
        });
        const allowlistId = allowlist.data.id;
        console.log({ allowlistId, targetBlock, startingTime });
        await axios.post(`${baseUrl}/allowlists/${allowlistId}/operations`, {
          code: AllowlistOperationCode.GET_COLLECTION_TRANSFERS,
          params: {
            id: 'transfer-pool-1',
            name: 'random name',
            description: 'random description',
            contract,
            blockNo: targetBlock,
          },
        });
        await axios.post(`${baseUrl}/allowlists/${allowlistId}/runs`, {});
        let runCompleted = false;
        while (!runCompleted) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const response = await axios.get(
            `${baseUrl}/allowlists/${allowlistId}`,
          );
          const activeRun = response.data.activeRun;
          console.log({
            activeRun,
            allowlistId,
            targetBlock,
            timeDiff: Math.floor((new Date().getTime() - startingTime) / 1000),
          });
          if (activeRun?.status === 'COMPLETED') {
            runCompleted = true;
          }
        }
        await axios.delete(`${baseUrl}/allowlists/${allowlistId}`);
        targetBlock += 100000;
        await new Promise((resolve) => setTimeout(resolve, 240000));
      }
    },
    60 * 60 * 10000,
  );

  it.skip(
    'should create allowlist',
    async () => {
      const ops = [
        {
          code: 'CREATE_ALLOWLIST',
          params: {
            id: '4fc8bd6c-d5a5-4e77-a886-487021c5a16d',
            name: 'card133',
            description: 'card133plan',
          },
        },

        {
          code: 'CREATE_TOKEN_POOL',
          params: {
            id: '64e36b8f11610bb2d661169f',
            name: 'The Memes by 6529 SZN4',
            description: 'The Memes by 6529 SZN4',
            contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
            blockNo: 17932669,
            consolidateBlockNo: 17937546,
            tokenIds: '119-134',
          },
        },
        {
          code: 'CREATE_TOKEN_POOL',
          params: {
            id: '64e36b9ea0acc02394ea552e',
            name: 'The Memes by 6529 SZN1 SZN2 SZN3',
            description: 'The Memes by 6529 SZN1 SZN2 SZN3',
            contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
            blockNo: 17932669,
            consolidateBlockNo: 17937546,
            tokenIds: '1-47,48-86,87-118',
          },
        },
        {
          code: 'CREATE_TOKEN_POOL',
          params: {
            id: '64e36ba944423d225f2d57e0',
            name: 'The Memes by 6529 SZN1 SZN2 SZN3 SZN4',
            description: 'The Memes by 6529 SZN1 SZN2 SZN3 SZN4',
            contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
            blockNo: 17932669,
            consolidateBlockNo: 17937546,
            tokenIds: '1-47,48-86,87-118,119-134',
          },
        },
        {
          code: 'CREATE_CUSTOM_TOKEN_POOL',
          params: {
            id: '64e36c5008135e09d0101b0a',
            name: 'RemoveTeam',
            description: 'RemoveTeam',
            tokens: [
              { owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd' },
              { owner: '0x8ba68cfe71550efc8988d81d040473709b7f9218' },
              { owner: '0xa743c8c57c425b84cb2ed18c6b9ae3ad21629cb5' },
              { owner: '0x1b7844cfae4c823ac6389855d47106a70c84f067' },
              { owner: '0x76d078d7e5755b66ff50166863329d27f2566b43' },
              { owner: '0xfd22004806a6846ea67ad883356be810f0428793' },
              { owner: '0xc3c9737cce778d7583f31ae7c4f2ab8782ed51e5' },
              { owner: '0xa62da2ea9f5bb03a58174060535ae32131973178' },
              { owner: '0xe16df6503acd3c79b6e032f62c61752bec16eef2' },
              { owner: '0x9769334fc882775f4951865aa473481880669d47' },
              { owner: '0x3852471d266d9e2222ca9fdd922bafc904dc49e5' },
              { owner: '0x88d3574660711e03196af8a96f268697590000fa' },
              { owner: '0x885846850aabf20d8f8e051f400354d94a32ff55' },
              { owner: '0x61d9d9cc8c3203dab7100ea79ced77587201c990' },
              { owner: '0xe359ab04cec41ac8c62bc5016c10c749c7de5480' },
              { owner: '0xfe3b3f0d64f354b69a5b40d02f714e69ca4b09bd' },
              { owner: '0x8889ebb11295f456541901f50bcb5f382047caac' },
              { owner: '0x4269aadfd043b58cba893bfe6029c9895c25cb61' },
              { owner: '0xbdf82b13580b918ebc3c24b4034e8468ea168e21' },
              { owner: '0x83ee335ca72759caeded7b1afd11dcf75f48436b' },
              { owner: '0xdda3cb2741fac4a87caebec9efc7963087304097' },
              { owner: '0xf9e129817bc576f937e4774e3c3aec98787cfb91' },
              { owner: '0x8e63380ac1e34c7d61bf404af63e885875c18ce3' },
              { owner: '0xaf5c021754ab82bf556bc6c90650de21cf92d1c7' },
              { owner: '0x7f3774eadae4beb01919dec7f32a72e417ab5de3' },
              { owner: '0xc03e57b6ace9dd62c84a095e11e494e3c8fd4d42' },
              { owner: '0xe70d73c76ff3b4388ee9c58747f0eaa06c6b645b' },
            ],
          },
        },
        {
          code: 'ADD_PHASE',
          params: {
            id: '64e36c59ef47e73a9ac70508',
            name: 'Allowlist Phase 1',
            description: 'Allowlist Phase 1',
          },
        },
        {
          code: 'ADD_PHASE',
          params: {
            id: '64e36c5c620359b164572c3f',
            name: 'Allowlist Phase 2',
            description: 'Allowlist Phase 2',
          },
        },
        {
          code: 'ADD_COMPONENT',
          params: {
            id: '64e36d4dc52732af155993ea',
            phaseId: '64e36c59ef47e73a9ac70508',
            name: 'Memes Group 1',
            description: 'Top 250 SZN4 (by Set Size)',
          },
        },
        {
          code: 'ADD_ITEM',
          params: {
            id: '64e36d4d61b5768e0857cb31',
            name: 'Memes Group 1',
            description: 'Memes Group 1',
            componentId: '64e36d4dc52732af155993ea',
            poolId: '64e36b8f11610bb2d661169f',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: 'ITEM_REMOVE_WALLETS_FROM_CERTAIN_TOKEN_POOLS',
          params: {
            itemId: '64e36d4d61b5768e0857cb31',
            pools: [
              {
                poolType: 'CUSTOM_TOKEN_POOL',
                poolId: '64e36c5008135e09d0101b0a',
              },
            ],
          },
        },
        {
          code: 'ITEM_SORT_WALLETS_BY_UNIQUE_TOKENS_COUNT',
          params: { itemId: '64e36d4d61b5768e0857cb31' },
        },
        {
          code: 'ITEM_SELECT_FIRST_N_WALLETS',
          params: { itemId: '64e36d4d61b5768e0857cb31', count: 250 },
        },
        {
          code: 'COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS',
          params: { componentId: '64e36d4dc52732af155993ea', spots: 1 },
        },
        {
          code: 'ADD_COMPONENT',
          params: {
            id: '64e36dfca3c789b0b3641b7c',
            phaseId: '64e36c59ef47e73a9ac70508',
            name: 'Memes Group 2',
            description: 'Top 500 SZN123 (by TDH)',
          },
        },
        {
          code: 'ADD_ITEM',
          params: {
            id: '64e36dfcd9bea2af9f3a5664',
            name: 'Memes Group 2',
            description: 'Memes Group 2',
            componentId: '64e36dfca3c789b0b3641b7c',
            poolId: '64e36b9ea0acc02394ea552e',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: 'ITEM_REMOVE_WALLETS_FROM_CERTAIN_TOKEN_POOLS',
          params: {
            itemId: '64e36dfcd9bea2af9f3a5664',
            pools: [
              {
                poolType: 'CUSTOM_TOKEN_POOL',
                poolId: '64e36c5008135e09d0101b0a',
              },
            ],
          },
        },
        {
          code: 'ITEM_REMOVE_WALLETS_FROM_CERTAIN_COMPONENTS',
          params: {
            itemId: '64e36dfcd9bea2af9f3a5664',
            componentIds: ['64e36d4dc52732af155993ea'],
          },
        },
        {
          code: 'ITEM_SORT_WALLETS_BY_MEMES_TDH',
          params: {
            itemId: '64e36dfcd9bea2af9f3a5664',
            tdhBlockNumber: 17932669,
          },
        },
        {
          code: 'ITEM_SELECT_FIRST_N_WALLETS',
          params: { itemId: '64e36dfcd9bea2af9f3a5664', count: 500 },
        },
        {
          code: 'COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS',
          params: { componentId: '64e36dfca3c789b0b3641b7c', spots: 1 },
        },
        {
          code: 'ADD_COMPONENT',
          params: {
            id: '64e36e9ecc261b4ed76c6b97',
            phaseId: '64e36c5c620359b164572c3f',
            name: 'Memes',
            description: 'Phase 2',
          },
        },
        {
          code: 'ADD_ITEM',
          params: {
            id: '64e36e9e4f8c588e69f4bfae',
            name: 'Memes',
            description: 'Memes',
            componentId: '64e36e9ecc261b4ed76c6b97',
            poolId: '64e36ba944423d225f2d57e0',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: 'ITEM_REMOVE_WALLETS_FROM_CERTAIN_TOKEN_POOLS',
          params: {
            itemId: '64e36e9e4f8c588e69f4bfae',
            pools: [
              {
                poolType: 'CUSTOM_TOKEN_POOL',
                poolId: '64e36c5008135e09d0101b0a',
              },
            ],
          },
        },
        {
          code: 'ITEM_REMOVE_WALLETS_FROM_CERTAIN_COMPONENTS',
          params: {
            itemId: '64e36e9e4f8c588e69f4bfae',
            componentIds: [
              '64e36d4dc52732af155993ea',
              '64e36dfca3c789b0b3641b7c',
            ],
          },
        },
        {
          code: 'COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS',
          params: { componentId: '64e36e9ecc261b4ed76c6b97', spots: 1 },
        },
      ];

      const state = await allowlistCreator.execute(ops as AllowlistOperation[]);

      // const wallets = [
      //   '0x31bedb3962ab3a1d2a2e070853aa5c4acdb734f4',
      //   '0x3C2286342e143D511Ae6b7CaefD548Bf38C8c1aB',
      //   '0xd72c8DD33954E8AA53D5C108906b751cE4B2382b',
      // ];

      // for (const wallet of wallets) {
      //   console.log(
      //     wallet,
      //     state.phases['64e36c59ef47e73a9ac70508'].components[
      //       '64e36d4dc52732af155993ea'
      //     ].winners[wallet.toLowerCase()],
      //   );
      // }
    },
    60 * 60 * 10000,
  );
});
