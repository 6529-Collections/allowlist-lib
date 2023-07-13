export interface CollectionOwner {
  readonly ownerAddress: string;
  readonly tokens: { tokenId: string; balance: number }[];
}
