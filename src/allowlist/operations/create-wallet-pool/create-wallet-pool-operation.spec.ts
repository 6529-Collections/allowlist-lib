import { AllowlistState } from 'src/allowlist/state-types/allowlist-state';
import { CreateWalletPoolOperation } from './create-wallet-pool-operation';
import { WalletPool } from '../../state-types/wallet-pool';
import { anAllowlistState } from '../../../allowlist/state-types/allowlist-state.test.fixture';
import { defaultLogFactory } from '../../../logging/logging-emitter';

describe('CreateWalletPoolOperation', () => {
  const op = new CreateWalletPoolOperation(defaultLogFactory);
  let state: AllowlistState;
  let params: WalletPool;

  beforeEach(() => {
    state = anAllowlistState();
    params = {
      id: 'wp-1',
      name: 'wp 1',
      description: 'wp 1 description',
      wallets: [
        '0xfd22004806a6846ea67ad883356be810f0428793',
        '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
      ],
    };
  });

  it('throws if id is missing', () => {
    expect(() =>
      op.validate({
        name: 'wp 1',
        description: 'wp 1 description',
        wallets: [
          '0xfd22004806a6846ea67ad883356be810f0428793',
          '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        ],
      }),
    ).toThrowError('Missing id');
  });

  it('throws if id is not a string', () => {
    expect(() =>
      op.validate({
        id: 1,
        name: 'wp 1',
        description: 'wp 1 description',
        wallets: [
          '0xfd22004806a6846ea67ad883356be810f0428793',
          '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        ],
      }),
    ).toThrowError('Invalid id');
  });

  it('throws if id is empty', () => {
    expect(() =>
      op.validate({
        id: '',
        name: 'wp 1',
        description: 'wp 1 description',
        wallets: [
          '0xfd22004806a6846ea67ad883356be810f0428793',
          '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        ],
      }),
    ).toThrowError('Invalid id');
  });

  it('throws if name is missing', () => {
    expect(() =>
      op.validate({
        id: 'wp-1',
        description: 'wp 1 description',
        wallets: [
          '0xfd22004806a6846ea67ad883356be810f0428793',
          '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        ],
      }),
    ).toThrowError('Missing name');
  });

  it('throws if name is not a string', () => {
    expect(() =>
      op.validate({
        id: 'wp-1',
        name: 1,
        description: 'wp 1 description',
        wallets: [
          '0xfd22004806a6846ea67ad883356be810f0428793',
          '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        ],
      }),
    ).toThrowError('Invalid name');
  });

  it('throws if name is empty', () => {
    expect(() =>
      op.validate({
        id: 'wp-1',
        name: '',
        description: 'wp 1 description',
        wallets: [
          '0xfd22004806a6846ea67ad883356be810f0428793',
          '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        ],
      }),
    ).toThrowError('Invalid name');
  });

  it('throws if description is missing', () => {
    expect(() =>
      op.validate({
        id: 'wp-1',
        name: 'wp 1',
        wallets: [
          '0xfd22004806a6846ea67ad883356be810f0428793',
          '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        ],
      }),
    ).toThrowError('Missing description');
  });

  it('throws if description is not a string', () => {
    expect(() =>
      op.validate({
        id: 'wp-1',
        name: 'wp 1',
        description: 1,
        wallets: [
          '0xfd22004806a6846ea67ad883356be810f0428793',
          '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        ],
      }),
    ).toThrowError('Invalid description');
  });

  it('throws if description is empty', () => {
    expect(() =>
      op.validate({
        id: 'wp-1',
        name: 'wp 1',
        description: '',
        wallets: [
          '0xfd22004806a6846ea67ad883356be810f0428793',
          '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        ],
      }),
    ).toThrowError('Invalid description');
  });

  it('throws if wallets is missing', () => {
    expect(() =>
      op.validate({
        id: 'wp-1',
        name: 'wp 1',
        description: 'wp 1 description',
      }),
    ).toThrowError('Missing wallets');
  });

  it('throws if wallets is not an array', () => {
    expect(() =>
      op.validate({
        id: 'wp-1',
        name: 'wp 1',
        description: 'wp 1 description',
        wallets: 1,
      }),
    ).toThrowError('Invalid wallets');
  });

  it('throws if wallets is empty', () => {
    expect(() =>
      op.validate({
        id: 'wp-1',
        name: 'wp 1',
        description: 'wp 1 description',
        wallets: [],
      }),
    ).toThrowError('Invalid wallets');
  });

  it('throws if wallets contains non-string values', () => {
    expect(() =>
      op.validate({
        id: 'wp-1',
        name: 'wp 1',
        description: 'wp 1 description',
        wallets: [1, 2],
      }),
    ).toThrowError('Invalid wallets');
  });

  it('throws if wallets contains empty strings', () => {
    expect(() =>
      op.validate({
        id: 'wp-1',
        name: 'wp 1',
        description: 'wp 1 description',
        wallets: ['', ''],
      }),
    ).toThrowError('Invalid wallets');
  });

  it('throws if wallets contains invalid addresses', () => {
    expect(() =>
      op.validate({
        id: 'wp-1',
        name: 'wp 1',
        description: 'wp 1 description',
        wallets: ['0x123', '0x456'],
      }),
    ).toThrowError('Invalid wallets');
  });

  it('throws if wallets contains duplicate addresses', () => {
    expect(() =>
      op.validate({
        id: 'wp-1',
        name: 'wp 1',
        description: 'wp 1 description',
        wallets: [
          '0xfd22004806a6846ea67ad883356be810f0428793',
          '0xfd22004806a6846ea67ad883356be810f0428793',
        ],
      }),
    ).toThrowError('Invalid wallets');
  });

  it('validates params', () => {
    expect(() =>
      op.validate({
        id: 'wp-1',
        name: 'wp 1',
        description: 'wp 1 description',
        wallets: [
          '0xfd22004806a6846ea67ad883356be810f0428793',
          '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
        ],
      }),
    ).not.toThrow();
  });

  it('creates a new wallet pool', () => {
    op.execute({ params, state });
    expect(state.walletPools[params.id]).toEqual(params);
  });
});
