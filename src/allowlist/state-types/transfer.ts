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
}

/**
 * The `sortTransfers` function sorts array of transfers sorted by block number, transaction index, and log index.
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
