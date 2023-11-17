import { TokenOwnership } from '../allowlist/state-types/token-ownership';
import { TokenPoolStorage } from './token-pool.storage';

export class JsonFilesTokenPoolStorage implements TokenPoolStorage {
  async getTokenPoolTokens(_: string): Promise<TokenOwnership[] | null> {
    return null;
  }
}
