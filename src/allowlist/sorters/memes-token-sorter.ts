import { TokenSorter } from './token-sorter';
import { AllowlistItemToken } from '../state-types/allowlist-item';
import { TdhInfo } from '../../services/seize/tdh-info';

export class MemesTokenSorter implements TokenSorter {
  async sortByTotalTokensCount(
    tokens: AllowlistItemToken[],
  ): Promise<AllowlistItemToken[]> {
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

    return Object.values(wallets)
      .sort((a, d) => d.tokens.length - a.tokens.length)
      .flatMap((w) => w.tokens);
  }

  async sortByUniqueTokensCount(
    tokens: AllowlistItemToken[],
  ): Promise<AllowlistItemToken[]> {
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

    return Object.values(wallets)
      .sort((a, d) => {
        if (d.uniqueTokens.size === a.uniqueTokens.size) {
          return d.tokens.length - a.tokens.length;
        }
        return d.uniqueTokens.size - a.uniqueTokens.size;
      })
      .flatMap((w) => w.tokens);
  }

  async sortByTdh(
    tokens: AllowlistItemToken[],
    tdhs: TdhInfo[],
  ): Promise<AllowlistItemToken[]> {
    const tdhsMap = tdhs.reduce<Record<string, TdhInfo>>((acc, tdh) => {
      acc[tdh.wallet] = tdh;
      return acc;
    }, {});

    const sortedByTdh = tokens.sort((a, d) => {
      const aTdh = tdhsMap[a.owner];
      const dTdh = tdhsMap[d.owner];
      if (!aTdh && !dTdh) {
        return 0;
      }
      if (!aTdh) {
        return 1;
      }
      if (!dTdh) {
        return -1;
      }
      if (dTdh.boosted_memes_tdh === aTdh.boosted_memes_tdh) {
        return dTdh.unique_memes === aTdh.unique_memes
          ? dTdh.memes_balance - aTdh.memes_balance
          : dTdh.unique_memes - aTdh.unique_memes;
      }
      return dTdh.boosted_memes_tdh - aTdh.boosted_memes_tdh;
    });
    return sortedByTdh;
  }
}
