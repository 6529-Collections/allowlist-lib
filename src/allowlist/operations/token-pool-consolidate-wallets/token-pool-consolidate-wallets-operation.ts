import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { TokenPoolConsolidateWalletsParams } from './token-pool-consolidate-wallets.types';
import { AllowlistState } from '../../../allowlist/state-types/allowlist-state';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { BadInputError } from '../../bad-input.error';
import { SeizeApi } from '../../../services/seize/seize.api';

export class TokenPoolConsolidateWalletsOperation
  implements AllowlistOperationExecutor
{
  private readonly logger: Logger;

  constructor(
    private readonly seizeApi: SeizeApi,
    loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.create(
      TokenPoolConsolidateWalletsOperation.name,
    );
  }

  validate(params: any): params is TokenPoolConsolidateWalletsParams {
    if (!params.hasOwnProperty('tokenPoolId')) {
      throw new BadInputError('Missing tokenPoolId');
    }

    if (typeof params.tokenPoolId !== 'string') {
      throw new BadInputError('Invalid tokenPoolId');
    }

    if (!params.tokenPoolId.length) {
      throw new BadInputError('Invalid tokenPoolId');
    }

    if (!params.hasOwnProperty('consolidationBlockNumber')) {
      throw new BadInputError('Missing consolidationBlockNumber');
    }

    if (typeof params.consolidationBlockNumber !== 'number') {
      throw new BadInputError('Invalid consolidationBlockNumber');
    }

    if (params.consolidationBlockNumber < 0) {
      throw new BadInputError('Invalid consolidationBlockNumber');
    }

    if (params.consolidationBlockNumber % 1 !== 0) {
      throw new Error('Invalid consolidationBlockNumber');
    }

    return true;
  }

  async execute({
    params,
    state,
  }: {
    params: TokenPoolConsolidateWalletsParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }

    if (!state.tokenPools.hasOwnProperty(params.tokenPoolId)) {
      throw new BadInputError('Token pool not found');
    }

    const consolidations = await this.seizeApi.getAllConsolidations({
      block: params.consolidationBlockNumber,
    });
    const consolidationsMap = consolidations.reduce<Record<string, string>>(
      (acc, curr) => {
        for (const wallet of curr.wallets) {
          acc[wallet] = curr.primary;
        }
        return acc;
      },
      {},
    );

    state.tokenPools[params.tokenPoolId].tokens = state.tokenPools[
      params.tokenPoolId
    ].tokens.map((token) => ({
      ...token,
      owner: consolidationsMap[token.owner] ?? token.owner,
    }));

    this.logger.info('Executed TokenPoolConsolidateWallets operation');
  }
}
