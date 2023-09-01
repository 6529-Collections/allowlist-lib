import {
  TdhTokenSorterParams,
  TokenSorter,
  TotalTokenSorterParams,
  UniqueTokenSorterParams,
} from './token-sorter';
import { AllowlistItemToken } from '../state-types/allowlist-item';
import { SeizeApi } from '../../services/seize/seize.api';

export class MemesTokenSorter implements TokenSorter {
  constructor(private readonly seizeApi: SeizeApi) {}

  async sortByTotalTokensCount({
    blockNo,
    tokens,
    consolidateBlockNo,
  }: TotalTokenSorterParams): Promise<AllowlistItemToken[]> {
    const wallets = tokens.reduce<
      Record<
        string,
        {
          owner: string;
          tokens: AllowlistItemToken[];
        }
      >
    >((acc, token) => {
      if (!acc.hasOwnProperty(token.owner)) {
        acc[token.owner] = {
          owner: token.owner,
          tokens: [],
        };
      }
      acc[token.owner].tokens.push(token);
      return acc;
    }, {});
    const blockTdhs = await this.getTdhs({
      consolidateBlockNo,
      blockNo,
      tokens,
    });
    return Object.values(wallets)
      .sort((a, d) => {
        if (d.tokens.length === a.tokens.length) {
          return blockTdhs[d.owner] - blockTdhs[a.owner];
        }
        return d.tokens.length - a.tokens.length;
      })
      .flatMap((w) => w.tokens);
  }

  async sortByUniqueTokensCount({
    tokens,
    blockNo,
    consolidateBlockNo,
  }: UniqueTokenSorterParams): Promise<AllowlistItemToken[]> {
    const wallets = tokens.reduce<
      Record<
        string,
        {
          owner: string;
          uniqueTokens: Set<string>;
          tokens: AllowlistItemToken[];
        }
      >
    >((acc, token) => {
      if (!acc.hasOwnProperty(token.owner)) {
        acc[token.owner] = {
          owner: token.owner,
          uniqueTokens: new Set(),
          tokens: [],
        };
      }
      acc[token.owner].uniqueTokens.add(token.id);
      acc[token.owner].tokens.push(token);
      return acc;
    }, {});
    const blockTdhs = await this.getTdhs({
      consolidateBlockNo,
      blockNo,
      tokens,
    });
    const sortedResults = Object.values(wallets).sort((a, d) => {
      if (d.uniqueTokens.size === a.uniqueTokens.size) {
        return blockTdhs[d.owner] - blockTdhs[a.owner];
      }
      return d.uniqueTokens.size - a.uniqueTokens.size;
    });
    return sortedResults.flatMap((w) => w.tokens);
  }

  async sortByTdh({
    blockNo,
    consolidateBlockNo,
    tokens,
  }: TdhTokenSorterParams): Promise<AllowlistItemToken[]> {
    const tdhsMap = await this.getTdhs({ consolidateBlockNo, blockNo, tokens });
    tokens.sort((a, d) => (tdhsMap[d.owner] ?? 0) - (tdhsMap[a.owner] ?? 0));
    return tokens;
  }

  private async getTdhs({
    consolidateBlockNo,
    blockNo,
    tokens,
  }: {
    consolidateBlockNo: number | null;
    blockNo: number;
    tokens: AllowlistItemToken[];
  }) {
    const singleSnapshot = await this.seizeApi.getUploadsForBlock(blockNo);
    const singleTdhMap = singleSnapshot.reduce<Record<string, number>>(
      (acc, curr) => {
        acc[curr.wallet] = curr.boosted_memes_tdh;
        return acc;
      },
      {} as Record<string, number>,
    );

    if (!consolidateBlockNo) {
      return singleTdhMap;
    }

    const consolidatedSnapshot =
      await this.seizeApi.getConsolidatedUploadsForBlock(consolidateBlockNo);

    return consolidatedSnapshot.reduce<Record<string, number>>((acc, curr) => {
      let maxTdhWallet = curr.wallets.at(0).toLowerCase();
      for (const wallet of curr.wallets) {
        if (
          (singleTdhMap[wallet.toLowerCase()] ?? 0) >
          (singleTdhMap[maxTdhWallet.toLowerCase()] ?? 0)
        ) {
          maxTdhWallet = wallet.toLowerCase();
        }
      }

      // const walletTokens: Set<string> = new Set();
      // for (const token of tokens) {
      //   if (token.owner.toLowerCase() === maxTdhWallet) {
      //     walletTokens.add(token.id);
      //   }
      // }
      // const totalTdh =
      //   curr.memes.reduce((acc, meme) => {
      //     if (walletTokens.has(meme.id.toString())) {
      //       acc += curr.tdh;
      //     }
      //     return acc;
      // }, 0) * curr.boost;
      acc[maxTdhWallet] = curr.boosted_memes_tdh;
      return acc;
    }, {});
  }
}
