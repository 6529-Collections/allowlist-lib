import {
  TdhTokenSorterParams,
  TokenSorter,
  TotalTokenSorterParams,
  UniqueTokenSorterParams,
} from './token-sorter';
import { AllowlistItemToken } from '../state-types/allowlist-item';

export class SimpleTokenSorter implements TokenSorter {
  async sortByTotalTokensCount({
    tokens,
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

    return Object.values(wallets)
      .sort((a, d) => d.tokens.length - a.tokens.length)
      .flatMap((w) => w.tokens);
  }

  async sortByUniqueTokensCount({
    tokens,
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

    return Object.values(wallets)
      .sort((a, d) => {
        if (d.uniqueTokens.size === a.uniqueTokens.size) {
          return d.tokens.length - a.tokens.length;
        }
        return d.uniqueTokens.size - a.uniqueTokens.size;
      })
      .flatMap((w) => w.tokens);
  }

  async sortByTdh({}: TdhTokenSorterParams): Promise<AllowlistItemToken[]> {
    throw new Error('Method not implemented in SimpleTokenSorter');
  }
}
