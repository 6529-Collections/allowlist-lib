import { AllowlistState } from '../../state-types/allowlist-state';
import { CreateTokenPoolOperation } from './create-token-pool-operation';
import { TokenPoolParams } from '../../state-types/token-pool';
import * as fs from 'fs';
import { Transfer } from '../../state-types/transfer';
import {
  anAllowlistState,
  aTransferPool,
} from '../../state-types/allowlist-state.test.fixture';
import { defaultLogFactory } from '../../../logging/logging-emitter';

describe('CreateTokenPoolOperation', () => {
  const op = new CreateTokenPoolOperation(defaultLogFactory);

  let state: AllowlistState;
  let params: TokenPoolParams;

  beforeEach(() => {
    state = anAllowlistState();
    params = {
      id: 'tp-2',
      name: 'tp 2',
      description: 'tp 2 description',
      tokenIds: '10,20-30,40',
      transferPoolId: aTransferPool().id,
    };
  });

  it('throws if id is missing', () => {
    expect(() =>
      op.validate({
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: '10,20-30,40',
        transferPoolId: aTransferPool().id,
      }),
    ).toThrowError('Missing id');
  });

  it('throws if id is not a string', () => {
    expect(() =>
      op.validate({
        id: 1,
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: '10,20-30,40',
        transferPoolId: aTransferPool().id,
      }),
    ).toThrowError('Invalid id');
  });

  it('throws if id is empty', () => {
    expect(() =>
      op.validate({
        id: '',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: '10,20-30,40',
        transferPoolId: aTransferPool().id,
      }),
    ).toThrowError('Invalid id');
  });

  it('throws if tokenIds is present but not a string or null or undefined', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: 1,
        transferPoolId: aTransferPool().id,
      }),
    ).toThrowError('Invalid tokenIds');
  });

  it('throws if tokenIds is a empty string', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: '',
        transferPoolId: aTransferPool().id,
      }),
    ).toThrowError('Invalid tokenIds');
  });

  it('throws if tokenIds is a string with invalid format', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: '1,2,3,x',
        transferPoolId: aTransferPool().id,
      }),
    ).toThrowError('Invalid tokenIds');
  });

  it('throws if transferPoolId is missing', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: null,
      }),
    ).toThrowError('Missing transferPoolId');
  });

  it('throws if transferPoolId is not a string', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: null,
        transferPoolId: 1,
      }),
    ).toThrowError('Invalid transferPoolId');
  });

  it('throws if transferPoolId is empty', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: null,
        transferPoolId: '',
      }),
    ).toThrowError('Invalid transferPoolId');
  });

  it('validates if tokenIds is null', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: null,
        transferPoolId: aTransferPool().id,
      }),
    ).not.toThrow();
  });

  it('validates if tokenIds is undefined', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: undefined,
        transferPoolId: aTransferPool().id,
      }),
    ).not.toThrow();
  });

  it('validates if tokenIds is a string with valid format', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: '1,2,3-5,6',
        transferPoolId: aTransferPool().id,
      }),
    ).not.toThrow();
  });

  it('throws error if token pool with given ID is missing', () => {
    expect(() =>
      op.execute({
        params: { ...params, transferPoolId: '456' },
        state,
      }),
    ).toThrow('CREATE_TOKEN_POOL: Transfer pool 456 not found');
  });

  it('parses 0 transactions and forms an empty token pool', () => {
    state = anAllowlistState({
      transferPools: [aTransferPool({ transfers: [] })],
    });
    op.execute({
      params,
      state,
    });
    expect(state.tokenPools['tp-2'].tokens).toEqual([]);
  });

  it('parses transactions and creates a state', () => {
    const transfers = JSON.parse(
      fs.readFileSync(
        `mock-data/0x0c58ef43ff3032005e472cb5709f8908acb00205-small.json`,
        'utf8',
      ),
    ).filter((transfer: Transfer) => transfer.blockNumber <= Infinity);
    state = anAllowlistState({
      transferPools: [aTransferPool({ transfers: transfers })],
    });
    const mockedParams = { ...params, tokenIds: '2-3,5' };
    op.execute({
      params: mockedParams,
      state,
    });
    expect(state.tokenPools['tp-2'].tokens).toEqual([
      {
        id: '2',
        owner: '0xfd22004806a6846ea67ad883356be810f0428793',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
      },
      {
        id: '3',
        owner: '0xfd22004806a6846ea67ad883356be810f0428793',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
      },
      {
        id: '5',
        owner: '0xfd22004806a6846ea67ad883356be810f0428794',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
      },
      {
        id: '5',
        owner: '0xfd22004806a6846ea67ad883356be810f0428794',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
      },
      {
        id: '5',
        owner: '0xfd22004806a6846ea67ad883356be810f0428794',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
      },
      {
        id: '5',
        owner: '0xfd22004806a6846ea67ad883356be810f0428794',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
      },
      {
        id: '5',
        owner: '0xfd22004806a6846ea67ad883356be810f0428793',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
      },
      {
        id: '5',
        owner: '0xfd22004806a6846ea67ad883356be810f0428793',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
      },
    ]);
  });
});
