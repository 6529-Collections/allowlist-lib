import axios, { AxiosError } from 'axios';
import { JsonRpcProvider } from 'ethers';
import { AlchemyClient, AlchemyHttpClient } from './alchemy-client';
import { AlchemyService } from './alchemy.service';
import { Time } from '../time';

describe('Alchemy HTTP client', () => {
  afterEach(() => jest.restoreAllMocks());

  it('accepts SDK v2 clients with numeric balances', async () => {
    const legacyClient: AlchemyClient = {
      nft: {
        getOwnersForContract: async () => ({
          owners: [
            {
              ownerAddress: '0xowner',
              tokenBalances: [{ tokenId: '0x0a', balance: 2 }],
            },
          ],
        }),
      },
      core: {
        resolveName: async () => null,
        lookupAddress: async () => null,
      },
    };
    const service = new AlchemyService(legacyClient);
    await expect(
      service.getCollectionOwnersInBlock({ contract: '0xcontract' }),
    ).resolves.toEqual([
      { ownerAddress: '0xowner', tokens: [{ tokenId: '10', balance: 2 }] },
    ]);
  });

  it('preserves the historical endpoint, block and pagination contract', async () => {
    const get = jest.spyOn(axios, 'get');
    get
      .mockResolvedValueOnce({
        data: {
          ownerAddresses: [
            {
              ownerAddress: '0xowner1',
              tokenBalances: [{ tokenId: '0x0a', balance: '2' }],
            },
          ],
          pageKey: 'next-page',
        },
      })
      .mockResolvedValueOnce({
        data: {
          ownerAddresses: [
            {
              ownerAddress: '0xowner2',
              tokenBalances: [{ tokenId: '0xff', balance: '1' }],
            },
          ],
        },
      });
    const service = new AlchemyService(new AlchemyHttpClient('test-key'));

    await expect(
      service.getCollectionOwnersInBlock({
        contract: '0xcontract',
        block: 123,
      }),
    ).resolves.toEqual([
      { ownerAddress: '0xowner1', tokens: [{ tokenId: '10', balance: 2 }] },
      { ownerAddress: '0xowner2', tokens: [{ tokenId: '255', balance: 1 }] },
    ]);
    const endpoint =
      'https://eth-mainnet.g.alchemy.com/nft/v2/test-key/getOwnersForCollection';
    expect(get).toHaveBeenNthCalledWith(1, endpoint, {
      params: {
        contractAddress: '0xcontract',
        withTokenBalances: true,
        block: '123',
        pageKey: undefined,
      },
    });
    expect(get).toHaveBeenNthCalledWith(2, endpoint, {
      params: {
        contractAddress: '0xcontract',
        withTokenBalances: true,
        block: '123',
        pageKey: 'next-page',
      },
    });
  });

  function httpError(status: number): AxiosError {
    return new AxiosError(
      'https://example.com/private-key',
      undefined,
      undefined,
      undefined,
      {
        status,
        statusText: 'failure',
        headers: {},
        data: {},
        config: { headers: undefined },
      },
    );
  }

  it('retries throttled requests and returns the successful page', async () => {
    const sleep = jest.spyOn(Time.prototype, 'sleep').mockResolvedValue();
    const get = jest
      .spyOn(axios, 'get')
      .mockRejectedValueOnce(httpError(429))
      .mockResolvedValueOnce({ data: { ownerAddresses: [] } });
    const client = new AlchemyHttpClient('test-key');
    await expect(
      client.nft.getOwnersForContract('0xcontract', {
        withTokenBalances: true,
      }),
    ).resolves.toEqual({ owners: [], pageKey: undefined });
    expect(get).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledTimes(1);
  });

  it('bounds retries and omits credentials from the final error', async () => {
    const sleep = jest.spyOn(Time.prototype, 'sleep').mockResolvedValue();
    const get = jest.spyOn(axios, 'get').mockRejectedValue(httpError(429));
    const client = new AlchemyHttpClient('private-key');
    await expect(
      client.nft.getOwnersForContract('0xcontract', {
        withTokenBalances: true,
      }),
    ).rejects.toThrow(new Error('Alchemy owners request failed (HTTP 429)'));
    expect(get).toHaveBeenCalledTimes(6);
    expect(sleep).toHaveBeenCalledTimes(5);
  });

  it.each([401, 403, 500])('does not retry HTTP %s', async (status) => {
    const sleep = jest.spyOn(Time.prototype, 'sleep').mockResolvedValue();
    const get = jest.spyOn(axios, 'get').mockRejectedValue(httpError(status));
    const client = new AlchemyHttpClient('private-key');
    await expect(
      client.nft.getOwnersForContract('0xcontract', {
        withTokenBalances: true,
      }),
    ).rejects.toThrow(`Alchemy owners request failed (HTTP ${status})`);
    expect(get).toHaveBeenCalledTimes(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('rejects malformed responses instead of returning an incomplete snapshot', async () => {
    jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: { error: 'unavailable' } });
    const client = new AlchemyHttpClient('private-key');
    await expect(
      client.nft.getOwnersForContract('0xcontract', {
        withTokenBalances: true,
      }),
    ).rejects.toThrow('Alchemy owners request failed');
  });

  it('keeps forward and reverse ENS resolution through the mainnet provider', async () => {
    const resolve = jest
      .spyOn(JsonRpcProvider.prototype, 'resolveName')
      .mockResolvedValue('0xAbC');
    const lookup = jest
      .spyOn(JsonRpcProvider.prototype, 'lookupAddress')
      .mockResolvedValue('example.eth');
    const service = new AlchemyService(new AlchemyHttpClient('test-key'));
    await expect(service.resolveEnsToAddress('example.eth')).resolves.toBe(
      '0xabc',
    );
    await expect(service.resolveAddressToEns('0xabc')).resolves.toBe(
      'example.eth',
    );
    expect(resolve).toHaveBeenCalledWith('example.eth');
    expect(lookup).toHaveBeenCalledWith('0xabc');
  });
});
