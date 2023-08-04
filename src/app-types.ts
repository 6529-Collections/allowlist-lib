export enum ContractSchema {
  ERC721 = 'ERC721',
  ERC721Old = 'ERC721Old',
  ERC1155 = 'ERC1155',
}

export enum Pool {
  TOKEN_POOL = 'TOKEN_POOL',
  CUSTOM_TOKEN_POOL = 'CUSTOM_TOKEN_POOL',
  WALLET_POOL = 'WALLET_POOL',
}

export enum CardStatistics {
  TOTAL_CARDS = 'TOTAL_CARDS',
  UNIQUE_CARDS = 'UNIQUE_CARDS',
}

export type Mutable<T, K extends keyof T> = Omit<T, K> & {
  -readonly [P in K]: T[P];
};

export const MEMES_CONTRACT = '0x33fd426905f149f8376e227d0c9d3340aad17af1';
