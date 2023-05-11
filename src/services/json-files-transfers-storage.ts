import { TransfersStorage } from './transfers.storage';
import { sortTransfers, Transfer } from '../allowlist/state-types/transfer';
import * as fs from 'fs';
import { Logger, LoggerFactory } from '../logging/logging-emitter';
import { Time } from '../time';

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

  async getLatestTransferBlockNo(contract: string): Promise<number> {
    const now = Time.now();
    const transfers: Transfer[] = JSON.parse(
      fs.readFileSync(`${this.conf.rootFolder}${contract}.json`, 'utf8'),
    );
    const latestTransfer = sortTransfers(transfers).at(-1);
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
    const sortedTransfers = sortTransfers(transfers);
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
      const allTransfers = sortTransfers([...savedTransfers, ...transfers]);
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
}
