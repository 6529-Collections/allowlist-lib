import { TransfersStorage } from './transfers.storage';
import {
  Transfer,
  sortAndLowercaseTransfers,
} from '../allowlist/state-types/transfer';
import * as fs from 'fs';
import { Logger, LoggerFactory } from '../logging/logging-emitter';
import { Time } from '../time';
import { TokenOwnership } from '../allowlist/state-types/token-ownership';

export class JsonFilesTransfersStorage implements TransfersStorage {
  private readonly logger: Logger;

  constructor(
    private readonly conf: { rootFolder: string },
    loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.create(JsonFilesTransfersStorage.name);
    this.folderExistsOrCreate(this.conf.rootFolder);
  }

  private folderExistsOrCreate(folder: string): void {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
  }

  async getLatestTransferBlockNo({
    contract,
    transferType,
  }: {
    contract: string;
    transferType?: 'single' | 'batch';
  }): Promise<number> {
    const now = Time.now();
    const transfers: Transfer[] = JSON.parse(
      fs.readFileSync(`${this.conf.rootFolder}${contract}.json`, 'utf8'),
    );
    const latestTransfer = sortAndLowercaseTransfers(transfers)
      .filter((t) => !transferType || t.transferType === transferType)
      .at(-1);
    this.logger.debug(`getLatestTransferBlockNo took ${now.diffFromNow()}`);
    return latestTransfer?.blockNumber ?? 0;
  }

  async getContractTransfersOrdered(
    contract: string,
    blockNo: number,
  ): Promise<Transfer[]> {
    const now = Time.now();
    const transfers: Transfer[] = JSON.parse(
      fs.readFileSync(`${this.conf.rootFolder}${contract}.json`, 'utf8'),
    ).filter((t: Transfer) => t.blockNumber <= blockNo);
    const sortedTransfers = sortAndLowercaseTransfers(transfers);
    this.logger.debug(`getContractTransfersOrdered took ${now.diffFromNow()}`);
    return sortedTransfers;
  }

  async saveContractTransfers(
    contract: string,
    transfers: Transfer[],
  ): Promise<void> {
    const now = Time.now();
    try {
      const savedTransfers: Transfer[] = JSON.parse(
        fs.readFileSync(`${this.conf.rootFolder}${contract}.json`, 'utf8'),
      );
      const allTransfers = sortAndLowercaseTransfers([
        ...savedTransfers,
        ...transfers,
      ]);
      fs.writeFileSync(
        `${this.conf.rootFolder}${contract}.json`,
        JSON.stringify(allTransfers),
      );
    } catch (e) {
      fs.writeFileSync(
        `${this.conf.rootFolder}${contract}.json`,
        JSON.stringify(transfers),
      );
    }
    this.logger.debug(`saveContractTransfers took ${now.diffFromNow()}`);
  }

  async getTokenPoolTokenOwnerships(
    tokenPoolId: string,
  ): Promise<TokenOwnership[] | null> {
    return null;
  }
}
