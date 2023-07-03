import { AllowlistPhase } from './allowlist-phase';
import { AllowlistState } from './allowlist-state';
import { AllowlistComponent } from './allowlist-component';
import { AllowlistItem, AllowlistItemToken } from './allowlist-item';
import { DescribableEntity } from './describable-entity';
import { TokenPool } from './token-pool';
import { TransferPool } from '../operations/get-collection-transfers/get-collection-transfers-operation.types';
import { WalletPool } from './wallet-pool';
import { Transfer } from './transfer';
import { TokenOwnership } from './token-ownership';
import { CustomTokenOwnership, CustomTokenPool } from './custom-token-pool';
import { Pool } from '../../app-types';

export function anAllowlistItemToken(params?: {
  id?: string;
  owner?: string;
  since?: number;
}): AllowlistItemToken {
  return {
    id: params?.id ?? aTokenOwnership().id,
    owner: params?.owner ?? aTokenOwnership().owner,
    since: params?.since ?? aTokenOwnership().since,
  };
}

export function anAllowlistItem(params?: {
  id?: string;
  name?: string;
  description?: string;
  poolId?: string;
  poolType?: Pool;
  tokens?: AllowlistItemToken[];
  _insertionOrder?: number;
}): AllowlistItem {
  return {
    id: params?.id || 'item-1',
    name: params?.name || 'item 1',
    description: params?.description || 'item 1 description',
    poolId: params?.poolId || aTokenPool().id,
    poolType: params?.poolType || Pool.TOKEN_POOL,
    tokens: params?.tokens ?? [anAllowlistItemToken()],
    _insertionOrder: params?._insertionOrder || 0,
  };
}

export function anAllowlistWinner(params?: {
  id?: string;
  count?: number;
}): Record<string, number> {
  return {
    [params?.id || aTokenOwnership().owner]: params?.count || 1,
  };
}

export function anAllowlistComponent(params?: {
  id?: string;
  name?: string;
  description?: string;
  items?: AllowlistItem[];
  winners?: Record<string, number>;
  _insertionOrder?: number;
}): AllowlistComponent {
  return {
    id: params?.id || 'component-1',
    name: params?.name || 'Component 1',
    description: params?.description || 'Component 1 description',
    items: (params?.items || [anAllowlistItem()]).reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {} as Record<string, AllowlistItem>),
    winners: params?.winners || anAllowlistWinner(),
    _insertionOrder: params?._insertionOrder || 0,
  };
}

export function anAllowlistPhase(params?: {
  id?: string;
  name?: string;
  description?: string;
  components?: AllowlistComponent[];
}): AllowlistPhase {
  return {
    id: params?.id || 'phase-1',
    name: params?.name || 'Phase 1',
    description: params?.description || 'Phase 1 description',
    components: (params?.components || [anAllowlistComponent()]).reduce(
      (acc, cur) => {
        acc[cur.id] = cur;
        return acc;
      },
      {} as Record<string, AllowlistComponent>,
    ),
    _insertionOrder: 0,
  };
}

export const anEmptyPhase = () => anAllowlistPhase({ components: [] });

export const anAllowList: (param?: {
  id?: string;
  name?: string;
  description?: string;
}) => DescribableEntity = (param) => ({
  id: param?.id ?? 'allowlist-1',
  name: param?.name ?? 'Allowlist 1',
  description: param?.description ?? 'Allowlist 1 description',
});

const aTransfer: (param?: {
  contract?: string;
  tokenID?: string;
  blockNumber?: number;
  timeStamp?: number;
  logIndex?: number;
  from?: string;
  to?: string;
  amount?: number;
  transactionHash?: string;
  transactionIndex?: number;
}) => Transfer = (param) => ({
  blockNumber: param?.blockNumber ?? 10,
  contract: param?.contract ?? '0x33fd426905f149f8376e227d0c9d3340aad17af1',
  tokenID: param?.tokenID ?? '10',
  timeStamp: param?.timeStamp ?? 100,
  logIndex: param?.blockNumber ?? 0,
  from: param?.from ?? '0x47936e86f266901dbe5179c58f1d34852dddef75',
  to: param?.to ?? '0x152afd373a91d0cb04132c80cf24d26f1e3fc0a9',
  amount: param?.amount ?? 1,
  transactionHash: param?.transactionHash ?? '0x0000000',
  transactionIndex: param?.transactionIndex ?? 0,
});

