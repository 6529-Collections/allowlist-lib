import { TokenPoolConsolidateWalletsOperation } from './token-pool-consolidate-wallets-operation';
import { defaultLogFactory } from './../../../logging/logging-emitter';
import { AllowlistState } from './../../../allowlist/state-types/allowlist-state';
import { TokenPoolConsolidateWalletsParams } from './token-pool-consolidate-wallets.types';
import {
  aTokenPool,
  anAllowlistState,
} from '../../../allowlist/state-types/allowlist-state.test.fixture';
import { Mutable } from '../../../app-types';
import {
  anMemeConsolidations,
  anMemeTokenPoolConsolidatedTokens,
  anMemeTokenPoolTokens,
} from '../../state-types/allowlist-state.test.fixture.large';

describe('TokenPoolConsolidateWalletsOperation', () => {
  const op = new TokenPoolConsolidateWalletsOperation(
    {
      getAllConsolidations: jest.fn().mockResolvedValue(anMemeConsolidations()),
    } as any,
    defaultLogFactory,
  );
  let state: AllowlistState;
  let params: Mutable<
    TokenPoolConsolidateWalletsParams,
    'tokenPoolId' | 'consolidationBlockNumber'
  >;

  beforeEach(() => {
    state = anAllowlistState({
      tokenPools: [
        aTokenPool({
          tokens: anMemeTokenPoolTokens(),
        }),
      ],
    });
    params = {
      tokenPoolId: 'token-pool-1',
      consolidationBlockNumber: 1,
    };
  });

  it('should throw if tokenPoolId is missing', async () => {
    delete params.tokenPoolId;
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Missing tokenPoolId',
    );
  });

  it('should throw if tokenPoolId is not a string', async () => {
    params.tokenPoolId = 1 as any;
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Invalid tokenPoolId',
    );
  });

  it('should throw if tokenPoolId is empty', async () => {
    params.tokenPoolId = '';
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Invalid tokenPoolId',
    );
  });

  it('should throw if consolidationBlockNumber is missing', async () => {
    delete params.consolidationBlockNumber;
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Missing consolidationBlockNumber',
    );
  });

  it('should throw if consolidationBlockNumber is not a number', async () => {
    params.consolidationBlockNumber = '1' as any;
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Invalid consolidationBlockNumber',
    );
  });

  it('should throw if consolidationBlockNumber is negative', async () => {
    params.consolidationBlockNumber = -1;
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Invalid consolidationBlockNumber',
    );
  });

  it('should throw if consolidationBlockNumber is not an integer', async () => {
    params.consolidationBlockNumber = 1.1;
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Invalid consolidationBlockNumber',
    );
  });

  it('should validate params', async () => {
    expect(op.validate(params)).toBe(true);
  });

  it('should throw if tokenPool does not exist', async () => {
    params.tokenPoolId = 'does-not-exist';
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Token pool not found',
    );
  });

  it('consolidates wallets', async () => {
    await op.execute({ params, state });
    expect(state.tokenPools[params.tokenPoolId].tokens).toEqual(
      anMemeTokenPoolConsolidatedTokens(),
    );
  });
});
