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

  it('throws error if token pool with given ID is missing', () => {
    expect(() =>
      op.execute({
        params: { ...params, transferPoolId: '456' },
        state,
      }),
    ).toThrow('CREATE_TOKEN_POOL: Transfer pool 456 not found');
  });

  it('throws error if token IDs is faulty', () => {
    expect(() =>
      op.execute({
        params: { ...params, tokenIds: 'x' },
        state,
      }),
    ).toThrow(
      'CREATE_TOKEN_POOL: TokenIds must be in format: 1, 2, 3, 45, 100-115, 203-780, 999',
    );
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
        since: 1633461296,
      },
      {
        id: '3',
        owner: '0xfd22004806a6846ea67ad883356be810f0428793',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
        since: 1633461296,
      },
      {
        id: '5',
        owner: '0xfd22004806a6846ea67ad883356be810f0428794',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
        since: 1633461297,
      },
      {
        id: '5',
        owner: '0xfd22004806a6846ea67ad883356be810f0428794',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
        since: 1633461298,
      },
      {
        id: '5',
        owner: '0xfd22004806a6846ea67ad883356be810f0428794',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
        since: 1633461298,
      },
      {
        id: '5',
        owner: '0xfd22004806a6846ea67ad883356be810f0428794',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
        since: 1633461298,
      },
      {
        id: '5',
        owner: '0xfd22004806a6846ea67ad883356be810f0428793',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
        since: 1633461299,
      },
      {
        id: '5',
        owner: '0xfd22004806a6846ea67ad883356be810f0428793',
        contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
        since: 1633461299,
      },
    ]);
  });
});
