import { Pool } from '../../../app-types';

export interface ItemRemoveWalletsFromCertainTokenPoolsParams {
  readonly itemId: string;
  readonly pools: {
    readonly poolType: Pool;
    readonly poolId: string;
  }[];
}
