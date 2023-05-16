import { DescribableEntity } from '../../state-types/describable-entity';

export interface AllowlistAddComponentParams extends DescribableEntity {
  readonly phaseId: string;
}
