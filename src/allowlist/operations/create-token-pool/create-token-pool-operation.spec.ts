import { AllowlistState } from '../../state-types/allowlist-state';
import { TokenPoolParams } from '../../state-types/token-pool';
import { anAllowlistState } from '../../state-types/allowlist-state.test.fixture';
import { defaultLogFactory } from '../../../logging/logging-emitter';
import { AlchemyService } from '../../../services/alchemy.service';
import { CollectionOwner } from '../../../services/collection-owner';
import { CreateTokenPoolOperation } from './create-token-pool-operation';
import { Alchemy } from 'alchemy-sdk';
import { TransfersService } from '../../../services/transfers.service';
import { EtherscanService } from '../../../services/etherscan.service';
import { ContractSchema } from '../../../app-types';
import { TokenPoolService } from '../../../services/token-pool.service';

class MockAlchemyService extends AlchemyService {
  async getCollectionOwnersInBlock({
    contract,
    block,
  }: {
    contract: string;
    block?: number;
  }): Promise<CollectionOwner[]> {
    return [
      {
        ownerAddress: '0x123',
        tokens: [
          { tokenId: '1', balance: 1 },
          { tokenId: '2', balance: 2 },
        ],
      },
    ];
  }
}

describe('CreateTokenPoolOperation', () => {
  const op = new CreateTokenPoolOperation(
    defaultLogFactory,
    new MockAlchemyService(undefined as Alchemy),
    undefined as TransfersService,
    {
      getTokenPoolTokens: jest.fn().mockResolvedValue(null),
    } as any,
    {
      getContractSchema: jest.fn().mockResolvedValue(ContractSchema.ERC721),
    } as any,
    {
      getAllConsolidations: jest.fn().mockResolvedValue([]),
    } as any,
  );

  let state: AllowlistState;
  let params: TokenPoolParams;

  beforeEach(() => {
    state = anAllowlistState();
    params = {
      id: 'tp-2',
      name: 'tp 2',
      description: 'tp 2 description',
      tokenIds: '10,20-30,40',
      contract: '0x123',
      blockNo: 123,
      consolidateWallets: false,
    };
  });

  it('throws if id is missing', () => {
    expect(() =>
      op.validate({
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: '10,20-30,40',
        contract: '0x123',
        blockNo: 123,
      }),
    ).toThrowError('Missing id');
  });

  it('throws if id is not a string', () => {
    expect(() =>
      op.validate({
        id: 1,
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: '10,20-30,40',
        contract: '0x123',
        blockNo: 123,
      }),
    ).toThrowError('Invalid id');
  });

  it('throws if id is empty', () => {
    expect(() =>
      op.validate({
        id: '',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: '10,20-30,40',
        contract: '0x123',
        blockNo: 123,
      }),
    ).toThrowError('Invalid id');
  });

  it('throws if tokenIds is present but not a string or null or undefined', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: 1,
        contract: '0x123',
        blockNo: 123,
        consolidateWallets: false,
      }),
    ).toThrowError('Invalid tokenIds');
  });

  it('throws if tokenIds is a empty string', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: '',
        contract: '0x123',
        blockNo: 123,
        consolidateWallets: false,
      }),
    ).toThrowError('Invalid tokenIds');
  });

  it('throws if tokenIds is a string with invalid format', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: '1,2,3,x',
        contract: '0x123',
        blockNo: 123,
        consolidateWallets: false,
      }),
    ).toThrowError('Invalid tokenIds');
  });

  it('throws if transferPoolId is missing', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: null,
        blockNo: 123,
        consolidateWallets: false,
      }),
    ).toThrowError('Missing contract');
  });

  it('throws if transferPoolId is not a string', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: null,
        contract: 123,
        blockNo: 123,
      }),
    ).toThrowError('Invalid contract');
  });

  it('throws if transferPoolId is empty', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: null,
        contract: '',
        blockNo: 123,
      }),
    ).toThrowError('Invalid contract');
  });

  it('throws if consolidateWallets is missing', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: null,
        contract: '0x123',
        blockNo: 123,
      }),
    ).toThrowError('Missing consolidateWallets');
  });

  it('throws if consolidateWallets is not a boolean', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: null,
        contract: '0x123',
        blockNo: 123,
        consolidateWallets: 1,
      }),
    ).toThrowError('Invalid consolidateWallets');
  });

  it('validates if tokenIds is null', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: null,
        contract: '0x123',
        blockNo: 123,
        consolidateWallets: false,
      }),
    ).not.toThrow();
  });

  it('validates if tokenIds is undefined', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: undefined,
        contract: '0x123',
        blockNo: 123,
        consolidateWallets: false,
      }),
    ).not.toThrow();
  });

  it('validates if tokenIds is a string with valid format', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: '1,2,3-5,6',
        contract: '0x123',
        blockNo: 123,
        consolidateWallets: false,
      }),
    ).not.toThrow();
  });

  it('creates a token pool ', async () => {
    const state = anAllowlistState();
    await op.execute({
      params: {
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: '1,2,3-5,6',
        contract: '0x123',
        blockNo: 123,
        consolidateWallets: false,
      },
      state: state,
    });
    expect(state.tokenPools['tp-2']).toStrictEqual({
      description: 'tp 2 description',
      id: 'tp-2',
      name: 'tp 2',
      tokenIds: '1,2,3-5,6',
      tokens: [
        {
          contract: '0x123',
          id: '1',
          owner: '0x123',
        },
        {
          contract: '0x123',
          id: '2',
          owner: '0x123',
        },
        {
          contract: '0x123',
          id: '2',
          owner: '0x123',
        },
      ],
    });
  });
});
