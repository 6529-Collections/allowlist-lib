export interface EtherscanApiTokensRawResponseResult {
  readonly address: string;
  readonly topics: string[];
  readonly data: string;
  readonly blockNumber: string;
  readonly timeStamp: string;
  readonly gasPrice: string;
  readonly gasUsed: string;
  readonly logIndex: string;
  readonly transactionHash: string;
  readonly transactionIndex: string;
}

export interface EtherscanApiTokensRawResponse {
  readonly status: string; // '1' === OK, '0' === ERROR;
  readonly message: string; // 'OK' === OK, 'NOTOK' === ERROR;
  readonly result: EtherscanApiTokensRawResponseResult[];
}

export interface EtherscanApiTokenTransferResponse {
  readonly uniqueKey: string;
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
  readonly transferType: string;
}
