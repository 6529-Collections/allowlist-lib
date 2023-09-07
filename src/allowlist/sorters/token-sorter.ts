import { AllowlistItemToken } from '../state-types/allowlist-item';


export interface UniqueTokenSorterParams {
  tokens: AllowlistItemToken[];
  contract: string | null;
  blockNo: number | null;
  consolidateBlockNo: number | null;
}

export interface TotalTokenSorterParams {
  tokens: AllowlistItemToken[];
  contract: string | null;
  blockNo: number | null;
  consolidateBlockNo: number | null;
}

export interface TdhTokenSorterParams {
  tokens: AllowlistItemToken[];
  blockNo: number | null;
  consolidateBlockNo: number | null;
}

export interface TokenSorter {
  sortByUniqueTokensCount(
    params: UniqueTokenSorterParams,
  ): Promise<AllowlistItemToken[]>;
  sortByTotalTokensCount(
    params: TotalTokenSorterParams,
  ): Promise<AllowlistItemToken[]>;
  sortByTdh(params: TdhTokenSorterParams): Promise<AllowlistItemToken[]>;
}
