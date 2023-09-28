import { AllowlistOperationExecutor } from '../../allowlist-operation-executor';
import { ItemSelectWalletsOwningTokenIdsParams } from './item-select-wallets-owning-token-ids.types';
import { AllowlistState } from '../../../allowlist/state-types/allowlist-state';
import { Logger, LoggerFactory } from '../../../logging/logging-emitter';
import { BadInputError } from '../../bad-input.error';
import { isValidTokenIds, parseTokenIds } from '../../../utils/app.utils';
import { getItemPath } from '../../../utils/path.utils';
import { AllowlistOperationCode } from '../../allowlist-operation-code';
import { AllowlistItemToken } from '../../state-types/allowlist-item';

export class ItemSelectWalletsOwningTokenIdsOperation
  implements AllowlistOperationExecutor
{
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(
      ItemSelectWalletsOwningTokenIdsOperation.name,
    );
  }

  validate(params: any): params is ItemSelectWalletsOwningTokenIdsParams {
    if (!params.hasOwnProperty('itemId')) {
      throw new BadInputError('Missing itemId');
    }

    if (typeof params.itemId !== 'string') {
      throw new BadInputError('Invalid itemId');
    }

    if (!params.itemId.length) {
      throw new BadInputError('Invalid itemId');
    }

    if (!params.hasOwnProperty('tokenIds')) {
      throw new BadInputError('Missing tokenIds');
    }

    if (typeof params.tokenIds !== 'string') {
      throw new BadInputError('Invalid tokenIds');
    }

    if (!params.tokenIds.length) {
      throw new BadInputError('Invalid tokenIds');
    }

    if (!isValidTokenIds(params.tokenIds)) {
      throw new BadInputError('Invalid tokenIds');
    }
    return true;
  }

  private getOwnersWithAllIds(
    ownerMap: Map<string, Set<string>>,
    filterIds: Set<string>,
  ): Set<string> {
    const owners = new Set<string>();
    for (const [owner, idSet] of ownerMap.entries()) {
      if (
        filterIds.size <= idSet.size &&
        Array.from(filterIds).every((id) => idSet.has(id))
      ) {
        owners.add(owner);
      }
    }
    return owners;
  }

  private filterTokensByOwner(
    tokens: AllowlistItemToken[],
    tokenIds: Set<string>,
  ): AllowlistItemToken[] {
    const ownerMap: Map<string, Set<string>> = tokens.reduce((acc, token) => {
      const { owner, id } = token;
      if (!acc.has(owner)) {
        acc.set(owner, new Set());
      }
      acc.get(owner)?.add(id);
      return acc;
    }, new Map());
    const targetOwners = this.getOwnersWithAllIds(ownerMap, tokenIds);
    return tokens.filter((token) => targetOwners.has(token.owner));
  }

  execute({
    params,
    state,
  }: {
    params: ItemSelectWalletsOwningTokenIdsParams;
    state: AllowlistState;
  }) {
    if (!this.validate(params)) {
      throw new BadInputError('Invalid params');
    }
    const { itemId, tokenIds } = params;
    const { phaseId, componentId } = getItemPath({ state, itemId });
    if (!phaseId || !componentId) {
      throw new BadInputError('Invalid itemId');
    }

    if (typeof tokenIds !== 'string' || !tokenIds?.length) {
      throw new BadInputError('Invalid tokenIds');
    }
    const parsedTokenIds = parseTokenIds(
      tokenIds,
      itemId,
      AllowlistOperationCode.ITEM_SELECT_WALLETS_OWNING_TOKEN_IDS,
    );

    if (!parsedTokenIds?.length) {
      throw new BadInputError('Invalid tokenIds');
    }
    const tokenIdsToSelect = new Set(parsedTokenIds);
    state.phases[phaseId].components[componentId].items[itemId].tokens =
      this.filterTokensByOwner(
        state.phases[phaseId].components[componentId].items[itemId].tokens,
        tokenIdsToSelect,
      );
    this.logger.info('Executed ItemSelectWalletsOwningTokenIds operation');
  }
}
