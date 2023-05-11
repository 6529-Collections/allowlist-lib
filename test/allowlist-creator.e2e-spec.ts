import { AllowlistCreator } from '../src/allowlist/allowlist-creator';
import { AllowlistOperation } from '../src/allowlist/allowlist-operation';
import { AllowlistOperationCode } from '../src/allowlist/allowlist-operation-code';

describe('AllowlistCreator e2e tests', () => {
  let allowlistCreator: AllowlistCreator;

  beforeEach(async () => {
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
    if (!etherscanApiKey) {
      throw new Error('Environment variable ETHERSCAN_API_KEY is not defined');
    }
    allowlistCreator = AllowlistCreator.getInstance({
      etherscanApiKey: etherscanApiKey,
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
            name: 'Automatic Aidrops (97 out of 508)',
            description: 'Automatic airdrops of 97 meme cards',
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
          },
        },
      ];
      await allowlistCreator.execute(operations);
    },
    60 * 60 * 1000,
  );
});
