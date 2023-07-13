export interface CollectionOwner {
  readonly ownerAddress: string;
  readonly tokens: { tokenId: number; balance: number }[];
}
