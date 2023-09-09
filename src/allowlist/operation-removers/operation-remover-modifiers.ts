import { setHasAnyOf } from '../../utils/app.utils';
import { AllowlistOperation } from '../allowlist-operation';
import { AllowlistAddComponentParams } from '../operations/add-component/add-component-operation.types';
import { AllowlistAddItemParams } from '../operations/add-item/add-item-operation.types';
import { ComponentAddSpotsToWalletsExcludingCertainComponentsParams } from '../operations/component-add-spots-to-wallets-excluding-certain-components/component-add-spots-to-wallets-excluding-certain-components.types';
import { ItemRemoveWalletsFromCertainComponentsParams } from '../operations/item-remove-wallets-from-certain-components/item-remove-wallets-from-certain-components.types';
import { ItemRemoveWalletsFromCertainTokenPoolsParams } from '../operations/item-remove-wallets-from-certain-token-pools/item-remove-wallets-from-certain-token-pools.types';

export interface OperationModifierParams<T extends AllowlistOperation> {
  targetIds: Set<string>;
  operation: T;
}

export interface OperationModifierResponse<T extends AllowlistOperation> {
  readonly operation: T | null;
  readonly id: string | null;
}

export interface OperationModifier<T extends AllowlistOperation> {
  (params: OperationModifierParams<T>): OperationModifierResponse<T>;
}

export const defaultModifier = <T extends AllowlistOperation>({
  targetIds,
  operation,
}: OperationModifierParams<T>): OperationModifierResponse<T> => {
  const { params } = operation;
  if (params.id && targetIds.has(params.id)) {
    return {
      operation: null,
      id: params.id,
    };
  }
  return {
    operation,
    id: null,
  };
};

export const addComponentModifier = <T extends AllowlistOperation>({
  targetIds,
  operation,
}: OperationModifierParams<T>): OperationModifierResponse<T> => {
  const { params } = operation as { params: AllowlistAddComponentParams };
  const { id: componentId, phaseId } = params;
  if (setHasAnyOf(targetIds, [componentId, phaseId])) {
    return {
      operation: null,
      id: componentId,
    };
  }

  return {
    operation,
    id: null,
  };
};

export const defaultComponentOperationModifier = ({ targetIds, operation }) => {
  const { params } = operation as { params: { componentId: string } };
  const { componentId } = params;
  return {
    operation: targetIds.has(componentId) ? null : operation,
    id: null,
  };
};

export const componentAddSpotsToWalletsExcludingCertainComponentsModifier = ({
  targetIds,
  operation,
}) => {
  const { params } = operation as {
    params: ComponentAddSpotsToWalletsExcludingCertainComponentsParams;
  };

  const { componentId, excludedComponentIds } = params;
  if (targetIds.has(componentId)) {
    return {
      operation: null,
      id: null,
    };
  }

  const modifiedExcludedComponentIds = excludedComponentIds.filter(
    (id) => !targetIds.has(id),
  );

  if (!modifiedExcludedComponentIds.length) {
    return {
      operation: null,
      id: null,
    };
  }

  return {
    operation: {
      ...operation,
      params: {
        ...params,
        excludedComponentIds: modifiedExcludedComponentIds,
      },
    },
    id: null,
  };
};

export const addItemModifier = ({ targetIds, operation }) => {
  const { params } = operation as { params: AllowlistAddItemParams };
  const { id: itemId, componentId, poolId } = params;
  if (setHasAnyOf(targetIds, [itemId, componentId, poolId])) {
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

export const defaultItemOperationModifier = ({ targetIds, operation }) => {
  const { params } = operation as { params: { itemId: string } };
  const { itemId } = params;
  return {
    operation: targetIds.has(itemId) ? null : operation,
    id: null,
  };
};

export const itemRemoveWalletsFromCertainComponentsModifier = ({
  targetIds,
  operation,
}) => {
  const { params } = operation as {
    params: ItemRemoveWalletsFromCertainComponentsParams;
  };

  const { itemId, componentIds } = params;
  if (targetIds.has(itemId)) {
    return {
      operation: null,
      id: null,
    };
  }

  const modifiedComponentIds = componentIds.filter((id) => !targetIds.has(id));

  if (!modifiedComponentIds.length) {
    return {
      operation: null,
      id: null,
    };
  }

  return {
    operation: {
      ...operation,
      params: {
        ...params,
        componentIds: modifiedComponentIds,
      },
    },
    id: null,
  };
};

export const defaultTransferPoolOperationModifier = ({
  targetIds,
  operation,
}) => {
  const { params } = operation as { params: { transferPoolId: string } };
  const { transferPoolId } = params;
  return {
    operation: targetIds.has(transferPoolId) ? null : operation,
    id: null,
  };
};

export const defaultTokenPoolOperationModifier = ({ targetIds, operation }) => {
  const { params } = operation as { params: { tokenPoolId: string } };
  const { tokenPoolId } = params;
  return {
    operation: targetIds.has(tokenPoolId) ? null : operation,
    id: null,
  };
};

export const itemRemoveWalletsFromCertainTokenPoolsModifier = ({
  targetIds,
  operation,
}) => {
  const { params } = operation as {
    params: ItemRemoveWalletsFromCertainTokenPoolsParams;
  };

  const { itemId, pools } = params;
  if (targetIds.has(itemId)) {
    return {
      operation: null,
      id: null,
    };
  }

  const modifiedPools = pools.filter((pool) => !targetIds.has(pool.poolId));

  if (!modifiedPools.length) {
    return {
      operation: null,
      id: null,
    };
  }

  return {
    operation: {
      ...operation,
      params: {
        ...params,
        pools: modifiedPools,
      },
    },
    id: null,
  };
};
