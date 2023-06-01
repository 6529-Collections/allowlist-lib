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

export const ALLOWLIST_CODE_DESCRIPTIONS: Record<
  AllowlistOperationCode,
  {
    title: string;
    description: string;
  }
> = {
  [AllowlistOperationCode.CREATE_ALLOWLIST]: {
    title: 'Create Allowlist',
    description: 'Create a new allowlist',
  },
  [AllowlistOperationCode.GET_COLLECTION_TRANSFERS]: {
    title: 'Get Collection Transfers',
    description: 'Get all transfers for a collection',
  },
  [AllowlistOperationCode.CREATE_TOKEN_POOL]: {
    title: 'Create Token Pool',
    description: 'Create a new token pool',
  },
  [AllowlistOperationCode.CREATE_CUSTOM_TOKEN_POOL]: {
    title: 'Create Custom Token Pool',
    description: 'Create a new custom token pool',
  },
  [AllowlistOperationCode.CREATE_WALLET_POOL]: {
    title: 'Create Wallet Pool',
    description: 'Create a new wallet pool',
  },
  [AllowlistOperationCode.ADD_PHASE]: {
    title: 'Add Phase',
    description: 'Add a new phase to a allowlist',
  },
  [AllowlistOperationCode.ADD_COMPONENT]: {
    title: 'Add Component',
    description: 'Add a new component to a phase',
  },
  [AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS]: {
    title: 'Add Spots to All Item Wallets',
    description: 'Add spots to all item wallets in a component',
  },
  [AllowlistOperationCode.ADD_ITEM]: {
    title: 'Add Item',
    description: 'Add a new item to a component',
  },
  [AllowlistOperationCode.ITEM_EXCLUE_TOKEN_IDS]: {
    title: 'Exclude Token IDs',
    description: 'Exclude token IDs from an item',
  },
  [AllowlistOperationCode.ITEM_SELECT_TOKEN_IDS]: {
    title: 'Select Token IDs',
    description: 'Select token IDs from an item',
  },
  [AllowlistOperationCode.ITEM_REMOVE_FIRST_N_TOKENS]: {
    title: 'Remove First N Tokens',
    description: 'Remove first N tokens from an item',
  },
  [AllowlistOperationCode.ITEM_REMOVE_LAST_N_TOKENS]: {
    title: 'Remove Last N Tokens',
    description: 'Remove last N tokens from an item',
  },
  [AllowlistOperationCode.ITEM_SELECT_FIRST_N_TOKENS]: {
    title: 'Select First N Tokens',
    description: 'Select first N tokens from an item',
  },
  [AllowlistOperationCode.ITEM_SELECT_LAST_N_TOKENS]: {
    title: 'Select Last N Tokens',
    description: 'Select last N tokens from an item',
  },
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
