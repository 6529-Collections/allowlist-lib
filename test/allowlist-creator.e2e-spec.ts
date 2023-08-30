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
            id: '7346bdb7-334f-4961-a950-bb8f7c419ef5',
            name: 'This Is How I See The World: Other Worlds ',
            description: 'Free Collectors Drop',
          },
        },
        {
          code: 'CREATE_TOKEN_POOL',
          params: {
            id: '64ec82818d6a3ee43248c75c',
            name: 'MEME NINJA',
            description: 'MEME NINJA',
            contract: '0x54c45f3e00a1aaa12946fe509923ff33dbba28d6',
            blockNo: 18021600,
            consolidateBlockNo: 18021600,
          },
        },
        {
          code: 'CREATE_TOKEN_POOL',
          params: {
            id: '64ec82b97f838f45b1be0ad1',
            name: 'MEME NINJA',
            description: 'MEME NINJA',
            contract: '0x2db4878f56b6134a198ba47be450e469217d9116',
            blockNo: 18021600,
            consolidateBlockNo: 18021600,
          },
        },
        {
          code: 'ADD_PHASE',
          params: {
            id: '64ec8a2be199c657941a1f7d',
            name: "Collector's Phaase",
            description: "Collector's Phaase",
          },
        },
        {
          code: 'ADD_PHASE',
          params: {
            id: '64ec8a31655ed4bae3172c5b',
            name: 'Open Phase',
            description: 'Open Phase',
          },
        },
        {
          code: 'ADD_COMPONENT',
          params: {
            id: '64ec930d5c42516500e89805',
            phaseId: '64ec8a2be199c657941a1f7d',
            name: 'Collectors',
            description: 'Meme Ninja / Outside Collectors',
          },
        },
        {
          code: 'ADD_ITEM',
          params: {
            id: '64ec930de76cf432606b144f',
            name: 'Collectors',
            description: 'Collectors',
            componentId: '64ec930d5c42516500e89805',
            poolId: '64ec82818d6a3ee43248c75c',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: 'ADD_ITEM',
          params: {
            id: '64ec930d44095eebd31a5d67',
            name: 'Collectors',
            description: 'Collectors',
            componentId: '64ec930d5c42516500e89805',
            poolId: '64ec82b97f838f45b1be0ad1',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: 'COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS',
          params: { componentId: '64ec930d5c42516500e89805', spots: 1 },
        },
        {
          code: 'ADD_COMPONENT',
          params: {
            id: '64ec95f3f31b265d71f75fca',
            phaseId: '64ec8a31655ed4bae3172c5b',
            name: 'Public',
            description: 'Public Mint',
          },
        },
        {
          code: 'ADD_ITEM',
          params: {
            id: '64ec95f3c413be7822a9b22a',
            name: 'Public',
            description: 'Public',
            componentId: '64ec95f3f31b265d71f75fca',
            poolId: '64ec82b97f838f45b1be0ad1',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: 'COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS',
          params: { componentId: '64ec95f3f31b265d71f75fca', spots: 1 },
        },
        {
          code: 'MAP_RESULTS_TO_DELEGATED_WALLETS',
          params: {
            delegationContract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
          },
        },
      ];

      const state = await allowlistCreator.execute(ops as AllowlistOperation[]);
    },
    60 * 60 * 10000,
  );
});
