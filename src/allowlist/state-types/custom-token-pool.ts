import { DescribableEntity } from './describable-entity';

export interface CustomTokenOwnership {
  readonly id: string;
  readonly owner: string;
}

export interface CustomTokenPool extends DescribableEntity {
  readonly tokens: CustomTokenOwnership[];
}
