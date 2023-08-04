import { AllowlistItemToken } from '../state-types/allowlist-item';
import { TdhInfo } from '../../services/seize/tdh-info';

export interface TokenSorter {
  sortByUniqueTokensCount(
    tokens: AllowlistItemToken[],
  ): Promise<AllowlistItemToken[]>;
  sortByTotalTokensCount(
    tokens: AllowlistItemToken[],
  ): Promise<AllowlistItemToken[]>;
  sortByTdh(
    tokens: AllowlistItemToken[],
    tdhs: TdhInfo[],
  ): Promise<AllowlistItemToken[]>;
}
