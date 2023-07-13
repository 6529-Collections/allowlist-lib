import { TransferPoolConsolidateWalletsOperation } from './transfer-pool-consolidate-wallets-operation';
import { defaultLogFactory } from './../../../logging/logging-emitter';
import { AllowlistState } from './../../../allowlist/state-types/allowlist-state';
import { TransferPoolConsolidateWalletsParams } from './transfer-pool-consolidate-wallets.types';
import {
  aTransferPool,
  anAllowlistState,
} from '../../../allowlist/state-types/allowlist-state.test.fixture';
import { Mutable } from '../../../app-types';
import { anAllowlistLargeTransfers } from '../../state-types/allowlist-state.test.fixture.large';

describe('TransferPoolConsolidateWalletsOperation', () => {
  const op = new TransferPoolConsolidateWalletsOperation(
    {
      getAllConsolidations: jest.fn().mockResolvedValue([]),
    } as any,
    defaultLogFactory,
  );
  let state: AllowlistState;
  let params: Mutable<
    TransferPoolConsolidateWalletsParams,
    'transferPoolId' | 'consolidationBlockNumber'
  >;

  beforeEach(() => {
    state = anAllowlistState({
      transferPools: [
        aTransferPool({
          transfers: anAllowlistLargeTransfers(),
        }),
      ],
    });
    params = {
      transferPoolId: 'transfer-pool-1',
      consolidationBlockNumber: 1,
    };
  });

  it('should throw if transferPoolId is missing', async () => {
    delete params.transferPoolId;
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Missing transferPoolId',
    );
  });

  it('should throw if transferPoolId is not a string', async () => {
    params.transferPoolId = 1 as any;
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Invalid transferPoolId',
    );
  });

  it('should throw if transferPoolId is empty', async () => {
    params.transferPoolId = '';
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Invalid transferPoolId',
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

  it('validates params', async () => {
    expect(op.validate(params)).toBe(true);
  });

  it('throws if transferPoolId does not exist', async () => {
    params.transferPoolId = 'does-not-exist';
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Transfer pool does-not-exist not found',
    );
  });

  it('consolidates wallets', async () => {
    await op.execute({ params, state });
    console.log(
      JSON.stringify(state.transferPools[params.transferPoolId].transfers),
    );
    expect(state.transferPools[params.transferPoolId].transfers).toEqual(
      anAllowlistLargeTransfers(),
    );
  });
});
