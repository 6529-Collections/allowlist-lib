import { EtherscanService } from '../etherscan.service';
import { AlchemyService } from '../alchemy.service';
import { DelegationHistoryRecord } from './delegation-history-record';
import { DELEGATIONS_IFACE } from './delegations.iface';
import { DelegationsState } from './delegations.state';
import { DelegateMapping } from '../seize/delegation-mapping';

const DELEGATIONS_CONTRACT = '0x2202cb9c00487e7e8ef21e6d8e914b32e709f43d';
export const USE_CASE_SUB_DELEGATION = 998;
export const USE_CASE_CONSOLIDATION = 999;

export class DelegationService {
  constructor(
    private etherscanService: EtherscanService,
    private alchemyService: AlchemyService,
  ) {}

  async *getDelegationsHistory({
    fromBlock,
    toBlock,
  }: {
    fromBlock: number;
    toBlock: number;
  }): AsyncGenerator<DelegationHistoryRecord, void, void> {
    for await (const log of this.etherscanService.getLogs({
      contract: DELEGATIONS_CONTRACT,
      fromBlock,
      toBlock,
    })) {
      const parsedLog = DELEGATIONS_IFACE.parseLog(log);
      const logArgs = parsedLog.args;
      const data = {
        collection: logArgs.collectionAddress,
        from: logArgs.delegator ? logArgs.delegator : logArgs.from,
        to: logArgs.delegationAddress,
        useCase: Number(logArgs.useCase),
        blockNo: Number(log.blockNumber),
        expiry: null,
        allTokens: null,
        tokenId: null,
        txHash: log.transactionHash,
        name: parsedLog.name,
        timestamp: null,
      };
      const tx = await this.alchemyService.getTransaction(log.transactionHash);
      if (tx) {
        data.timestamp = tx.timestamp ?? null;
        const txData = tx.data;
        if (txData) {
          const parsedTx = DELEGATIONS_IFACE.parseTransaction({
            data: txData,
            value: 0,
          });
          if (parsedTx) {
            const txArgs = parsedTx.args;
            if (txArgs) {
              data.expiry = txArgs._expiryDate
                ? Number(txArgs._expiryDate)
                : null;
              data.allTokens = txArgs?._allTokens;
              data.tokenId = txArgs._tokenId ? Number(txArgs._tokenId) : null;
            }
          }
        }
      }
      yield data;
    }
  }

  async getDelegationsStateForBlock(
    blockNo: number,
  ): Promise<DelegationsState> {
    const activeDelegations: Record<string, DelegationHistoryRecord[]> = {};
    const consolidationPieceCandidates: Record<
      string,
      DelegationHistoryRecord[]
    > = {};
    const toBlockTimestamp = await this.alchemyService.getBlockTimestamp(
      blockNo,
    );
    for await (const record of this.getDelegationsHistory({
      fromBlock: 0,
      toBlock: blockNo,
    })) {
      const name = record.name;
      const useCase = record.useCase;
      const expiry = record.expiry;
      if (
        ['RegisterDelegation', 'RegisterDelegationUsingSubDelegation'].includes(
          name,
        )
      ) {
        if (expiry != null && expiry < toBlockTimestamp) {
          continue;
        }
        if (
          ![USE_CASE_SUB_DELEGATION, USE_CASE_CONSOLIDATION].includes(useCase)
        ) {
          const key = this.createKey(record);
          activeDelegations[key] = !activeDelegations[key]
            ? [record]
            : [...activeDelegations[key], record];
        } else if (useCase === USE_CASE_CONSOLIDATION) {
          const key = this.createKey(record);
          consolidationPieceCandidates[key] = !consolidationPieceCandidates[key]
            ? [record]
            : [...consolidationPieceCandidates[key], record];
        }
      } else if (name === 'RevokeDelegation') {
        const key = this.createKey(record);
        delete activeDelegations[key];
        delete consolidationPieceCandidates[key];
      }
    }
    const delegations: DelegateMapping[] = Object.values(activeDelegations)
      .flat(1)
      .map((it) => ({
        created_at: it.timestamp ? new Date(it.timestamp).toUTCString() : null,
        block: it.blockNo,
        from_address: it.from,
        to_address: it.to,
        collection: it.collection,
        use_case: it.useCase,
        expiry: it.expiry,
        all_tokens: it.allTokens ? 1 : 0,
        token_id: it.tokenId,
      }));
    const delegationHistoryRecords = Object.values(
      consolidationPieceCandidates,
    ).flat();
    const consolidation =
    for (const delegationHistoryRecord of delegationHistoryRecords) {
    }
    return {
      activeDelegations: delegations,
      activeConsolidations: [],
    };
  }

  private createKey(record: DelegationHistoryRecord) {
    return `${record.collection}-${record.from}-${record.to}-${record.useCase}`;
  }
}
