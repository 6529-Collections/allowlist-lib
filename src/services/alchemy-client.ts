import axios from 'axios';
import { JsonRpcProvider } from 'ethers';
import { Time } from '../time';

export interface AlchemyOwnersOptions {
  withTokenBalances: true;
  block?: string;
  pageKey?: string;
}

export interface AlchemyOwnersResponse {
  owners: {
    ownerAddress: string;
    tokenBalances: { tokenId: string; balance: number | string }[];
  }[];
  pageKey?: string;
}

/** The subset of the Alchemy SDK used by the library; SDK v2 clients also fit. */
export interface AlchemyClient {
  nft: {
    getOwnersForContract(
      contractAddress: string,
      options: AlchemyOwnersOptions,
    ): Promise<AlchemyOwnersResponse>;
  };
  core: {
    resolveName(name: string): Promise<string | null>;
    lookupAddress(address: string): Promise<string | null>;
  };
}

/** Default mainnet client without the archived Alchemy SDK dependency tree. */
export class AlchemyHttpClient implements AlchemyClient {
  private provider?: JsonRpcProvider;

  constructor(private readonly apiKey: string) {}

  readonly nft = {
    getOwnersForContract: (
      contractAddress: string,
      options: AlchemyOwnersOptions,
    ): Promise<AlchemyOwnersResponse> =>
      this.getOwners(contractAddress, options),
  };

  readonly core = {
    resolveName: (name: string) => this.getProvider().resolveName(name),
    lookupAddress: (address: string) =>
      this.getProvider().lookupAddress(address),
  };

  private getProvider(): JsonRpcProvider {
    this.provider ??= new JsonRpcProvider(
      `https://eth-mainnet.g.alchemy.com/v2/${encodeURIComponent(this.apiKey)}`,
      'mainnet',
      { staticNetwork: true },
    );
    return this.provider;
  }

  private async getOwners(
    contractAddress: string,
    options: AlchemyOwnersOptions,
  ): Promise<AlchemyOwnersResponse> {
    // Preserve the v2 endpoint and response used by existing historical snapshots.
    const endpoint = `https://eth-mainnet.g.alchemy.com/nft/v2/${encodeURIComponent(
      this.apiKey,
    )}/getOwnersForCollection`;
    for (let attempt = 0; ; attempt++) {
      try {
        const { data } = await axios.get<{
          ownerAddresses: AlchemyOwnersResponse['owners'];
          pageKey?: string;
        }>(endpoint, { params: { ...options, contractAddress } });
        if (!Array.isArray(data.ownerAddresses)) {
          throw new Error('Invalid Alchemy owners response');
        }
        return { owners: data.ownerAddresses, pageKey: data.pageKey };
      } catch (error) {
        const status = axios.isAxiosError(error)
          ? error.response?.status
          : undefined;
        // Match the SDK's bounded retries for rate-limited NFT API requests.
        if (status === 429 && attempt < 5) {
          await Time.seconds(2 ** attempt).sleep();
          continue;
        }
        // Axios errors contain the API key in their URL. Do not expose it.
        throw new Error(
          `Alchemy owners request failed${status ? ` (HTTP ${status})` : ''}`,
        );
      }
    }
  }
}
