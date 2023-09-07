// we want to remove items, components, phases
// if we want to remove item, we need to remove all operations that are related to this item
// if we want to remove component, we need to remove all operations that are related to this component
// if we want to remove phase, we need to remove all operations that are related to this phase

import { AllowlistOperation } from '../allowlist-operation';
import { AllowlistOperationCode } from '../allowlist-operation-code';
import { BadInputError } from '../bad-input.error';
import { AllowlistAddItemParams } from '../operations/add-item/add-item-operation.types';
import { ItemExcludeTokenIdsParams } from '../operations/item-exclude-token-ids/item-exclude-token-ids.types';

// there are two questions what needs to be answered for each operation
// 1. is this operation related to the item/component/phase that we want to remove?
// 2. does this operation have id what needs to be counted as removed?
// each remover should answer with operation (modified or not) or null if operation should be removed
// each remover should answer id field, if it's not null, it should be counted as removed

interface OperationModifierParams {
  targetIds: Set<string>;
  operation: AllowlistOperation;
}

interface OperationModifierResponse {
  readonly operation: AllowlistOperation | null;
  readonly id: string | null;
}

interface OperationModifier {
  (params: OperationModifierParams): OperationModifierResponse;
}

const defaultModifier: OperationModifier = ({ targetIds, operation }) => ({
  operation,
  id: null,
});

const addItem: OperationModifier = ({ targetIds, operation }) => {
  const { params } = operation as { params: AllowlistAddItemParams };
  const { id: itemId, componentId, poolId } = params;
  if (targetIds.has(itemId)) {
    return {
      operation: null,
      id: itemId,
    };
  }

  if (targetIds.has(componentId)) {
    return {
      operation: null,
      id: itemId,
    };
  }

  if (targetIds.has(poolId)) {
    return {
      operation: null,
      id: itemId,
    };
  }

  return {
    operation,
    id: null,
  };
};

const itemExcludeTokenIds: OperationModifier = ({ targetIds, operation }) => {
  const { params } = operation as { params: ItemExcludeTokenIdsParams };
  const { itemId } = params;
  if (targetIds.has(itemId)) {
    return {
      operation: null,
      id: null,
    };
  }

  return {
    operation,
    id: null,
  };
};

const MODIFIERS: Record<AllowlistOperationCode, OperationModifier> = {
  [AllowlistOperationCode.CREATE_ALLOWLIST]: defaultModifier,
  [AllowlistOperationCode.GET_COLLECTION_TRANSFERS]: defaultModifier,
  [AllowlistOperationCode.CREATE_TOKEN_POOL]: defaultModifier,
  [AllowlistOperationCode.CREATE_CUSTOM_TOKEN_POOL]: defaultModifier,
  [AllowlistOperationCode.CREATE_WALLET_POOL]: defaultModifier,
  [AllowlistOperationCode.ADD_PHASE]: defaultModifier,
  [AllowlistOperationCode.ADD_COMPONENT]: defaultModifier,
  [AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS]:
    defaultModifier,
  [AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_WALLETS_EXCLUDING_CERTAIN_COMPONENTS]:
    defaultModifier,
  [AllowlistOperationCode.COMPONENT_SELECT_RANDOM_WALLETS]: defaultModifier,
  [AllowlistOperationCode.COMPONENT_SELECT_RANDOM_PERCENTAGE_WALLETS]:
    defaultModifier,
  [AllowlistOperationCode.ADD_ITEM]: addItem,
  [AllowlistOperationCode.ITEM_EXCLUE_TOKEN_IDS]: itemExcludeTokenIds,
  [AllowlistOperationCode.ITEM_SELECT_TOKEN_IDS]: defaultModifier,
  [AllowlistOperationCode.ITEM_REMOVE_FIRST_N_TOKENS]: defaultModifier,
  [AllowlistOperationCode.ITEM_REMOVE_LAST_N_TOKENS]: defaultModifier,
  [AllowlistOperationCode.ITEM_SELECT_FIRST_N_TOKENS]: defaultModifier,
  [AllowlistOperationCode.ITEM_SELECT_LAST_N_TOKENS]: defaultModifier,
  [AllowlistOperationCode.ITEM_SORT_WALLETS_BY_TOTAL_TOKENS_COUNT]:
    defaultModifier,
  [AllowlistOperationCode.ITEM_SORT_WALLETS_BY_UNIQUE_TOKENS_COUNT]:
    defaultModifier,
  [AllowlistOperationCode.ITEM_REMOVE_FIRST_N_WALLETS]: defaultModifier,
  [AllowlistOperationCode.ITEM_SELECT_FIRST_N_WALLETS]: defaultModifier,
  [AllowlistOperationCode.ITEM_REMOVE_WALLETS_FROM_CERTAIN_COMPONENTS]:
    defaultModifier,
  [AllowlistOperationCode.ITEM_SORT_WALLETS_BY_MEMES_TDH]: defaultModifier,
  [AllowlistOperationCode.TRANSFER_POOL_CONSOLIDATE_WALLETS]: defaultModifier,
  [AllowlistOperationCode.TOKEN_POOL_CONSOLIDATE_WALLETS]: defaultModifier,
  [AllowlistOperationCode.ITEM_REMOVE_WALLETS_FROM_CERTAIN_TOKEN_POOLS]:
    defaultModifier,
  [AllowlistOperationCode.MAP_RESULTS_TO_DELEGATED_WALLETS]: defaultModifier,
};

const getModifier = (code: AllowlistOperationCode): OperationModifier => {
  const modifier = MODIFIERS[code];
  if (!modifier) {
    throw new BadInputError(`Unknown operation code: ${code}`);
  }
  return modifier;
};

const removeItem = ({
  itemId,
  operations,
}: {
  readonly itemId: string;
  readonly operations: AllowlistOperation[];
}): AllowlistOperation[] => {
  return operations;
};
