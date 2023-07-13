import { TransferPoolConsolidateWalletsOperation } from './transfer-pool-consolidate-wallets-operation';
import { defaultLogFactory } from './../../../logging/logging-emitter';
import { AllowlistState } from './../../../allowlist/state-types/allowlist-state';
import { TransferPoolConsolidateWalletsParams } from './transfer-pool-consolidate-wallets.types';
import { anAllowlistState } from '../../../allowlist/state-types/allowlist-state.test.fixture';

describe('TransferPoolConsolidateWalletsOperation', () => {
  const op = new TransferPoolConsolidateWalletsOperation(
    {
      getUploadsForBlock: jest.fn().mockResolvedValue([]),
    } as any,
    defaultLogFactory,
  );
  let state: AllowlistState;
  let params: TransferPoolConsolidateWalletsParams;

  beforeEach(() => {
    state = anAllowlistState();
    params = {
      transferPoolId: 'transfer-pool-id',
      consolidationBlockNumber: 1,
    };
  });

  it('validates params', () => {
    expect(op.validate(params)).toEqual(true);
  });
});
