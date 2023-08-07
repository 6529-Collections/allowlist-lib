import { TokenOwnership } from '../allowlist/state-types/token-ownership';
import { Logger, LoggerFactory } from '../logging/logging-emitter';
import { TokenPoolStorage } from './token-pool.storage';

export class TokenPoolService {
  private logger: Logger;

  constructor(
    private readonly tokenPoolStorage: TokenPoolStorage,
    loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.create(TokenPoolService.name);
  }

  async getTokenPoolTokens(tokenPoolId: string): Promise<TokenOwnership[]> {
    return await this.tokenPoolStorage.getTokenPoolTokens(tokenPoolId);
  }
}
