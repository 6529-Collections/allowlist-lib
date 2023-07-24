import { TokenOwnership } from '../allowlist/state-types/token-ownership';

export interface TokenPoolStorage {
  getTokenPoolTokens(tokenPoolId: string): Promise<TokenOwnership[] | null>;
}
