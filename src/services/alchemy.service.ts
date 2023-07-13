import {
  Alchemy,
  AlchemyConfig,
  AlchemySettings,
  GetOwnersForContractWithTokenBalancesOptions,
} from 'alchemy-sdk';
import { CollectionOwner } from './collection-owner';

export class AlchemyService {
  private readonly alchemy: Alchemy;

  constructor(config: AlchemySettings) {
    this.alchemy = new Alchemy(config);
  }

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
            tokenId: +token.tokenId,
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
}
