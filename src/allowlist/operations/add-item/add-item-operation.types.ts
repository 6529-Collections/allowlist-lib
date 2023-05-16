import { Pool } from '../../../app-types';
import { DescribableEntity } from './../../state-types/describable-entity';
export interface AllowlistAddItemParams extends DescribableEntity {
  readonly componentId: string;
  readonly poolType: Pool;
  readonly poolId: string;
}
