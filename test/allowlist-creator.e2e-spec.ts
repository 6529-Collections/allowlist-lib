import { AllowlistCreator } from '../src/allowlist/allowlist-creator';
import { AllowlistOperation } from '../src/allowlist/allowlist-operation';
import { AllowlistOperationCode } from '../src/allowlist/allowlist-operation-code';
import axios from 'axios';
import * as fs from 'fs';
import { ConsolidatedTdhInfo } from '../src/services/seize/tdh-info';

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
});
