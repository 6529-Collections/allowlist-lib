import { DescribableEntity } from './describable-entity';

export interface WalletPool extends DescribableEntity {
  readonly wallets: string[];
}
