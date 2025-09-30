import axios from 'axios';
import { ContractSchema } from '../app-types';
import { BadInputError } from '../allowlist/bad-input.error';
import {
  EtherscanApiTokenTransferResponse,
  EtherscanApiTokensRawResponse,
  EtherscanApiTokensRawResponseResult,
} from './etherscan.types';
import {
  sortAndLowercaseTransfers,
  Transfer,
} from '../allowlist/state-types/transfer';
import { assertUnreachable } from '../utils/app.utils';
import { Logger, LoggerFactory } from '../logging/logging-emitter';

export class EtherscanService {
  private readonly logger: Logger;

  constructor(
    private readonly config: { apiKey: string },
    loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.create(EtherscanService.name);
  }

  async *getTransfers(param: {
    contractAddress: string;
    contractSchema: ContractSchema;
    transferType: 'single' | 'batch';
    startingBlock: string;
    toBlock: string;
  }): AsyncGenerator<Transfer[], void, void> {
    const {
      contractAddress,
      contractSchema,
      toBlock,
      transferType,
      startingBlock,
    } = param;
    let fromBlock = parseInt(startingBlock);
    let latestUniqueKey = '';
    while (true) {
      const logs = await this.getEtherscanLogsRaw({
        contractAddress,
        params: {
          fromBlock,
          offset: 10000,
          page: 1,
          toBlock,
          ...this.getEtherscanApiTopics({ contractSchema, transferType }),
        },
      });
      if (typeof logs !== 'string') {
        const convertedTransfers = this.convertEtherscanApiTokenTransfers({
          transfers: logs.result,
          contractSchema,
          transferType,
        });
        const mappedTransfers = convertedTransfers.map((transfer) => {
          return {
            contract: transfer.contract,
            tokenID: transfer.tokenID,
            blockNumber: transfer.blockNumber,
            timeStamp: transfer.timeStamp,
            logIndex: transfer.logIndex,
            from: transfer.from,
            to: transfer.to,
            amount: transfer.amount,
            transactionHash: transfer.transactionHash,
            transactionIndex: transfer.transactionIndex,
            transferType: transferType,
          };
        });
        if (!convertedTransfers.length) {
          break;
        }
        const thisUniqueKey = convertedTransfers.at(-1)?.uniqueKey;
        if (thisUniqueKey === latestUniqueKey) {
          break;
        } else {
          latestUniqueKey = thisUniqueKey;
        }
        yield mappedTransfers;
        fromBlock = parseInt(logs.result.at(-1).blockNumber, 16);
        this.logger.info(
          `Reached block ${fromBlock} with contract ${contractAddress}`,
        );
      } else {
        throw new BadInputError(logs);
      }
    }
  }

  async getContractTransfers(param: {
    contractAddress: string;
    startingBlock: number;
    toBlock: number;
  }): Promise<Transfer[]> {
    const { contractAddress, toBlock, startingBlock } = param;
    const contractSchema = await this.getContractSchema({
      contractAddress,
    });

    switch (contractSchema) {
      case ContractSchema.ERC721: {
        const transfers = await this.getAllTransfersAtOnce({
          contractAddress,
          contractSchema,
          startingBlock: startingBlock.toString(),
          toBlock: toBlock.toString(),
          transferType: 'single',
        });
        return sortAndLowercaseTransfers(transfers);
      }
      case ContractSchema.ERC1155: {
        const [singleTransfers, batchTransfers] = await Promise.all([
          this.getAllTransfersAtOnce({
            contractAddress,
            contractSchema,
            startingBlock: startingBlock.toString(),
            toBlock: toBlock.toString(),
            transferType: 'single',
          }),

          this.getAllTransfersAtOnce({
            contractAddress,
            contractSchema,
            startingBlock: startingBlock.toString(),
            toBlock: toBlock.toString(),
            transferType: 'batch',
          }),
        ]);
        return sortAndLowercaseTransfers([
          ...singleTransfers,
          ...batchTransfers,
        ]);
      }
      case ContractSchema.ERC721Old: {
        const erc721OldTransfers = await this.getAllTransfersAtOnce({
          contractAddress,
          contractSchema,
          startingBlock: startingBlock.toString(),
          toBlock: toBlock.toString(),
          transferType: 'single',
        });
        return sortAndLowercaseTransfers(erc721OldTransfers);
      }
      default:
        assertUnreachable(contractSchema);
        break;
    }
  }

