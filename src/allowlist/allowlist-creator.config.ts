import { TransfersStorage } from '../services/transfers.storage';
import { JsonFilesTransfersStorage } from '../services/json-files-transfers-storage';
import { LoggerFactory } from '../logging/logging-emitter';

export interface StorageImplementations {
  readonly transfersStorage: TransfersStorage;
}

export interface AllowlistCreatorConfig {
  readonly etherscanApiKey: string;
  readonly storage?: StorageImplementations;
  readonly loggerFactory?: LoggerFactory;
}

export class LocalFileSystemStorageImplementations
  implements StorageImplementations
{
  readonly transfersStorage: TransfersStorage;

  constructor(
    conf: { transferFilesFolder?: string },
    loggerFactory: LoggerFactory,
  ) {
    this.transfersStorage = new JsonFilesTransfersStorage(
      {
        rootFolder: conf.transferFilesFolder ?? 'transfers-data/',
      },
      loggerFactory,
    );
  }
}