import { DescribableEntity } from '../../state-types/describable-entity';
import { Transfer } from '../../state-types/transfer';

export interface GetCollectionTransferRequest extends DescribableEntity {
  readonly contract: string;
  readonly blockNo: number;
}

export interface TransferPool extends GetCollectionTransferRequest {
  readonly transfers: Transfer[];
}