  async getContractSchema(param: {
    contractAddress: string;
  }): Promise<ContractSchema | null> {
    const { contractAddress } = param;
    const erc721InterfaceIdOld = '0xd31b620d';
    const erc721InterfaceId = '0x80ac58cd';
    const erc1155InterfaceId = '0xd9b67a26';
    const hexTrue =
      '0x0000000000000000000000000000000000000000000000000000000000000001';
    try {
      const erc721SupportsInterface = await axios.get(
        this.getEtherscanApiSupportsInterfaceUrl({
          contractAddress,
          interfaceId: erc721InterfaceId,
        }),
      );
      if (erc721SupportsInterface.data.result === hexTrue) {
        return ContractSchema.ERC721;
      }

      const erc1155SupportsInterface = await axios.get(
        this.getEtherscanApiSupportsInterfaceUrl({
          contractAddress,
          interfaceId: erc1155InterfaceId,
        }),
      );
      if (erc1155SupportsInterface.data.result === hexTrue) {
        return ContractSchema.ERC1155;
      }

      const erc721SupportsInterfaceOld = await axios.get(
        this.getEtherscanApiSupportsInterfaceUrl({
          contractAddress,
          interfaceId: erc721InterfaceIdOld,
        }),
      );
      if (erc721SupportsInterfaceOld.data.result === hexTrue) {
        return ContractSchema.ERC721Old;
      }
    } catch (error) {
      throw new BadInputError('Invalid contract address');
    }
    throw new BadInputError('Invalid contract address');
  }

  private supportsInterfaceData(interfaceId): string {
    return `0x01ffc9a7${interfaceId.replace(
      '0x',
      '',
    )}00000000000000000000000000000000000000000000000000000000`;
  }
  private getEtherscanApiSupportsInterfaceUrl(param: {
    contractAddress: string;
    interfaceId: string;
  }): string {
    return `https://api.etherscan.io/v2/api?module=proxy&action=eth_call&to=${
      param.contractAddress
    }&data=${this.supportsInterfaceData(param.interfaceId)}&tag=latest&apikey=${
      this.config.apiKey
    }&chainid=1`;
  }

  private async getEtherscanLogsRaw(param: {
    contractAddress: string;
    params: Record<string, any>;
  }): Promise<EtherscanApiTokensRawResponse> {
    const { contractAddress, params } = param;
    const logs = await axios.get<EtherscanApiTokensRawResponse>(
      `https://api.etherscan.io/v2/api?module=logs&action=getLogs&address=${contractAddress}&apikey=${this.config.apiKey}&chainid=1`,
      { params: { ...params } },
    );

    if (logs.data.status === '0' && logs.data.message === 'No records found') {
      return logs.data;
    }
    if (logs.data?.message !== 'OK' || logs.data?.status !== '1') {
      throw new BadInputError(logs.data?.message ?? 'Something went wrong');
    }
    return logs.data;
  }

  private getEtherscanApiTopics(param: {
    contractSchema: ContractSchema;
    transferType: string;
  }): Record<string, string> {
    const { contractSchema, transferType } = param;
    const ERC721TransferTopic =
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

    switch (contractSchema) {
      case ContractSchema.ERC1155:
        if (transferType === 'batch') {
          return {
            topic0:
              '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb',
          };
        } else {
          return {
            topic0:
              '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62',
          };
        }
      case ContractSchema.ERC721Old:
      case ContractSchema.ERC721:
        return {
          topic0: ERC721TransferTopic,
        };
      default:
        assertUnreachable(contractSchema);
    }
    return {};
  }

  private smartParseInt(value: string): number {
    if (value === '0x') {
      return 0;
    }
    return parseInt(value);
  }

  private getEtherscanApiTokenTransferUniqueKey({
    contract,
    tokenID,
    blockNumber,
    logIndex,
    transactionHash,
  }: {
    contract: string;
    tokenID: string;
    blockNumber: number;
    logIndex: number;
    transactionHash: string;
  }): string {
    return `${contract}-${tokenID}-${blockNumber}-${transactionHash}-${logIndex}`;
  }

  private convertERC721Transfers({
    transfers,
    schema,
  }: {
    transfers: EtherscanApiTokensRawResponseResult[];
    schema: ContractSchema.ERC721 | ContractSchema.ERC721Old;
  }): EtherscanApiTokenTransferResponse[] {
    return transfers.map((transfer) => {
      const tokenID = BigInt(
        schema === ContractSchema.ERC721 ? transfer.topics[3] : transfer.data,
      ).toString();
      const blockNumber = parseInt(transfer.blockNumber);
      const logIndex = this.smartParseInt(transfer.logIndex);
      const transactionHash = transfer.transactionHash;
      return {
        contract: transfer.address.toLocaleLowerCase(),
        tokenID,
        blockNumber,
        timeStamp: parseInt(transfer.timeStamp),
        logIndex,
        from: `0x${transfer.topics.at(1).slice(26)}`.toLowerCase(),
        to: `0x${transfer.topics.at(2).slice(26)}`.toLowerCase(),
        amount: 1,
        transactionHash,
        transactionIndex: this.smartParseInt(transfer.transactionIndex),
        uniqueKey: this.getEtherscanApiTokenTransferUniqueKey({
          contract: transfer.address,
          tokenID,
          blockNumber,
          logIndex,
          transactionHash,
        }),
        transferType: 'single',
      };
    });
  }

