import { AllowlistOperation } from './allowlist-operation';
import {
  AllowlistState,
  createAllowlistState,
} from './state-types/allowlist-state';
import { AllowlistOperationExecutor } from './allowlist-operation-executor';
import { AllowlistOperationCode } from './allowlist-operation-code';
import { BadInputError } from './bad-input.error';
import { validateNewDescribableEntity } from '../utils/validators';
import {
  AllowlistCreatorConfig,
  LocalFileSystemStorageImplementations,
} from './allowlist-creator.config';
import { EtherscanService } from '../services/etherscan.service';
import { TransfersService } from '../services/transfers.service';
import { CreateAllowlistOperation } from './operations/create-allowlist/create-allowlist-operation';
import { GetCollectionTransfersOperation } from './operations/get-collection-transfers/get-collection-transfers-operation';
import { CreateTokenPoolOperation } from './operations/create-token-pool/create-token-pool-operation';
import { AddPhaseOperation } from './operations/add-phase/add-phase-operation';
import { AddComponentOperation } from './operations/add-component/add-component-operation';
import { AddItemOperation } from './operations/add-item/add-item-operation';
import { CreateWalletPoolOperation } from './operations/create-wallet-pool/create-wallet-pool-operation';
import {
  defaultLogFactory,
  Logger,
  LoggerFactory,
} from '../logging/logging-emitter';
import { Time } from '../time';
import { CreateCustomTokenPoolOperation } from './operations/create-custom-token-pool/create-custom-token-pool-operation';
import { ItemExcludeTokenIdsOperation } from './operations/item-exclude-token-ids/item-exclude-token-ids-operation';
import { ItemSelectTokenIdsOperation } from './operations/item-select-token-ids/item-select-token-ids-operation';
import { ComponentAddSpotsToAllItemWalletsOperation } from './operations/component-add-spots-to-all-item-wallets/component-add-spots-to-all-item-wallets-operation';
import { ItemRemoveFirstNTokensOperation } from './operations/item-remove-first-n-tokens/item-remove-first-n-tokens-operation';
import { ItemRemoveLastNTokensOperation } from './operations/item-remove-last-n-tokens/item-remove-last-n-tokens-operation';
import { ItemSelectFirstNTokensOperation } from './operations/item-select-first-n-tokens/item-select-first-n-tokens-operation';
import { ItemSelectLastNTokensOperation } from './operations/item-select-last-n-tokens/item-select-last-n-tokens-operation';
import { SeizeApi } from '../services/seize/seize.api';
import { Http } from '../services/http';
import { ComponentAddSpotsToWalletsExcludingCertainComponentsOperation } from './operations/component-add-spots-to-wallets-excluding-certain-components/component-add-spots-to-wallets-excluding-certain-components-operation';
import { ItemSortWalletsByTotalTokensCountOperation } from './operations/item-sort-wallets-by-total-tokens-count/item-sort-wallets-by-total-tokens-count-operation';
import { ItemSortWalletsByUniqueTokensCountOperation } from './operations/item-sort-wallets-by-unique-tokens-count/item-sort-wallets-by-unique-tokens-count-operation';
import { ItemRemoveFirstNWalletsOperation } from './operations/item-remove-first-n-wallets/item-remove-first-n-wallets-operation';
import { ItemSelectFirstNWalletsOperation } from './operations/item-select-first-n-wallets/item-select-first-n-wallets-operation';
import { ItemRemoveWalletsFromCertainComponentsOperation } from './operations/item-remove-wallets-from-certain-components/item-remove-wallets-from-certain-components-operation';
import { ComponentSelectRandomWalletsOperation } from './operations/component-select-random-wallets/component-select-random-wallets-operation';
import { ItemSortWalletsByMemesTdhOperation } from './operations/item-sort-wallets-by-memes-tdh/item-sort-wallets-by-memes-tdh-operation';
import { TransferPoolConsolidateWalletsOperation } from './operations/transfer-pool-consolidate-wallets/transfer-pool-consolidate-wallets-operation';
// Placeholder for future imports (please keep this comment here, it's used by the code generator)

