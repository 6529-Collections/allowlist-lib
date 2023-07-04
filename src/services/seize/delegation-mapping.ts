import { SeizeApiPage } from './seize-api-page';

export interface DelegateMapping {
  readonly created_at: string;
  readonly block: number;
  readonly from_address: string;
  readonly to_address: string;
  readonly collection: string;
  readonly use_case: number;
  readonly expiry: number;
  readonly all_tokens: number;
  readonly token_id: number;
}

export type DelegateMappingPage = SeizeApiPage<DelegateMapping>;
