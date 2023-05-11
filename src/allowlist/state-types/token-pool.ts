import { DescribableEntity } from './describable-entity';
import { TokenOwnership } from './token-ownership';

export interface TokenPoolParams extends DescribableEntity {
  readonly transferPoolId: string;
  readonly tokenIds?: string;
}

export interface TokenPool extends TokenPoolParams {
  readonly tokens: TokenOwnership[];
}