export class AllowlistCreator {
  /**
   * Creates an instance of the allowlist creator.
   *
   * If you don't provide a storage implementation, it will use local file systems folder PROJECT_ROOT/transfers-data.
   * If you want to use local filesystem based storage but a different folder then configure it like this:
   * ```ts
   * AllowListCreator.getInstance({
   *  etherscanApiKey: '...',
   *  storage: new LocalFileSystemStorageImplementations({
   *    transferFilesFolder: 'your-folder/',
   *  });
   * });
   * ```
   *
   * You can create your own storage implementation bt implementing the TransfersStorage interface and create a configuration for it
   * by implementing StorageImplementations interface. Then you can wire it all together like this:
   * ```ts
   * AllowListCreator.getInstance({
   *  etherscanApiKey: '...',
   *  storage: new MyCustomStorageImplementations(...);
   * });
   * ```
   *
   * @param etherscanApiKey The API key for Etherscan.
   * @param seizeApiPath Needed for some operations which fetch data from Seize API. Leave empty if you don't use those operations.
   * @param seizeApiKey Needed for some operations which fetch data from Seize API. Leave empty if you don't use those operations.
   * @param storage The storage implementations to use.
   * @param loggerFactory Logger implementation to use. If not provided, it will use the default console logger.
   * @param onBeforeOperation function which will be invoked before each operation (optional).
   * @param onAfterOperation function which will be invoked after each operation (optional).
   */
  public static getInstance({
    seizeApiPath,
    seizeApiKey,
    etherscanApiKey,
    storage,
    loggerFactory,
    onBeforeOperation,
    onAfterOperation,
  }: AllowlistCreatorConfig): AllowlistCreator {
    const loggerFactoryImpl = loggerFactory || defaultLogFactory;
    const http = new Http(loggerFactoryImpl);
    const seizeApi = new SeizeApi(http, seizeApiPath, seizeApiKey);
    const storageImpls =
      storage ||
      new LocalFileSystemStorageImplementations({}, loggerFactoryImpl);
    const etherscanService = new EtherscanService(
      { apiKey: etherscanApiKey },
      storageImpls.transfersStorage,
      loggerFactoryImpl,
    );
    const transfersService = new TransfersService(
      storageImpls.transfersStorage,
      etherscanService,
      loggerFactoryImpl,
    );
    const opExecutors: Record<
      AllowlistOperationCode,
      AllowlistOperationExecutor
    > = {
      CREATE_ALLOWLIST: new CreateAllowlistOperation(loggerFactoryImpl),
      GET_COLLECTION_TRANSFERS: new GetCollectionTransfersOperation(
        transfersService,
        loggerFactoryImpl,
      ),

      CREATE_TOKEN_POOL: new CreateTokenPoolOperation(loggerFactoryImpl),
      CREATE_CUSTOM_TOKEN_POOL: new CreateCustomTokenPoolOperation(),
      CREATE_WALLET_POOL: new CreateWalletPoolOperation(loggerFactoryImpl),

      ADD_PHASE: new AddPhaseOperation(loggerFactoryImpl),
      ADD_COMPONENT: new AddComponentOperation(loggerFactoryImpl),

      COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS:
        new ComponentAddSpotsToAllItemWalletsOperation(loggerFactoryImpl),

      ADD_ITEM: new AddItemOperation(loggerFactoryImpl),
      ITEM_EXCLUE_TOKEN_IDS: new ItemExcludeTokenIdsOperation(
        loggerFactoryImpl,
      ),
      ITEM_SELECT_TOKEN_IDS: new ItemSelectTokenIdsOperation(loggerFactoryImpl),
      ITEM_REMOVE_FIRST_N_TOKENS: new ItemRemoveFirstNTokensOperation(
        loggerFactoryImpl,
      ),
      ITEM_REMOVE_LAST_N_TOKENS: new ItemRemoveLastNTokensOperation(
        loggerFactoryImpl,
      ),
      ITEM_SELECT_FIRST_N_TOKENS: new ItemSelectFirstNTokensOperation(
        loggerFactoryImpl,
      ),
      ITEM_SELECT_LAST_N_TOKENS: new ItemSelectLastNTokensOperation(
        loggerFactoryImpl,
      ),
      COMPONENT_ADD_SPOTS_TO_WALLETS_EXCLUDING_CERTAIN_COMPONENTS:
        new ComponentAddSpotsToWalletsExcludingCertainComponentsOperation(
          loggerFactoryImpl,
        ),
      ITEM_SORT_WALLETS_BY_TOTAL_TOKENS_COUNT:
        new ItemSortWalletsByTotalTokensCountOperation(loggerFactoryImpl),
      ITEM_SORT_WALLETS_BY_UNIQUE_TOKENS_COUNT:
        new ItemSortWalletsByUniqueTokensCountOperation(loggerFactoryImpl),
      ITEM_REMOVE_FIRST_N_WALLETS: new ItemRemoveFirstNWalletsOperation(
        loggerFactoryImpl,
      ),
      ITEM_SELECT_FIRST_N_WALLETS: new ItemSelectFirstNWalletsOperation(
        loggerFactoryImpl,
      ),
      ITEM_REMOVE_WALLETS_FROM_CERTAIN_COMPONENTS:
        new ItemRemoveWalletsFromCertainComponentsOperation(loggerFactoryImpl),
      COMPONENT_SELECT_RANDOM_WALLETS:
        new ComponentSelectRandomWalletsOperation(loggerFactoryImpl),
      ITEM_SORT_WALLETS_BY_MEMES_TDH: new ItemSortWalletsByMemesTdhOperation(
        seizeApi,
        loggerFactoryImpl,
      ),
      TRANSFER_POOL_CONSOLIDATE_WALLETS:
        new TransferPoolConsolidateWalletsOperation(
          seizeApi,
          loggerFactoryImpl,
        ),
      // Placeholder for future operations (please keep this comment here, it's used by the code generator)
    };
    return new AllowlistCreator(
      opExecutors,
      loggerFactoryImpl,
      onBeforeOperation,
      onAfterOperation,
    );
  }

