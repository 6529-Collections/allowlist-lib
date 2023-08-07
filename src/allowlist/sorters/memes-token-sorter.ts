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
    const blockTdhs = await this.getTdhs({ consolidateBlockNo, blockNo });
    return Object.values(wallets)
      .sort((a, d) => {
        const tokensLenDiff = d.tokens.length - a.tokens.length;
        if (tokensLenDiff === 0) {
          return blockTdhs[d.owner] - blockTdhs[a.owner];
        }
        return tokensLenDiff;
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
    const blockTdhs = await this.getTdhs({ consolidateBlockNo, blockNo });
    return Object.values(wallets)
      .sort((a, d) => {
        const uniqueTokensLength = d.uniqueTokens.size - a.uniqueTokens.size;
        if (uniqueTokensLength === 0) {
          return blockTdhs[d.owner] - blockTdhs[a.owner];
        }
        return uniqueTokensLength;
      })
      .flatMap((w) => w.tokens);
  }

  async sortByTdh({
    blockNo,
    consolidateBlockNo,
    tokens,
  }: TdhTokenSorterParams): Promise<AllowlistItemToken[]> {
    const tdhsMap = await this.getTdhs({ consolidateBlockNo, blockNo });

    return tokens.sort((a, d) => {
      const aTdh = tdhsMap[a.owner];
      const dTdh = tdhsMap[d.owner];
      return dTdh - aTdh;
    });
  }

  private async getTdhs({
    consolidateBlockNo,
    blockNo,
  }: {
    consolidateBlockNo: number | null;
    blockNo: number;
  }) {
    return consolidateBlockNo
      ? await this.seizeApi
          .getConsolidatedUploadsForBlock(blockNo)
          .then((res) =>
            res.reduce((acc, cur) => {
              acc[cur.wallet] = cur.boosted_memes_tdh;
              return acc;
            }, {} as Record<string, number>),
          )
      : await this.seizeApi.getUploadsForBlock(blockNo).then((res) =>
          res.reduce((acc, cur) => {
            acc[cur.wallet] = cur.boosted_memes_tdh;
            return acc;
          }, {} as Record<string, number>),
        );
  }
}
