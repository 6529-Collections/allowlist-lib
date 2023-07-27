import { Transfer } from '../allowlist/state-types/transfer';

export interface TransfersStorage {
  getLatestTransferBlockNo({
    contract,
    transferType,
  }: {
    contract: string;
    transferType?: 'single' | 'batch';
  }): Promise<number>;
  getContractTransfersOrdered(
    contract: string,
    blockNo: number,
  ): Promise<Transfer[]>;
  saveContractTransfers(contract: string, transfers: Transfer[]): Promise<void>;
}
