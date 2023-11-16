import { AllowlistState } from '../../state-types/allowlist-state';
import { anAllowlistState } from '../../state-types/allowlist-state.test.fixture';
import { defaultLogFactory } from '../../../logging/logging-emitter';
import { AlchemyService } from '../../../services/alchemy.service';
import { CollectionOwner } from '../../../services/collection-owner';
import { CreateTokenPoolOperation } from './create-token-pool-operation';
import { Alchemy } from 'alchemy-sdk';
import { TransfersService } from '../../../services/transfers.service';
import { ContractSchema } from '../../../app-types';

class MockAlchemyService extends AlchemyService {
  async getCollectionOwnersInBlock(_: {
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
  let op: CreateTokenPoolOperation;

  function getCreateTokenPoolOperation(sanctionedWallet: string) {
    return new CreateTokenPoolOperation(
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
      {
        getProfilesForSanctionedWallets: jest.fn().mockResolvedValue({
          [sanctionedWallet]: {
            recordId: sanctionedWallet,
            wallet: sanctionedWallet,
            profile: `https://sanctionssearch.ofac.treas.gov/Details.aspx?id=${sanctionedWallet}`,
            listProvider: 'OFAC',
          },
        }),
      } as any,
    );
  }

  beforeAll(() => {
    op = getCreateTokenPoolOperation('0xbad');
  });

  let state: AllowlistState;

  beforeEach(() => {
    state = anAllowlistState();
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
        consolidateBlockNo: null,
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
        consolidateBlockNo: null,
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
        consolidateBlockNo: null,
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
        consolidateBlockNo: null,
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

  it('validates if tokenIds is null', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: null,
        contract: '0x123',
        blockNo: 123,
        consolidateBlockNo: null,
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
        consolidateBlockNo: null,
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
        consolidateBlockNo: null,
      }),
    ).not.toThrow();
  });

  it('throws if consolidateBlockNo is not a number or null', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: null,
        contract: '0x123',
        blockNo: 123,
        consolidateBlockNo: '123',
      }),
    ).toThrowError('Invalid consolidateBlockNo');
  });

  it('throws if consolidateBlockNo is a negative number', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: null,
        contract: '0x123',
        blockNo: 123,
        consolidateBlockNo: -1,
      }),
    ).toThrowError('Invalid consolidateBlockNo');
  });

  it('throws if consolidateBlockNo is a float number', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: null,
        contract: '0x123',
        blockNo: 123,
        consolidateBlockNo: 1.1,
      }),
    ).toThrowError('Invalid consolidateBlockNo');
  });

  it('validates if consolidateBlockNo is null', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: null,
        contract: '0x123',
        blockNo: 123,
        consolidateBlockNo: null,
      }),
    ).not.toThrow();
  });

  it('validates if consolidateBlockNo is a number', () => {
    expect(() =>
      op.validate({
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: null,
        contract: '0x123',
        blockNo: 123,
        consolidateBlockNo: 1,
      }),
    ).not.toThrow();
  });

  it('creates a token pool with sanctioned owners', async () => {
    op = getCreateTokenPoolOperation('0x123');
    await op.execute({
      params: {
        id: 'tp-2',
        name: 'tp 2',
        description: 'tp 2 description',
        tokenIds: '1,2,3-5,6',
        contract: '0x123',
        blockNo: 123,
        consolidateBlockNo: null,
      },
      state: state,
    });
    expect(state.tokenPools['tp-2'].tokens).toStrictEqual([]);
  });
});
