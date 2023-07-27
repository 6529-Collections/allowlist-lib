export interface Transfer {
  readonly contract: string;
  readonly tokenID: string;
  readonly blockNumber: number;
  readonly timeStamp: number;
  readonly logIndex: number;
  readonly from: string;
  readonly to: string;
  readonly amount: number;
  readonly transactionHash: string;
  readonly transactionIndex: number;
  readonly transferType?: 'single' | 'batch';
}

/**
 * The `sortAndLowercaseTransfers` function sorts and lowercases array of transfers.
 * @param transfers Array of transfers to sort and lowercase.
 * @returns Sorted and lowercased array of transfers.
 * @example sortAndLowercaseTransfers([{ blockNumber: 1, transactionIndex: 1, logIndex: 1, contract: '0x0ABC', to: '0x0DFG', from: '0x0lmf' }])
 * // => [{ blockNumber: 1, transactionIndex: 1, logIndex: 1, contract: '0x0abc', to: '0x0dfg', from: '0x0lmf' }]
 */

export const sortAndLowercaseTransfers = (transfers: Transfer[]): Transfer[] =>
  sortTransfers(transfers).map((transfer) => ({
    ...transfer,
    contract: transfer.contract.toLowerCase(),
    to: transfer.to.toLowerCase(),
    from: transfer.from.toLowerCase(),
  }));

/**
 * The `sortTransfers` function sorts array of transfers sorted by block number, transaction index, and log index.
 * @param transfers Array of transfers to sort.
 * @returns Sorted array of transfers.
 * @example sortTransfers([{ blockNumber: 1, transactionIndex: 1, logIndex: 2 }, { blockNumber: 1, transactionIndex: 1, logIndex: 1 }])
 * // => [{ blockNumber: 1, transactionIndex: 1, logIndex: 1 }, { blockNumber: 1, transactionIndex: 1, logIndex: 2 }]
 */
export const sortTransfers = (transfers: Transfer[]): Transfer[] =>
  transfers.sort((a, b) => {
    if (a.blockNumber !== b.blockNumber) {
      return a.blockNumber - b.blockNumber;
    }
    if (a.transactionIndex !== b.transactionIndex) {
      return a.transactionIndex - b.transactionIndex;
    }

    return a.logIndex - b.logIndex;
  });
