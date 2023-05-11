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

  it('throws error if wallets is not an array', () => {
    expect(() =>
      op.execute({
        params: { ...params, wallets: 123 as any },
        state,
      }),
    ).toThrow('CREATE_WALLET_POOL: Wallets must be an array');
  });

  it('throws error if wallets array is empty', () => {
    expect(() =>
      op.execute({
        params: { ...params, wallets: [] },
        state,
      }),
    ).toThrow('CREATE_WALLET_POOL: Wallets array must not be empty');
  });

  it('throws error if wallets array contains non-string values', () => {
    expect(() =>
      op.execute({
        params: { ...params, wallets: [123 as any] },
        state,
      }),
    ).toThrow('CREATE_WALLET_POOL: Wallets must be an array of strings');
  });

  it('throws error if wallets array contains non-Ethereum addresses', () => {
    expect(() =>
      op.execute({
        params: { ...params, wallets: ['0x123'] },
        state,
      }),
    ).toThrow(
      'CREATE_WALLET_POOL: Wallet 0x123 is not a valid Ethereum address',
    );
  });

  it('throws error if wallets array contains duplicated values', () => {
    expect(() =>
      op.execute({
        params: {
          ...params,
          wallets: [
            '0x152afd373a91d0cb04132c80cf24d26f1e3fc0a9',
            '0x152afd373a91d0cb04132c80cf24d26f1e3fc0a9',
          ],
        },
        state,
      }),
    ).toThrow(
      'CREATE_WALLET_POOL: Wallet 0x152afd373a91d0cb04132c80cf24d26f1e3fc0a9 is duplicated',
    );
  });

  it('creates a new wallet pool', () => {
    op.execute({ params, state });
    expect(state.walletPools[params.id]).toEqual(params);
  });
});
