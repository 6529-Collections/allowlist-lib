import { SeizeApiPage } from './seize-api-page';

export interface ConsolidationMapping {
  readonly consolidation_display: string;
  readonly wallets: string[];
  readonly primary: string;
}

export type ConsolidationMappingPage = SeizeApiPage<ConsolidationMapping>;
