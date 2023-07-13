import { DescribableEntity } from '../../state-types/describable-entity';

export interface CustomTokenPoolParamsToken {
  readonly owner: string;
  readonly id?: string;
}

export interface CustomTokenPoolParams extends DescribableEntity {
  readonly tokens: CustomTokenPoolParamsToken[];
}
