import { TokenOwnership } from '../allowlist/state-types/token-ownership';
import { Logger, LoggerFactory } from '../logging/logging-emitter';
import { TokenPoolStorage } from './token-pool.storage';

export class JsonFilesTokenPoolStorage implements TokenPoolStorage {
  private readonly logger: Logger;
  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(JsonFilesTokenPoolStorage.name);
  }

  async getTokenPoolTokens(
    tokenPoolId: string,
  ): Promise<TokenOwnership[] | null> {
    return null;
  }
}
