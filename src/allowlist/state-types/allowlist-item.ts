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
  tokens: AllowlistItemToken[];
  readonly _insertionOrder: number;
}
