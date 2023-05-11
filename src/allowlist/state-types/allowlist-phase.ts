import { AllowlistComponent } from './allowlist-component';
import { DescribableEntity } from './describable-entity';

export interface AllowlistPhase extends DescribableEntity {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly components: Record<string, AllowlistComponent>;
  readonly _insertionOrder: number;
}
