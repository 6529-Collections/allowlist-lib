import { AllowlistCreator } from '../src/allowlist/allowlist-creator';
import { AllowlistOperation } from '../src/allowlist/allowlist-operation';
import { AllowlistOperationCode } from '../src/allowlist/allowlist-operation-code';
import { Pool } from '../src/app-types';
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
          code: AllowlistOperationCode.CREATE_ALLOWLIST,
          params: {
            id: 'allowlist-1',
            name: 'MEME CARD 95 DISTRIBUTION',
            description: 'Allowlist for meme card 95 distribution',
          },
        },
        {
          code: AllowlistOperationCode.CREATE_TOKEN_POOL,
          params: {
            id: '64d24266e7a722a9506fc72a',
            name: 'The Memes by 6529 C',
            description: 'The Memes by 6529 C',
            contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
            blockNo: 17879170,
            consolidateBlockNo: 17879170,
          },
        },
        {
          code: AllowlistOperationCode.ADD_PHASE,
          params: {
            id: 'phase',
            name: 'phase',
            description: 'phase',
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: 'component',
            phaseId: 'phase',
            name: 'component',
            description: 'component',
          },
        },
        {
          code: AllowlistOperationCode.ADD_ITEM,
          params: {
            id: 'item',
            name: 'item',
            description: 'item',
            componentId: 'component',
            poolId: '64d24266e7a722a9506fc72a',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: AllowlistOperationCode.ITEM_SORT_WALLETS_BY_TOTAL_TOKENS_COUNT,
          params: { itemId: 'item' },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: { componentId: 'component', spots: 1 },
        },
        {
          code: AllowlistOperationCode.MAP_RESULTS_TO_DELEGATED_WALLETS,
          params: {
            delegationContract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
            blockNo: 17879170,
          },
        },
      ];
      const state = await allowlistCreator.execute(ops as AllowlistOperation[]);
    },
    60 * 60 * 10000,
  );
});
