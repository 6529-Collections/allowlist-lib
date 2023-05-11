import { AllowlistItem } from './allowlist-item';
import { DescribableEntity } from './describable-entity';

export interface AllowlistComponent extends DescribableEntity {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly items: Record<string, AllowlistItem>;
  readonly _insertionOrder: number;
}
