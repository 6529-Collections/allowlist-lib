import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { AllowlistState } from '../../state-types/allowlist-state';
import {
  TokenPoolParams,
  TokenPoolRawParams,
} from '../../state-types/token-pool';
import { BadInputError } from '../../bad-input.error';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { isValidTokenIds, parseTokenIds } from '../../../utils/app.utils';
import { AllowlistOperationCode } from '../../allowlist-operation-code';
import { AlchemyService } from '../../../services/alchemy.service';
import { CollectionOwner } from '../../../services/collection-owner';

export class CreateTokenPoolOperation implements AllowlistOperationExecutor {
  private logger: Logger;

  constructor(
    loggerFactory: LoggerFactory,
    private readonly alchemyService: AlchemyService,
  ) {
    this.logger = loggerFactory.create(CreateTokenPoolOperation.name);
  }

  validate(params: any): params is TokenPoolParams {
    if (!params.hasOwnProperty('id')) {
      throw new BadInputError('Missing id');
    }

    if (typeof params.id !== 'string') {
      throw new BadInputError('Invalid id');
    }

    if (!params.id.length) {
      throw new BadInputError('Invalid id');
    }

    if (!params.hasOwnProperty('contract')) {
      throw new BadInputError('Missing contract');
    }

    if (typeof params.contract !== 'string') {
      throw new BadInputError('Invalid contract');
    }

    if (!params.contract.length) {
      throw new BadInputError('Invalid contract');
    }

    if (!params.hasOwnProperty('contract')) {
      throw new BadInputError('Missing contract');
    }

    if (params.blockNo === undefined || params.blockNo === null) {
      throw new BadInputError('Invalid blockNo');
    }

    if (typeof params.blockNo !== 'number') {
      throw new BadInputError('Invalid blockNo');
    }

    if (params.blockNo < 0) {
      throw new BadInputError('Invalid blockNo');
    }

    if (
      params.hasOwnProperty('tokenIds') &&
      params.tokenIds !== null &&
      params.tokenIds !== undefined &&
      typeof params.tokenIds !== 'string'
    ) {
      throw new BadInputError('Invalid tokenIds');
    }

    if (typeof params.tokenIds === 'string' && !params.tokenIds.length) {
      throw new BadInputError('Invalid tokenIds');
    }

    if (
      typeof params.tokenIds === 'string' &&
      params.tokenIds.length &&
      !isValidTokenIds(params.tokenIds)
    ) {
      throw new BadInputError('Invalid tokenIds');
    }

    return true;
  }

  async execute({
    params,
    state,
  }: {
    params: TokenPoolParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
    const { id, contract, tokenIds, blockNo } = params;
    const parsedTokenIds = parseTokenIds(
      tokenIds,
      id,
      AllowlistOperationCode.CREATE_TOKEN_POOL,
    );
    const collectionOwners =
      await this.alchemyService.getCollectionOwnersInBlock({
        contract,
        block: blockNo,
      });
    const tokenOwnerships = collectionOwners
      .map<CollectionOwner>((owner) => ({
        ...owner,
        tokens: owner.tokens.filter(
          (token) =>
            !tokenIds?.length || parsedTokenIds.includes(token.tokenId),
        ),
      }))
      .filter((owner) => owner.tokens.length > 0)
      .map((owner) =>
        owner.tokens.map((token) =>
          Array.from({ length: token.balance }, () => ({
            id: token.tokenId,
            owner: owner.ownerAddress,
            contract,
          })),
        ),
      )
      .flat(2);
    state.tokenPools[id] = { ...params, tokens: tokenOwnerships };
    this.logger.info(`Tokenpool ${id} created`);
  }
}
