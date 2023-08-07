import {
  Alchemy,
  AlchemySettings,
  GetOwnersForContractWithTokenBalancesOptions,
} from 'alchemy-sdk';
import { CollectionOwner } from './collection-owner';

export class AlchemyService {
  constructor(private readonly alchemy: Alchemy) {}

  async getCollectionOwnersInBlock({
    contract,
    block,
  }: {
    contract: string;
    block?: number;
  }): Promise<CollectionOwner[]> {
    const opts: GetOwnersForContractWithTokenBalancesOptions = {
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
            tokenId: BigInt(
              `0x${token.tokenId.replace('0x', '').substring(0, 64)}`,
            ).toString(),
            balance: token.balance,
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
