import { sortTransfers, Transfer } from '../allowlist/state-types/transfer';
import { EtherscanService } from './etherscan.service';
import { TransfersStorage } from './transfers.storage';
import { Logger, LoggerFactory } from '../logging/logging-emitter';

export class TransfersService {
  private logger: Logger;

  constructor(
    private readonly transfersStorage: TransfersStorage,
    private readonly etherscan: EtherscanService,
    loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.create(TransfersService.name);
  }

  async getCollectionTransfers({
    contract,
    blockNo,
  }: {
    contract: string;
    blockNo: number;
  }): Promise<Transfer[]> {
    const savedTransfers = await this.getSavedTransfersOrEmpty(
      contract,
      blockNo,
    );

    const startingBlock = await this.getSavedTransfersLastBlockNoOrZero(
      contract,
    );

    if (startingBlock >= blockNo) {
      this.logger.info(
        `All transfers for ${contract} were found from local storage`,
      );
      return savedTransfers.filter((t) => t.blockNumber <= blockNo);
    }
    this.logger.info(
      `${
        blockNo - startingBlock
      } blocks worth of transfers for ${contract} were not found from local storage. Downloading those from Etherscan...`,
    );
    const newTransfers = await this.etherscan.getContractTransfers({
      contractAddress: contract,
      startingBlock: startingBlock,
      toBlock: blockNo,
    });
    this.logger.info(
      `${newTransfers.length} transactions for ${contract} downloaded from Etherscan. Saving those...`,
    );

    await this.transfersStorage.saveContractTransfers(contract, newTransfers);
    const allTransfers = sortTransfers([
      ...savedTransfers,
      ...newTransfers.filter((t) => t.blockNumber > startingBlock),
    ]);
    this.logger.info(`All transfers for ${contract} saved`);
    return allTransfers;
  }

  private async getSavedTransfersOrEmpty(
    contract: string,
    blockNo: number,
  ): Promise<Transfer[]> {
    try {
      return await this.transfersStorage.getContractTransfersOrdered(
        contract,
        blockNo,
      );
    } catch (e) {
      return [];
    }
  }

  private async getSavedTransfersLastBlockNoOrZero(
    contract: string,
  ): Promise<number> {
    try {
      return await this.transfersStorage.getLatestTransferBlockNo(contract);
    } catch (e) {
      return 0;
    }
  }
}
