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
  [AllowlistOperationCode.TRANSFER_POOL_CONSOLIDATE_WALLETS]:
    AllowlistOperationType.TRANSFER_POOL,
  [AllowlistOperationCode.CREATE_TOKEN_POOL]:
    AllowlistOperationType.TOKEN_POOLS,
  [AllowlistOperationCode.CREATE_TOKEN_POOL_RAW]:
    AllowlistOperationType.TOKEN_POOLS,
  [AllowlistOperationCode.TOKEN_POOL_CONSOLIDATE_WALLETS]:
    AllowlistOperationType.TOKEN_POOL,
  [AllowlistOperationCode.CREATE_CUSTOM_TOKEN_POOL]:
    AllowlistOperationType.CUSTOM_POOLS,
  [AllowlistOperationCode.CREATE_WALLET_POOL]:
    AllowlistOperationType.WALLET_POOLS,
  [AllowlistOperationCode.ADD_PHASE]: AllowlistOperationType.PHASES,
  [AllowlistOperationCode.ADD_COMPONENT]: AllowlistOperationType.COMPONENTS,
  [AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS]:
    AllowlistOperationType.COMPONENT,
  [AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_WALLETS_EXCLUDING_CERTAIN_COMPONENTS]:
    AllowlistOperationType.COMPONENT,
  [AllowlistOperationCode.COMPONENT_SELECT_RANDOM_WALLETS]:
    AllowlistOperationType.COMPONENT,
  [AllowlistOperationCode.COMPONENT_SELECT_RANDOM_PERCENTAGE_WALLETS]:
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
  [AllowlistOperationCode.ITEM_SORT_WALLETS_BY_TOTAL_TOKENS_COUNT]:
    AllowlistOperationType.ITEM,
  [AllowlistOperationCode.ITEM_SORT_WALLETS_BY_UNIQUE_TOKENS_COUNT]:
    AllowlistOperationType.ITEM,
  [AllowlistOperationCode.ITEM_SORT_WALLETS_BY_MEMES_TDH]:
    AllowlistOperationType.ITEM,
  [AllowlistOperationCode.ITEM_REMOVE_FIRST_N_WALLETS]:
    AllowlistOperationType.ITEM,
  [AllowlistOperationCode.ITEM_SELECT_FIRST_N_WALLETS]:
    AllowlistOperationType.ITEM,
  [AllowlistOperationCode.ITEM_REMOVE_WALLETS_FROM_CERTAIN_COMPONENTS]:
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
  [AllowlistOperationCode.TRANSFER_POOL_CONSOLIDATE_WALLETS]: {
    title: 'Consolidate Wallets',
    description: 'Consolidate wallets in a transfer pool',
  },
  [AllowlistOperationCode.CREATE_TOKEN_POOL]: {
    title: 'Create Token Pool',
    description: 'Create a new token pool ',
  },
  [AllowlistOperationCode.CREATE_TOKEN_POOL_RAW]: {
    title: 'Create Token Pool',
    description: 'Create a new token pool based on a transfer pool',
  },
  [AllowlistOperationCode.TOKEN_POOL_CONSOLIDATE_WALLETS]: {
    title: 'Consolidate Wallets',
    description: 'Consolidate wallets in a token pool',
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
  [AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_WALLETS_EXCLUDING_CERTAIN_COMPONENTS]:
    {
      title: 'Add Spots to All Item Wallets Excluding Certain Components',
      description:
        'Add spots to all item wallets in a component excluding certain components',
    },

  [AllowlistOperationCode.COMPONENT_SELECT_RANDOM_WALLETS]: {
    title: 'Select Random Wallets',
    description: 'Select random wallets from a component',
  },
  [AllowlistOperationCode.COMPONENT_SELECT_RANDOM_PERCENTAGE_WALLETS]: {
    title: 'Select Random Percentage Wallets',
    description: 'Select random percentage wallets from a component',
  },
  [AllowlistOperationCode.ITEM_SORT_WALLETS_BY_TOTAL_TOKENS_COUNT]: {
    title: 'Sort Wallets by Total Tokens Count',
    description: 'Sort wallets by total tokens count in an item',
  },
  [AllowlistOperationCode.ITEM_SORT_WALLETS_BY_UNIQUE_TOKENS_COUNT]: {
    title: 'Sort Wallets by Unique Tokens Count',
    description: 'Sort wallets by unique tokens count in an item',
  },
  [AllowlistOperationCode.ITEM_SORT_WALLETS_BY_MEMES_TDH]: {
    title: 'Sort Wallets by Memes TDH',
    description: 'Sort wallets by memes TDH in an item',
  },
  [AllowlistOperationCode.ITEM_REMOVE_FIRST_N_WALLETS]: {
    title: 'Remove First N Wallets',
    description: 'Remove first N wallets from an item',
  },
  [AllowlistOperationCode.ITEM_SELECT_FIRST_N_WALLETS]: {
    title: 'Select First N Wallets',
    description: 'Select first N wallets from an item',
  },
  [AllowlistOperationCode.ITEM_REMOVE_WALLETS_FROM_CERTAIN_COMPONENTS]: {
    title: 'Remove Wallets from Certain Components',
    description: 'Remove wallets from certain components in an item',
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
