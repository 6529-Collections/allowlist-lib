export interface DelegationHistoryRecord {
  collection: string;
  from: string;
  to: string;
  useCase: number;
  blockNo: number;
  expiry: number | null;
  allTokens: boolean | null;
  tokenId: number | null;
  txHash: string;
  name: string;
  timestamp: number | null;
}
