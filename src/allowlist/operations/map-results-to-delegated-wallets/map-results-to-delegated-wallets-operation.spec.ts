import { MapResultsToDelegatedWalletsOperation } from './map-results-to-delegated-wallets-operation';
import { defaultLogFactory } from './../../../logging/logging-emitter';
import { AllowlistState } from './../../../allowlist/state-types/allowlist-state';
import { MapResultsToDelegatedWalletsParams } from './map-results-to-delegated-wallets.types';
import { anAllowlistState } from '../../../allowlist/state-types/allowlist-state.test.fixture';

describe('MapResultsToDelegatedWalletsOperation', () => {
  const op = new MapResultsToDelegatedWalletsOperation(
    { getAllDelegations: jest.fn().mockResolvedValue([]) } as any,
    defaultLogFactory,
  );
  let state: AllowlistState;
  let params: MapResultsToDelegatedWalletsParams;

  beforeEach(() => {
    state = anAllowlistState();
    params = {
      delegationContract: '0x123',
    };
  });

  it('validates params', () => {
    expect(op.validate({})).toEqual(true);
  });
});
