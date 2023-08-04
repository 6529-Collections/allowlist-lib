import { Pool } from 'src/app-types';
import { DescribableEntity } from './describable-entity';

export interface AllowlistItemToken {
  readonly id: string;
  readonly owner: string;
}

export interface AllowlistItem extends DescribableEntity {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly contract: string | null;
  readonly blockNo: number | null;
  readonly consolidateBlockNo: number | null;
  readonly poolId: string;
  readonly poolType: Pool;
  tokens: AllowlistItemToken[];
  readonly _insertionOrder: number;
}
