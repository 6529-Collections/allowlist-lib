import { MapResultsToDelegatedWalletsOperation } from './map-results-to-delegated-wallets-operation';
import { defaultLogFactory } from '../../../logging/logging-emitter';
import { MapResultsToDelegatedWalletsParams } from './map-results-to-delegated-wallets.types';

describe('MapResultsToDelegatedWalletsOperation', () => {
  const op = new MapResultsToDelegatedWalletsOperation(
    { getAllDelegations: jest.fn().mockResolvedValue([]) } as any,
    defaultLogFactory,
  );
  let params: MapResultsToDelegatedWalletsParams;

  beforeEach(() => {
    params = {
      delegationContract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
    };
  });

  it('validates params', () => {
    expect(op.validate(params)).toEqual(true);
  });
});
