import { DescribableEntity } from './describable-entity';
import { TokenOwnership } from './token-ownership';

export interface TokenPoolRawParams extends DescribableEntity {
  readonly transferPoolId: string;
  readonly tokenIds?: string;
}

export interface TokenPoolParams extends DescribableEntity {
  readonly contract: string;
  readonly blockNo: number;
  readonly tokenIds?: string;
}

export interface TokenPool extends DescribableEntity {
  readonly tokens: TokenOwnership[];
  readonly tokenIds?: string;
}
