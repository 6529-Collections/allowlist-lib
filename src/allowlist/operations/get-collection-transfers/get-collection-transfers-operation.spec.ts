import { GetCollectionTransfersOperation } from './get-collection-transfers-operation';
import { GetCollectionTransferRequest } from './get-collection-transfers-operation.types';
import { anAllowlistState } from '../../state-types/allowlist-state.test.fixture';
import { defaultLogFactory } from '../../../logging/logging-emitter';

describe('GetCollectionTransfersOperation', () => {
  const op = new GetCollectionTransfersOperation({} as any, defaultLogFactory);

  it('throws if id is missing', () => {
    expect(() =>
      op.validate({
        name: 'transfers 1',
        description: 'transfers 1 description',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
        blockNo: 1,
      }),
    ).toThrow('Missing id');
  });

  it('throws if id is not a string', () => {
    expect(() =>
      op.validate({
        id: 1,
        name: 'transfers 1',
        description: 'transfers 1 description',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
        blockNo: 1,
      }),
    ).toThrow('Invalid id');
  });

  it('throws if id is empty', () => {
    expect(() =>
      op.validate({
        id: '',
        name: 'transfers 1',
        description: 'transfers 1 description',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
        blockNo: 1,
      }),
    ).toThrow('Invalid id');
  });

  it('throws if contract is missing', () => {
    expect(() =>
      op.validate({
        id: 'transfers-1',
        name: 'transfers 1',
        description: 'transfers 1 description',
        blockNo: 1,
      }),
    ).toThrow('Missing contract');
  });

  it('throws if contract is not a string', () => {
    expect(() =>
      op.validate({
        id: 'transfers-1',
        name: 'transfers 1',
        description: 'transfers 1 description',
        contract: 1,
        blockNo: 1,
      }),
    ).toThrow('Invalid contract');
  });

  it('throws if contract is empty', () => {
    expect(() =>
      op.validate({
        id: 'transfers-1',
        name: 'transfers 1',
        description: 'transfers 1 description',
        contract: '',
        blockNo: 1,
      }),
    ).toThrow('Invalid contract');
  });

  it('throws if contract is not a valid ethereum address', () => {
    expect(() =>
      op.validate({
        id: 'transfers-1',
        name: 'transfers 1',
        description: 'transfers 1 description',
        contract: '0x',
        blockNo: 1,
      }),
    ).toThrow('Invalid contract');
  });

  it('throws if blockNo is missing', () => {
    expect(() =>
      op.validate({
        id: 'transfers-1',
        name: 'transfers 1',
        description: 'transfers 1 description',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
      }),
    ).toThrow('Missing blockNo');
  });

  it('throws if blockNo is not a number', () => {
    expect(() =>
      op.validate({
        id: 'transfers-1',
        name: 'transfers 1',
        description: 'transfers 1 description',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
        blockNo: '1',
      }),
    ).toThrow('Invalid blockNo');
  });

  it('throws if blockNo is negative', () => {
    expect(() =>
      op.validate({
        id: 'transfers-1',
        name: 'transfers 1',
        description: 'transfers 1 description',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
        blockNo: -1,
      }),
    ).toThrow('Invalid blockNo');
  });

  it('throws if blockNo is zero', () => {
    expect(() =>
      op.validate({
        id: 'transfers-1',
        name: 'transfers 1',
        description: 'transfers 1 description',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
        blockNo: 0,
      }),
    ).toThrow('Invalid blockNo');
  });

  it('throws if blockNo is not an integer', () => {
    expect(() =>
      op.validate({
        id: 'transfers-1',
        name: 'transfers 1',
        description: 'transfers 1 description',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
        blockNo: 1.1,
      }),
    ).toThrow('Invalid blockNo');
  });

  it('validates params', () => {
    expect(
      op.validate({
        id: 'transfers-1',
        name: 'transfers 1',
        description: 'transfers 1 description',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
        blockNo: 1,
      }),
    ).toEqual(true);
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
