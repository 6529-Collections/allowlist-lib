import { AllowlistPhase } from './allowlist-phase';
import { WalletPool } from './wallet-pool';
import { TokenPool } from './token-pool';
import { DescribableEntity } from './describable-entity';
import { TransferPool } from '../operations/get-collection-transfers/get-collection-transfers-operation.types';
import { CustomTokenPool } from './custom-token-pool';

export interface AllowlistState {
  allowlist: DescribableEntity | null;
  readonly transferPools: Record<string, TransferPool>;
  readonly tokenPools: Record<string, TokenPool>;
  readonly customTokenPools: Record<string, CustomTokenPool>;
  readonly walletPools: Record<string, WalletPool>;
  readonly phases: Record<string, AllowlistPhase>;
}

export function createAllowlistState(): AllowlistState {
  return {
    allowlist: null,
    transferPools: {},
    tokenPools: {},
    customTokenPools: {},
    walletPools: {},
    phases: {},
  };
}
