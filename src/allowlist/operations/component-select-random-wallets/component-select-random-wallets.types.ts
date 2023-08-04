import { CardStatistics } from '../../../app-types';

export interface ComponentSelectRandomWalletsParams {
  readonly componentId: string;
  readonly count: number;
  readonly seed: string;
  readonly weightType?: CardStatistics;
}
