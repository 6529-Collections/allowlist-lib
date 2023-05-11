import { DescribableEntity } from 'src/allowlist/state-types/describable-entity';

export interface AllowlistAddComponentParams extends DescribableEntity {
  readonly phaseId: string;
}
