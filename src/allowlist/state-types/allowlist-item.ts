import { Pool } from 'src/app-types';
import { DescribableEntity } from './describable-entity';

export interface AllowlistItemToken {
  readonly id: string;
  readonly owner: string;
  readonly since: number;
}

export interface AllowlistItem extends DescribableEntity {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly poolId: string;
  readonly poolType: Pool;
  tokens: AllowlistItemToken[];
  readonly _insertionOrder: number;
}
