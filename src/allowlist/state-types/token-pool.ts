import { DescribableEntity } from './describable-entity';
import { TokenOwnership } from './token-ownership';

export interface TokenPoolParams extends DescribableEntity {
  readonly contract: string;
  readonly blockNo: number;
  readonly consolidateBlockNo: number | null;
  readonly tokenIds?: string;
}

export interface TokenPool extends TokenPoolParams {
  tokens: TokenOwnership[];
}
