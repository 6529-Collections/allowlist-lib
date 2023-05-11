import { DescribableEntity } from '../../../allowlist/state-types/describable-entity';

export interface CustomTokenPoolParamsToken {
  readonly owner: string;
  readonly id?: string;
  readonly since?: number;
}

export interface CustomTokenPoolParams extends DescribableEntity {
  readonly tokens: CustomTokenPoolParamsToken[];
}
