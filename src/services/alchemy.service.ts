import { AlchemyClient, AlchemyOwnersOptions } from './alchemy-client';
import { CollectionOwner } from './collection-owner';

const UINT256_LIMIT = BigInt(2) ** BigInt(256);

export class AlchemyService {
  constructor(private readonly alchemy: AlchemyClient) {}

  private normalizeTokenId(tokenId: unknown): string {
    if (
      typeof tokenId !== 'string' ||
      !/^(?:\d+|0x[0-9a-f]+)$/i.test(tokenId)
    ) {
      throw new Error('Invalid Alchemy token ID');
    }
    // REST responses may use decimal IDs; only an explicit 0x prefix means hex.
    const value = BigInt(tokenId);
    if (value >= UINT256_LIMIT) {
      throw new Error('Invalid Alchemy token ID');
    }
    return value.toString();
  }

  async getCollectionOwnersInBlock({
    contract,
    block,
  }: {
    contract: string;
    block?: number;
  }): Promise<CollectionOwner[]> {
    const opts: AlchemyOwnersOptions = {
      withTokenBalances: true,
    };
    if (block) {
      opts.block = `${block}`;
    }
    const result: CollectionOwner[] = [];
    let nextPageKey = undefined;
    while (true) {
      const { owners, pageKey } = await this.alchemy.nft.getOwnersForContract(
        contract,
        {
          ...opts,
          pageKey: nextPageKey,
        },
      );
      const newOwners: CollectionOwner[] = owners.map<CollectionOwner>(
        (owner) => ({
          ownerAddress: owner.ownerAddress,
          tokens: owner.tokenBalances.map((token) => ({
            tokenId: this.normalizeTokenId(token.tokenId),
            balance: +token.balance,
          })),
        }),
      );
      result.push(...newOwners);
      if (pageKey) {
        nextPageKey = pageKey;
      } else {
        break;
      }
    }
    return result;
  }

  public async resolveEnsToAddress(ens: string): Promise<string> {
    const address = await this.alchemy.core.resolveName(ens);
    return address?.toLowerCase();
  }

  public async resolveAddressToEns(address: string): Promise<string> {
    return this.alchemy.core.lookupAddress(address);
  }
}
