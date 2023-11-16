import { TokenOwnership } from '../allowlist/state-types/token-ownership';
import { LoggerFactory } from '../logging/logging-emitter';
import { TokenPoolStorage } from './token-pool.storage';

export class JsonFilesTokenPoolStorage implements TokenPoolStorage {
  constructor(_: LoggerFactory) {
    // nothing
  }

  async getTokenPoolTokens(_: string): Promise<TokenOwnership[] | null> {
    return null;
  }
}
