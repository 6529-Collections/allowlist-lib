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
    'TEST',
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
          code: AllowlistOperationCode.CREATE_TOKEN_POOL,
          params: {
            id: 'token-pool-1',
            name: '6529 Meme Cards 1 to 94',
            description: 'Meme Cards 1 to 94',
            tokenIds: '1-94',
            contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
            blockNo: 17684111,
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
          code: AllowlistOperationCode.ITEM_SORT_WALLETS_BY_MEMES_TDH,
          params: {
            itemId: 'item-1',
            tdhBlockNumber: 17684111,
          },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: {
            componentId: 'component-1',
            spots: 1,
          },
        },
      ];
      await allowlistCreator.execute(operations);
    },
    60 * 60 * 1000,
  );
});
