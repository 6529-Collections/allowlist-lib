import { AllowlistPhase } from './allowlist-phase';
import { WalletPool } from './wallet-pool';
import { TokenPool } from './token-pool';
import { DescribableEntity } from './describable-entity';
import { TransferPool } from '../operations/get-collection-transfers/get-collection-transfers-operation.types';
import { CustomTokenPool } from './custom-token-pool';
import { SimpleTokenSorter } from '../sorters/simple-token-sorter';
import { TokenSorter } from '../sorters/token-sorter';
import { MemesTokenSorter } from '../sorters/memes-token-sorter';
import { MEMES_CONTRACT } from '../../app-types';
import { AlchemyService } from '../../services/alchemy.service';
import { SeizeApi } from '../../services/seize/seize.api';

export interface AllowlistState {
  allowlist: DescribableEntity | null;
  readonly transferPools: Record<string, TransferPool>;
  readonly tokenPools: Record<string, TokenPool>;
  readonly customTokenPools: Record<string, CustomTokenPool>;
  readonly walletPools: Record<string, WalletPool>;
  readonly phases: Record<string, AllowlistPhase>;
  readonly sorters: Record<string, TokenSorter>;

  getSorter(contractOrCustomPoolId: string): TokenSorter;
}

export function createAllowlistState(seizeApi: SeizeApi): AllowlistState {
  const defaultSorter = new SimpleTokenSorter();
  return {
    allowlist: null,
    transferPools: {},
    tokenPools: {},
    customTokenPools: {},
    walletPools: {},
    phases: {},
    sorters: {
      [MEMES_CONTRACT]: new MemesTokenSorter(seizeApi),
    },
    getSorter(contractOrCustomPoolId: string): TokenSorter {
      return this.sorters[contractOrCustomPoolId] || defaultSorter;
    },
  };
}
