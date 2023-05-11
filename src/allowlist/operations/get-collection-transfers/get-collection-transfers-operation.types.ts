import { DescribableEntity } from 'src/allowlist/state-types/describable-entity';
import { Transfer } from 'src/allowlist/state-types/transfer';

export interface GetCollectionTransferRequest extends DescribableEntity {
  readonly contract: string;
  readonly blockNo: number;
}

export interface TransferPool extends GetCollectionTransferRequest {
  readonly transfers: Transfer[];
}
