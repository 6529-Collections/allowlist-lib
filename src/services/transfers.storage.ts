import { Transfer } from '../allowlist/state-types/transfer';

export interface TransfersStorage {
  getLatestTransferBlockNo(contract: string): Promise<number>;
  getContractTransfersOrdered(
    contract: string,
    blockNo: number,
  ): Promise<Transfer[]>;
  saveContractTransfers(contract: string, transfers: Transfer[]): Promise<void>;
}
