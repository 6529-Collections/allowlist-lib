import { DescribableEntity } from 'src/allowlist/state-types/describable-entity';

export interface CustomTokenOwnership {
  readonly id: string;
  readonly owner: string;
  readonly since: number;
}

export interface CustomTokenPool extends DescribableEntity {
  readonly tokens: CustomTokenOwnership[];
}
