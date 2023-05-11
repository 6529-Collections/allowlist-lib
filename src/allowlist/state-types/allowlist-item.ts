import { DescribableEntity } from './describable-entity';

export interface AllowlistItem extends DescribableEntity {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly _insertionOrder: number;
}