  private readonly logger: Logger;

  constructor(
    private readonly operationExecutors: Record<
      string,
      AllowlistOperationExecutor
    >,
    loggerFactory: LoggerFactory,
    private readonly onBeforeOperation?: (
      operation: AllowlistOperation,
      allowlistId: string,
    ) => void,
    private readonly onAfterOperation?: (
      operation: AllowlistOperation,
      allowlistId: string,
    ) => void,
  ) {
    this.logger = loggerFactory.create(AllowlistCreator.name);
  }

  public async execute(
    operations: AllowlistOperation[],
  ): Promise<AllowlistState> {
    const start = Time.now();
    this.logger.info(
      `Executing ${operations.length} operations to create an allowlist`,
    );
    const createAllowlistOperation = operations.at(0);
    if (
      !createAllowlistOperation ||
      createAllowlistOperation.code !== AllowlistOperationCode.CREATE_ALLOWLIST
    ) {
      throw new BadInputError('First operation must be CREATE_ALLOWLIST');
    }
    const allowlistId = createAllowlistOperation.params?.id;
    const state = createAllowlistState();
    const _uniqueIds = new Set<string>();
    for (const operation of operations) {
      if (this.onBeforeOperation) {
        await this.onBeforeOperation(operation, allowlistId);
      }
      const { code, params } = operation;
      if (params.hasOwnProperty('id')) {
        validateNewDescribableEntity({ params, code, _uniqueIds });
      }
      await this.operationExecutors[code].execute({ params, state });
      if (this.onAfterOperation) {
        await this.onAfterOperation(operation, allowlistId);
      }
    }
    this.logger.info(
      `Executed ${
        operations.length
      } operations and created an allowlist in ${start.diffFromNow()}`,
    );
    return state;
  }

  public validateOperation(params: {
    code: AllowlistOperationCode;
    params: any;
  }) {
    return this.operationExecutors[params.code].validate(params.params);
  }
}
