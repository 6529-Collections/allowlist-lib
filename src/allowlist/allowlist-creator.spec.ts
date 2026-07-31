import { Alchemy } from 'alchemy-sdk';
import { AllowlistCreator } from './allowlist-creator';
import { AllowlistCreatorConfig } from './allowlist-creator.config';
import { AllowlistOperationCode } from './allowlist-operation-code';
import { OfacApi } from '../services/screening/listproviders/ofac/ofac.api';

const getBaseConfig = (): AllowlistCreatorConfig => ({
  etherscanApiKey: 'test-etherscan-key',
  alchemy: {} as Alchemy,
  seizeApiPath: 'https://example.com',
  storage: {
    transfersStorage: {} as any,
    tokenPoolStorage: {
      getTokenPoolTokens: jest.fn().mockResolvedValue([
        {
          id: '1',
          contract: '0x123',
          owner: '0xowner',
        },
      ]),
    },
  },
});

describe('AllowlistCreator configuration', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const operations = [
    {
      code: AllowlistOperationCode.CREATE_ALLOWLIST,
      params: {
        id: 'allowlist-1',
        name: 'Allowlist 1',
        description: 'Allowlist 1 description',
      },
    },
    {
      code: AllowlistOperationCode.CREATE_TOKEN_POOL,
      params: {
        id: 'token-pool-1',
        name: 'Token Pool 1',
        description: 'Token Pool 1 description',
        tokenIds: null,
        contract: '0x123',
        blockNo: 123,
        consolidateBlockNo: null,
      },
    },
  ];

  it('skips the OFAC request when the check is explicitly disabled', async () => {
    const getSanctionedWallets = jest
      .spyOn(OfacApi.prototype, 'getSanctionedWallets')
      .mockRejectedValue(new Error('OFAC should not be requested'));
    const creator = AllowlistCreator.getInstance({
      ...getBaseConfig(),
      ofacCheckEnabled: false,
    });

    const state = await creator.execute(operations);

    expect(getSanctionedWallets).not.toHaveBeenCalled();
    expect(state.tokenPools['token-pool-1'].tokens).toHaveLength(1);
  });

  it('defaults the OFAC check to enabled', async () => {
    const getSanctionedWallets = jest
      .spyOn(OfacApi.prototype, 'getSanctionedWallets')
      .mockResolvedValue([]);
    const creator = AllowlistCreator.getInstance(getBaseConfig());

    await creator.execute(operations);

    expect(getSanctionedWallets).toHaveBeenCalledTimes(1);
  });

  it('rejects non-boolean OFAC check values at runtime', () => {
    expect(() =>
      AllowlistCreator.getInstance({
        ...getBaseConfig(),
        ofacCheckEnabled: 'false' as unknown as boolean,
      }),
    ).toThrow('ofacCheckEnabled must be a boolean.');
  });
});
