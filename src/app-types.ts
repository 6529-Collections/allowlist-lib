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

export type Mutable<T, K extends keyof T> = Omit<T, K> & {
  -readonly [P in K]: T[P];
};
