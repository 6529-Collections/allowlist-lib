import { DelegateMapping } from '../seize/delegation-mapping';
import { ConsolidationMapping } from '../seize/consolidation-mapping';

export interface DelegationsState {
  readonly activeDelegations: DelegateMapping[];
  readonly activeConsolidations: ConsolidationMapping[];
}
