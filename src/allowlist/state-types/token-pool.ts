import { DescribableEntity } from './describable-entity';
import { TokenOwnership } from './token-ownership';

export interface TokenPoolRawParams extends DescribableEntity {
  readonly transferPoolId: string;
  readonly tokenIds?: string;
}

export interface TokenPoolParams extends DescribableEntity {
  readonly contract: string;
  readonly blockNo: number;
  readonly consolidateWallets: boolean;
  readonly tokenIds?: string;
}

export interface TokenPool extends DescribableEntity {
  tokens: TokenOwnership[];
  readonly tokenIds?: string;
}