export const aTransferPool: (param?: {
  id?: string;
  name?: string;
  description?: string;
  contract?: string;
  blockNo?: number;
  transfers?: Transfer[];
}) => TransferPool = (params) => ({
  id: params?.id ?? 'transfer-pool-1',
  name: params?.name ?? 'Transfer Pool 1',
  description: params?.description ?? 'Transfer Pool 1 description',
  contract: params?.contract ?? '0x33fd426905f149f8376e227d0c9d3340aad17af1',
  blockNo: params?.blockNo ?? 999,
  transfers: params?.transfers ?? [aTransfer()],
});

export const aTokenOwnership: (param?: {
  id?: string;
  contract?: string;
  owner?: string;
  since?: number;
}) => TokenOwnership = (param) => ({
  id: param?.id ?? '10',
  contract: param?.contract ?? '0x33fd426905f149f8376e227d0c9d3340aad17af1',
  owner: param?.owner ?? '0x152afd373a91d0cb04132c80cf24d26f1e3fc0a9',
  since: param?.since ?? 100,
});

export const aCustomTokenOwnership: (param?: {
  id?: string;
  owner?: string;
  since?: number;
}) => CustomTokenOwnership = (param) => ({
  id: param?.id ?? '10',
  owner: param?.owner ?? '0x152afd373a91d0cb04132c80cf24d26f1e3fc0a9',
  since: param?.since ?? 100,
});

export const aTokenPool: (param?: {
  id?: string;
  name?: string;
  description?: string;
  tokens?: TokenOwnership[];
  transferPoolId?: string;
  tokenIds?: string;
}) => TokenPool = (param) => ({
  id: param?.id ?? 'token-pool-1',
  name: param?.name ?? 'Token Pool 1',
  description: param?.description ?? 'Token Pool 1 description',
  transferPoolId: param?.transferPoolId ?? aTransferPool().id,
  tokenIds: param?.tokenIds ?? '10,20-30,40',
  tokens: param?.tokens ?? [aTokenOwnership()],
});

export const aCustomTokenPool: (param?: {
  id?: string;
  name?: string;
  description?: string;
  tokens?: CustomTokenOwnership[];
}) => CustomTokenPool = (param) => ({
  id: param?.id ?? 'custom-token-pool-1',
  name: param?.name ?? 'Custom Token Pool 1',
  description: param?.description ?? 'Custom Token Pool 1 description',
  tokens: param?.tokens ?? [aCustomTokenOwnership()],
});

export const aWalletPool: (param?: {
  id?: string;
  name?: string;
  description?: string;
  wallets?: string[];
}) => WalletPool = (param) => ({
  id: param?.id ?? 'wallet-pool-1',
  name: param?.name ?? 'Wallet Pool 1',
  description: param?.description ?? 'Wallet Pool 1 description',
  wallets: param?.wallets ?? ['0x152afd373a91d0cb04132c80cf24d26f1e3fc0a9'],
});

export function anAllowlistState(params?: {
  phases?: AllowlistPhase[];
  allowlist?: DescribableEntity;
  tokenPools?: TokenPool[];
  customTokenPools?: CustomTokenPool[];
  transferPools?: TransferPool[];
  walletPools?: WalletPool[];
}): AllowlistState {
  return structuredClone({
    allowlist: params?.allowlist || anAllowList(),
    tokenPools: (params?.tokenPools || [aTokenPool()]).reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {} as Record<string, TokenPool>),
    customTokenPools: (params?.customTokenPools || [aCustomTokenPool()]).reduce(
      (acc, cur) => {
        acc[cur.id] = cur;
        return acc;
      },
      {} as Record<string, CustomTokenPool>,
    ),
    walletPools: (params?.walletPools || [aWalletPool()]).reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {} as Record<string, WalletPool>),
    phases: (params?.phases || [anAllowlistPhase()]).reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {} as Record<string, AllowlistPhase>),
    transferPools: (params?.transferPools || [aTransferPool()]).reduce(
      (acc, cur) => {
        acc[cur.id] = cur;
        return acc;
      },
      {} as Record<string, TransferPool>,
    ),
  });
}
