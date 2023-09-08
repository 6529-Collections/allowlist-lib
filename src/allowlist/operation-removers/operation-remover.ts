// we want to remove items, components, phases
// if we want to remove item, we need to remove all operations that are related to this item
// if we want to remove component, we need to remove all operations that are related to this component
// if we want to remove phase, we need to remove all operations that are related to this phase

import { AllowlistOperation } from '../allowlist-operation';
import { AllowlistOperationCode } from '../allowlist-operation-code';
import { BadInputError } from '../bad-input.error';
import {
  OperationModifier,
  addComponentModifier,
  addItemModifier,
  componentAddSpotsToWalletsExcludingCertainComponentsModifier,
  defaultComponentOperationModifier,
  defaultItemOperationModifier,
  defaultModifier,
  defaultTokenPoolOperationModifier,
  defaultTransferPoolOperationModifier,
  itemRemoveWalletsFromCertainComponentsModifier,
  itemRemoveWalletsFromCertainTokenPoolsModifier,
} from './operation-remover-modifiers';

// there are two questions what needs to be answered for each operation
// 1. is this operation related to the item/component/phase that we want to remove?
// 2. does this operation have id what needs to be counted as removed?
// each remover should answer with operation (modified or not) or null if operation should be removed
// each remover should answer id field, if it's not null, it should be counted as removed

const MODIFIERS: Record<AllowlistOperationCode, OperationModifier> = {
  [AllowlistOperationCode.CREATE_ALLOWLIST]: defaultModifier,
  [AllowlistOperationCode.GET_COLLECTION_TRANSFERS]: defaultModifier,
  [AllowlistOperationCode.CREATE_TOKEN_POOL]: defaultModifier,
  [AllowlistOperationCode.CREATE_CUSTOM_TOKEN_POOL]: defaultModifier,
  [AllowlistOperationCode.CREATE_WALLET_POOL]: defaultModifier,
  [AllowlistOperationCode.ADD_PHASE]: defaultModifier,
  [AllowlistOperationCode.ADD_COMPONENT]: addComponentModifier,
  [AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS]:
    defaultComponentOperationModifier,
  [AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_WALLETS_EXCLUDING_CERTAIN_COMPONENTS]:
    componentAddSpotsToWalletsExcludingCertainComponentsModifier,

  [AllowlistOperationCode.COMPONENT_SELECT_RANDOM_WALLETS]:
    defaultComponentOperationModifier,
  [AllowlistOperationCode.COMPONENT_SELECT_RANDOM_PERCENTAGE_WALLETS]:
    defaultComponentOperationModifier,
  [AllowlistOperationCode.ADD_ITEM]: addItemModifier,
  [AllowlistOperationCode.ITEM_EXCLUE_TOKEN_IDS]: defaultItemOperationModifier,
  [AllowlistOperationCode.ITEM_SELECT_TOKEN_IDS]: defaultItemOperationModifier,
  [AllowlistOperationCode.ITEM_REMOVE_FIRST_N_TOKENS]:
    defaultItemOperationModifier,
  [AllowlistOperationCode.ITEM_REMOVE_LAST_N_TOKENS]:
    defaultItemOperationModifier,
  [AllowlistOperationCode.ITEM_SELECT_FIRST_N_TOKENS]:
    defaultItemOperationModifier,
  [AllowlistOperationCode.ITEM_SELECT_LAST_N_TOKENS]:
    defaultItemOperationModifier,
  [AllowlistOperationCode.ITEM_SORT_WALLETS_BY_TOTAL_TOKENS_COUNT]:
    defaultItemOperationModifier,
  [AllowlistOperationCode.ITEM_SORT_WALLETS_BY_UNIQUE_TOKENS_COUNT]:
    defaultItemOperationModifier,
  [AllowlistOperationCode.ITEM_REMOVE_FIRST_N_WALLETS]:
    defaultItemOperationModifier,
  [AllowlistOperationCode.ITEM_SELECT_FIRST_N_WALLETS]:
    defaultItemOperationModifier,
  [AllowlistOperationCode.ITEM_REMOVE_WALLETS_FROM_CERTAIN_COMPONENTS]:
    itemRemoveWalletsFromCertainComponentsModifier,
  [AllowlistOperationCode.ITEM_SORT_WALLETS_BY_MEMES_TDH]:
    defaultItemOperationModifier,
  [AllowlistOperationCode.TRANSFER_POOL_CONSOLIDATE_WALLETS]:
    defaultTransferPoolOperationModifier,
  [AllowlistOperationCode.TOKEN_POOL_CONSOLIDATE_WALLETS]:
    defaultTokenPoolOperationModifier,
  [AllowlistOperationCode.ITEM_REMOVE_WALLETS_FROM_CERTAIN_TOKEN_POOLS]:
    itemRemoveWalletsFromCertainTokenPoolsModifier,
  [AllowlistOperationCode.MAP_RESULTS_TO_DELEGATED_WALLETS]: defaultModifier,
};

const getModifier = (code: AllowlistOperationCode): OperationModifier => {
  const modifier = MODIFIERS[code];
  if (!modifier) {
    throw new BadInputError(`Unknown operation code: ${code}`);
  }
  return modifier;
};

export const removeEntity = ({
  entityId,
  operations,
}: {
  readonly entityId: string;
  readonly operations: AllowlistOperation[];
}): AllowlistOperation[] => {
  const targetIds = new Set([entityId]);
  const filteredOperations: AllowlistOperation[] = [];
  for (const operation of operations) {
    const { operation: modifiedOperation, id } = getModifier(operation.code)({
      targetIds,
      operation,
    });
    if (modifiedOperation) {
      filteredOperations.push(modifiedOperation);
    }
    if (id) {
      targetIds.add(id);
    }
  }
  return filteredOperations;
};
