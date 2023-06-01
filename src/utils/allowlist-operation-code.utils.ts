import {
  AllowlistOperationCode,
  AllowlistOperationType,
} from '../allowlist/allowlist-operation-code';
import { BadInputError } from '../allowlist/bad-input.error';

export const ALLOWLIST_OPERATION_CODE_TO_TYPE: Record<
  AllowlistOperationCode,
  AllowlistOperationType
> = {
  [AllowlistOperationCode.CREATE_ALLOWLIST]: AllowlistOperationType.OVERALL,
  [AllowlistOperationCode.GET_COLLECTION_TRANSFERS]:
    AllowlistOperationType.TRANSFER_POOLS,
  [AllowlistOperationCode.CREATE_TOKEN_POOL]:
    AllowlistOperationType.TOKEN_POOLS,
  [AllowlistOperationCode.CREATE_CUSTOM_TOKEN_POOL]:
    AllowlistOperationType.CUSTOM_POOLS,
  [AllowlistOperationCode.CREATE_WALLET_POOL]:
    AllowlistOperationType.WALLET_POOLS,
  [AllowlistOperationCode.ADD_PHASE]: AllowlistOperationType.PHASES,
  [AllowlistOperationCode.ADD_COMPONENT]: AllowlistOperationType.COMPONENTS,
  [AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS]:
    AllowlistOperationType.COMPONENT,
  [AllowlistOperationCode.ADD_ITEM]: AllowlistOperationType.ITEMS,
  [AllowlistOperationCode.ITEM_EXCLUE_TOKEN_IDS]: AllowlistOperationType.ITEM,
  [AllowlistOperationCode.ITEM_SELECT_TOKEN_IDS]: AllowlistOperationType.ITEM,
  [AllowlistOperationCode.ITEM_REMOVE_FIRST_N_TOKENS]:
    AllowlistOperationType.ITEM,
  [AllowlistOperationCode.ITEM_REMOVE_LAST_N_TOKENS]:
    AllowlistOperationType.ITEM,
  [AllowlistOperationCode.ITEM_SELECT_FIRST_N_TOKENS]:
    AllowlistOperationType.ITEM,
  [AllowlistOperationCode.ITEM_SELECT_LAST_N_TOKENS]:
    AllowlistOperationType.ITEM,
};

export const getCodesForType = (type: AllowlistOperationType) => {
  if (!Object.values(AllowlistOperationType).includes(type)) {
    throw new BadInputError(`Invalid AllowlistOperationType: ${type}`);
  }
  return Object.entries<AllowlistOperationType>(
    ALLOWLIST_OPERATION_CODE_TO_TYPE,
  )
    .filter(([, t]) => t === type)
    .map(([code]) => code as AllowlistOperationCode);
};