  private convertERC1155BatchTransfers(
    transfers: EtherscanApiTokensRawResponseResult[],
  ): EtherscanApiTokenTransferResponse[] {
    return transfers.flatMap((transfer) => {
      const data = transfer.data;
      const dataWithoutPrefix = data.substring(2);

      const idsOffsetHex = dataWithoutPrefix.substring(0, 64);
      const idsOffset = parseInt(idsOffsetHex, 16);

      const valuesOffsetHex = dataWithoutPrefix.substring(64, 128);
      const valuesOffset = parseInt(valuesOffsetHex, 16);

      const idsLengthHex = dataWithoutPrefix.substring(
        idsOffset * 2,
        idsOffset * 2 + 64,
      );
      const idsLength = parseInt(idsLengthHex, 16);

      const ids = [];
      for (let i = 0; i < idsLength; i++) {
        const idHex = dataWithoutPrefix.substring(
          idsOffset * 2 + 64 + 64 * i,
          idsOffset * 2 + 128 + 64 * i,
        );

        ids.push(BigInt(`0x${idHex}`));
      }

      const valuesLengthHex = dataWithoutPrefix.substring(
        valuesOffset * 2,
        valuesOffset * 2 + 64,
      );
      const valuesLength = parseInt(valuesLengthHex, 16);

      const values = [];
      for (let i = 0; i < valuesLength; i++) {
        const valueHex = dataWithoutPrefix.substring(
          valuesOffset * 2 + 64 + 64 * i,
          valuesOffset * 2 + 128 + 64 * i,
        );
        values.push(parseInt(valueHex, 16));
      }
      return ids.map((id, index) => {
        const tokenID = id.toString();
        const blockNumber = parseInt(transfer.blockNumber);
        const logIndex = this.smartParseInt(transfer.logIndex);
        const transactionHash = transfer.transactionHash;
        return {
          contract: transfer.address.toLowerCase(),
          tokenID,
          blockNumber,
          timeStamp: parseInt(transfer.timeStamp),
          logIndex,
          from: `0x${transfer.topics.at(2).slice(26)}`.toLowerCase(),
          to: `0x${transfer.topics.at(3).slice(26)}`.toLowerCase(),
          amount: values.at(index),
          transactionHash,
          transactionIndex: this.smartParseInt(transfer.transactionIndex),
          uniqueKey: this.getEtherscanApiTokenTransferUniqueKey({
            contract: transfer.address,
            tokenID,
            blockNumber,
            logIndex,
            transactionHash,
          }),
          transferType: 'batch',
        };
      });
    });
  }

  private convertERC1155Transfers(
    transfers: EtherscanApiTokensRawResponseResult[],
  ): EtherscanApiTokenTransferResponse[] {
    return transfers.map((transfer) => {
      const tokenID = BigInt(
        `0x${transfer.data.replace('0x', '').substring(0, 64)}`,
      ).toString();
      const blockNumber = parseInt(transfer.blockNumber);
      const logIndex = this.smartParseInt(transfer.logIndex);
      const transactionHash = transfer.transactionHash;
      return {
        contract: transfer.address.toLowerCase(),
        tokenID: tokenID,
        blockNumber: blockNumber,
        timeStamp: parseInt(transfer.timeStamp),
        logIndex: logIndex,
        from: `0x${transfer.topics.at(2).slice(26)}`.toLowerCase(),
        to: `0x${transfer.topics.at(3).slice(26)}`.toLowerCase(),
        amount: parseInt(
          transfer.data.replace('0x', '').substring(64, 128),
          16,
        ),
        transactionHash: transactionHash,
        transactionIndex: this.smartParseInt(transfer.transactionIndex),
        uniqueKey: this.getEtherscanApiTokenTransferUniqueKey({
          contract: transfer.address,
          tokenID,
          blockNumber,
          logIndex,
          transactionHash,
        }),
        transferType: 'single',
      };
    });
  }

  private convertEtherscanApiTokenTransfers(param: {
    transfers: EtherscanApiTokensRawResponseResult[];
    contractSchema: ContractSchema;
    transferType: string;
  }): EtherscanApiTokenTransferResponse[] {
    const { transfers, contractSchema, transferType } = param;
    switch (contractSchema) {
      case ContractSchema.ERC721:
      case ContractSchema.ERC721Old:
        return this.convertERC721Transfers({
          transfers,
          schema: contractSchema,
        });
      case ContractSchema.ERC1155:
        if (transferType === 'batch') {
          return this.convertERC1155BatchTransfers(transfers);
        } else {
          return this.convertERC1155Transfers(transfers);
        }
      default:
        assertUnreachable(contractSchema);
    }
    return [];
  }

  private async getAllTransfersAtOnce(param: {
    contractAddress: string;
    contractSchema: ContractSchema;
    transferType: 'single' | 'batch';
    startingBlock: string;
    toBlock: string;
  }): Promise<Transfer[]> {
    const transfers = [];
    for await (const t of this.getTransfers(param)) {
      transfers.push(...t);
    }
    return transfers;
  }
}
