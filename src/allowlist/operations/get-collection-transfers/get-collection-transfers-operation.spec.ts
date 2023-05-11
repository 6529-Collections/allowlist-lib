import { GetCollectionTransfersOperation } from './get-collection-transfers-operation';
import { GetCollectionTransferRequest } from './get-collection-transfers-operation.types';
import { anAllowlistState } from '../../state-types/allowlist-state.test.fixture';
import { defaultLogFactory } from '../../../logging/logging-emitter';

describe('GetCollectionTransfersOperation', () => {
  const op = new GetCollectionTransfersOperation({} as any, defaultLogFactory);
  it('throws error if contract address faulty', async () => {
    const state = anAllowlistState();

    await expect(() =>
      op.execute({
        params: {
          id: 'transfers-1',
          name: 'transfers 1',
          description: 'transfers 1 description',
          contract: null,
          blockNo: 100,
        },
        state: state,
      }),
    ).rejects.toThrow(
      'GET_COLLECTION_TRANSFERS: null is not a valid Ethereum address',
    );
    await expect(() =>
      op.execute({
        params: {
          id: 'transfers-2',
          name: 'transfers 2',
          description: 'transfers 2 description',
          contract: '0x123',
          blockNo: 100,
        },
        state: state,
      }),
    ).rejects.toThrow(
      'GET_COLLECTION_TRANSFERS: 0x123 is not a valid Ethereum address',
    );
  });

  it('throws error if block no is faulty', async () => {
    const state = anAllowlistState();
    const params: GetCollectionTransferRequest = {
      id: 'transfers-2',
      name: 'transfers 2',
      description: 'transfers 2 description',
      contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
      blockNo: 0,
    };
    await expect(() =>
      op.execute({
        params,
        state: state,
      }),
    ).rejects.toThrow(
      'GET_COLLECTION_TRANSFERS: 0 is not a valid block number',
    );
  });

  it('gets transfers and adds them to state', async () => {
    const operation = new GetCollectionTransfersOperation(
      {
        getCollectionTransfers: jest.fn().mockResolvedValue([]),
      } as any,
      defaultLogFactory,
    );
    const state = anAllowlistState();
    const params: GetCollectionTransferRequest = {
      id: 'transfers-2',
      name: 'transfers 2',
      description: 'transfers 2 description',
      contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
      blockNo: 1,
    };
    await operation.execute({
      params,
      state: state,
    });
    expect(state.transferPools['transfers-2']).toEqual({
      ...params,
      transfers: [],
    });
  });
});
