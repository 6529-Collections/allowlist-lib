import { AllowlistState } from '../../../allowlist/state-types/allowlist-state';
import { CreateCustomTokenPoolOperation } from './create-custom-token-pool-operation';
import {
  aCustomTokenPool,
  anAllowlistState,
} from '../../../allowlist/state-types/allowlist-state.test.fixture';
import { CustomTokenPoolParams } from './create-custom-token-pool-operation.types';

describe('CreateCustomTokenPoolOperation', () => {
  const op = new CreateCustomTokenPoolOperation();

  let state: AllowlistState;
  let params: CustomTokenPoolParams;

  beforeEach(() => {
    state = anAllowlistState();
    params = {
      id: 'ctp-2',
      name: 'ctp 2',
      description: 'ctp 2 description',
      tokens: [
        {
          id: '1',
          owner: '0xfd22004806a6846ea67ad883356be810f0428793',
          since: 1683565041531,
        },
        {
          id: '2',
          owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
          since: 1683565041531,
        },
      ],
    };
  });

  it('throws error if tokens is not an array', () => {
    state = anAllowlistState({
      customTokenPools: [aCustomTokenPool({ id: 'ctp-1' })],
    });
    expect(() =>
      op.execute({
        params: { ...params, tokens: 123 as any },
        state,
      }),
    ).toThrow(
      'CREATE_CUSTOM_TOKEN_POOL: Custom token pool tokens must be an array',
    );
  });

  it('throws error if tokens is empty array', () => {
    state = anAllowlistState({
      customTokenPools: [aCustomTokenPool({ id: 'ctp-1' })],
    });
    expect(() =>
      op.execute({
        params: { ...params, tokens: [] },
        state,
      }),
    ).toThrow(
      'CREATE_CUSTOM_TOKEN_POOL: Custom token pool tokens must be a non-empty array',
    );
  });

  it('throws error if tokens array contains non-object', () => {
    state = anAllowlistState({
      customTokenPools: [aCustomTokenPool({ id: 'ctp-1' })],
    });
    expect(() =>
      op.execute({
        params: { ...params, tokens: [123 as any] },
        state,
      }),
    ).toThrow(
      'CREATE_CUSTOM_TOKEN_POOL: Custom token pool tokens must be an array of objects',
    );
  });

  it('throws error if some tokens have id and others do not', () => {
    state = anAllowlistState({
      customTokenPools: [aCustomTokenPool({ id: 'ctp-1' })],
    });
    expect(() =>
      op.execute({
        params: {
          ...params,
          tokens: [
            { id: '1', owner: '0xfd22004806a6846ea67ad883356be810f0428793' },
            { owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd' },
          ],
        },
        state,
      }),
    ).toThrow(
      'CREATE_CUSTOM_TOKEN_POOL: All tokens must have id or none of them',
    );
  });

  it('throws error if some tokens have since and others do not', () => {
    state = anAllowlistState({
      customTokenPools: [aCustomTokenPool({ id: 'ctp-1' })],
    });
    expect(() =>
      op.execute({
        params: {
          ...params,
          tokens: [
            {
              id: '1',
              owner: '0xfd22004806a6846ea67ad883356be810f0428793',
              since: 1683565041531,
            },
            { id: '2', owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd' },
          ],
        },
        state,
      }),
    ).toThrow(
      'CREATE_CUSTOM_TOKEN_POOL: All tokens must have since or none of them',
    );
  });

  it('throws error if token id is present and is not a string', () => {
    state = anAllowlistState({
      customTokenPools: [aCustomTokenPool({ id: 'ctp-1' })],
    });
    expect(() =>
      op.execute({
        params: {
          ...params,
          tokens: [
            {
              id: 123 as any,
              owner: '0xfd22004806a6846ea67ad883356be810f0428793',
              since: 1683565041531,
            },
          ],
        },
        state,
      }),
    ).toThrow('CREATE_CUSTOM_TOKEN_POOL: Token id must be a string');
  });

  it('throws error if token owner is not a string', () => {
    state = anAllowlistState({
      customTokenPools: [aCustomTokenPool({ id: 'ctp-1' })],
    });
    expect(() =>
      op.execute({
        params: {
          ...params,
          tokens: [
            {
              id: '1',
              owner: 123 as any,
              since: 1683565041531,
            },
          ],
        },
        state,
      }),
    ).toThrow('CREATE_CUSTOM_TOKEN_POOL: Token owner must be a string');
  });

  it('throws error if token owner is not a valid address', () => {
    state = anAllowlistState({
      customTokenPools: [aCustomTokenPool({ id: 'ctp-1' })],
    });
    expect(() =>
      op.execute({
        params: {
          ...params,
          tokens: [
            {
              id: '1',
              owner: '0x123',
              since: 1683565041531,
            },
          ],
        },
        state,
      }),
    ).toThrow(
      `CREATE_CUSTOM_TOKEN_POOL: Token owner 0x123 is not a valid Ethereum address`,
    );
  });

  it('throws error if token since is present and not a number', () => {
    state = anAllowlistState({
      customTokenPools: [aCustomTokenPool({ id: 'ctp-1' })],
    });
    expect(() =>
      op.execute({
        params: {
          ...params,
          tokens: [
            {
              id: '1',
              owner: '0xfd22004806a6846ea67ad883356be810f0428793',
              since: '1683565041531' as any,
            },
          ],
        },
        state,
      }),
    ).toThrow('CREATE_CUSTOM_TOKEN_POOL: Token since must be a number');
  });

  it('creates a new custom token pool', () => {
    op.execute({ params, state });
    expect(state.customTokenPools[params.id]).toEqual(params);
  });

  it('creates a new custom token pool with missing token ids', () => {
    op.execute({
      params: {
        ...params,
        tokens: [
          {
            owner: '0xfd22004806a6846ea67ad883356be810f0428793',
            since: 1683565041531,
          },
          {
            owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
            since: 1683565041531,
          },
        ],
      },
      state,
    });
    expect(state.customTokenPools[params.id]).toEqual({
      ...params,
      tokens: [
        {
          id: '1',
          owner: '0xfd22004806a6846ea67ad883356be810f0428793',
          since: 1683565041531,
        },
        {
          id: '2',
          owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
          since: 1683565041531,
        },
      ],
    });
  });
});
