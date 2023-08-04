import { CardStatistics } from '../../../app-types';

export interface ComponentSelectRandomPercentageWalletsParams {
  readonly componentId: string;
  readonly percentage: number;
  readonly seed: string;
  readonly weightType?: CardStatistics;
}
