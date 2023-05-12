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

  it('throws if id is missing', () => {
    expect(() =>
      op.validate({
        name: 'ctp 2',
        description: 'ctp 2 description',
        tokens: [],
      }),
    ).toThrowError('Missing id');
  });

  it('throws if id is not a string', () => {
    expect(() =>
      op.validate({
        id: 1,
        name: 'ctp 2',
        description: 'ctp 2 description',
        tokens: [],
      }),
    ).toThrowError('Invalid id');
  });

  it('throws if id is empty', () => {
    expect(() =>
      op.validate({
        id: '',
        name: 'ctp 2',
        description: 'ctp 2 description',
        tokens: [],
      }),
    ).toThrowError('Invalid id');
  });

  it('throws if name is missing', () => {
    expect(() =>
      op.validate({
        id: 'ctp-2',
        description: 'ctp 2 description',
        tokens: [],
      }),
    ).toThrowError('Missing name');
  });

  it('throws if name is not a string', () => {
    expect(() =>
      op.validate({
        id: 'ctp-2',
        name: 1,
        description: 'ctp 2 description',
        tokens: [],
      }),
    ).toThrowError('Invalid name');
  });

  it('throws if name is empty', () => {
    expect(() =>
      op.validate({
        id: 'ctp-2',
        name: '',
        description: 'ctp 2 description',
        tokens: [],
      }),
    ).toThrowError('Invalid name');
  });

  it('throws if description is missing', () => {
    expect(() =>
      op.validate({
        id: 'ctp-2',
        name: 'ctp 2',
        tokens: [],
      }),
    ).toThrowError('Missing description');
  });

  it('throws if description is not a string', () => {
    expect(() =>
      op.validate({
        id: 'ctp-2',
        name: 'ctp 2',
        description: 1,
        tokens: [],
      }),
    ).toThrowError('Invalid description');
  });

  it('throws if description is empty', () => {
    expect(() =>
      op.validate({
        id: 'ctp-2',
        name: 'ctp 2',
        description: '',
        tokens: [],
      }),
    ).toThrowError('Invalid description');
  });

  it('throws if tokens is missing', () => {
    expect(() =>
      op.validate({
        id: 'ctp-2',
        name: 'ctp 2',
        description: 'ctp 2 description',
      }),
    ).toThrowError('Missing tokens');
  });

  it('throws if tokens is not an array', () => {
    expect(() =>
      op.validate({
        id: 'ctp-2',
        name: 'ctp 2',
        description: 'ctp 2 description',
        tokens: 1,
      }),
    ).toThrowError('Invalid tokens');
  });

  it('throws if tokens is empty', () => {
    expect(() =>
      op.validate({
        id: 'ctp-2',
        name: 'ctp 2',
        description: 'ctp 2 description',
        tokens: [],
      }),
    ).toThrowError('Invalid tokens');
  });

  it('throws if tokens is not an array of objects', () => {
    expect(() =>
      op.validate({
        id: 'ctp-2',
        name: 'ctp 2',
        description: 'ctp 2 description',
        tokens: [1],
      }),
    ).toThrowError('Invalid tokens');
  });

  it('throws if some token have id and some not', () => {
    expect(() =>
      op.validate({
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
            owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
            since: 1683565041531,
          },
        ],
      }),
    ).toThrowError('Invalid tokens');
  });

  it('throws if some token have since and some not', () => {
    expect(() =>
      op.validate({
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
          },
        ],
      }),
    ).toThrowError('Invalid tokens');
  });

  it('throws if token id is not string', () => {
    expect(() =>
      op.validate({
        id: 'ctp-2',
        name: 'ctp 2',
        description: 'ctp 2 description',
        tokens: [
          {
            id: 1,
            owner: '0xfd22004806a6846ea67ad883356be810f0428793',
            since: 1683565041531,
          },
        ],
      }),
    ).toThrowError('Invalid tokens');
  });

  it('throws is token id is empty', () => {
    expect(() =>
      op.validate({
        id: 'ctp-2',
        name: 'ctp 2',
        description: 'ctp 2 description',
        tokens: [
          {
            id: '',
            owner: '0xfd22004806a6846ea67ad883356be810f0428793',
            since: 1683565041531,
          },
        ],
      }),
    ).toThrowError('Invalid tokens');
  });

  it('throws if token since is not number', () => {
    expect(() =>
      op.validate({
        id: 'ctp-2',
        name: 'ctp 2',
        description: 'ctp 2 description',
        tokens: [
          {
            id: '1',
            owner: '0xfd22004806a6846ea67ad883356be810f0428793',
            since: '1683565041531',
          },
        ],
      }),
    ).toThrowError('Invalid tokens');
  });

  it('throws if token since is negative number', () => {
    expect(() =>
      op.validate({
        id: 'ctp-2',
        name: 'ctp 2',
        description: 'ctp 2 description',
        tokens: [
          {
            id: '1',
            owner: '0xfd22004806a6846ea67ad883356be810f0428793',
            since: -1,
          },
        ],
      }),
    ).toThrowError('Invalid tokens');
  });

  it('throws if token since is not integer number', () => {
    expect(() =>
      op.validate({
        id: 'ctp-2',
        name: 'ctp 2',
        description: 'ctp 2 description',
        tokens: [
          {
            id: '1',
            owner: '0xfd22004806a6846ea67ad883356be810f0428793',
            since: 1.1,
          },
        ],
      }),
    ).toThrowError('Invalid tokens');
  });

  it('throws if token missing owner', () => {
    expect(() =>
      op.validate({
        id: 'ctp-2',
        name: 'ctp 2',
        description: 'ctp 2 description',
        tokens: [
          {
            id: '1',
            since: 1683565041531,
          },
        ],
      }),
    ).toThrowError('Invalid tokens');
  });

  it('throws if token owner is not string', () => {
    expect(() =>
      op.validate({
        id: 'ctp-2',
        name: 'ctp 2',
        description: 'ctp 2 description',
        tokens: [
          {
            id: '1',
            owner: 1,
            since: 1683565041531,
          },
        ],
      }),
    ).toThrowError('Invalid tokens');
  });

  it('throws if token owner is empty string', () => {
    expect(() =>
      op.validate({
        id: 'ctp-2',
        name: 'ctp 2',
        description: 'ctp 2 description',
        tokens: [
          {
            id: '1',
            owner: '',
            since: 1683565041531,
          },
        ],
      }),
    ).toThrowError('Invalid tokens');
  });

  it('throws if token owner is not valid address', () => {
    expect(() =>
      op.validate({
        id: 'ctp-2',
        name: 'ctp 2',
        description: 'ctp 2 description',
        tokens: [
          {
            id: '1',
            owner: '0x',
            since: 1683565041531,
          },
        ],
      }),
    ).toThrowError('Invalid tokens');
  });

  it('validates params', () => {
    const params = {
      id: 'ctp-1',
      name: 'ctp 1',
      description: 'ctp 1 description',
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
    expect(op.validate(params)).toEqual(true);
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
