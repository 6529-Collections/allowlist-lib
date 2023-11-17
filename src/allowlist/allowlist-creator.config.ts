import { TransfersStorage } from '../services/transfers.storage';
import { JsonFilesTransfersStorage } from '../services/json-files-transfers-storage';
import { LoggerFactory } from '../logging/logging-emitter';
import { AllowlistOperation } from './allowlist-operation';
import { Alchemy } from 'alchemy-sdk';
import { TokenPoolStorage } from '../services/token-pool.storage';
import { JsonFilesTokenPoolStorage } from '../services/json-files-token-pool.storage';

export interface StorageImplementations {
  readonly transfersStorage: TransfersStorage;
  readonly tokenPoolStorage: TokenPoolStorage;
}

export interface AllowlistCreatorConfig {
  readonly etherscanApiKey: string;
  readonly alchemyApiKey?: string;
  readonly alchemy?: Alchemy;
  readonly seizeApiPath: string;
  readonly seizeApiKey?: string;
  readonly storage?: StorageImplementations;
  readonly loggerFactory?: LoggerFactory;
  readonly onBeforeOperation?: (
    operation: AllowlistOperation,
    allowlistId: string,
  ) => Promise<void> | void;
  readonly onAfterOperation?: (
    operation: AllowlistOperation,
    allowlistId: string,
  ) => Promise<void> | void;
}

export class LocalFileSystemStorageImplementations
  implements StorageImplementations
{
  readonly transfersStorage: TransfersStorage;
  readonly tokenPoolStorage: TokenPoolStorage;

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
    this.tokenPoolStorage = new JsonFilesTokenPoolStorage();
  }
}
