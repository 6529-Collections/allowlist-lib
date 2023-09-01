import { SimpleTokenSorter } from './simple-token-sorter';
import { MemesTokenSorter } from './memes-token-sorter';
import { ConsolidatedTdhInfo, TdhInfo } from '../../services/seize/tdh-info';

describe('Simple tokensorter', () => {
  it('sorts total tokens', async () => {
    const sorter = new MemesTokenSorter({
      getUploadsForBlock: async (): Promise<TdhInfo[]> => [
        {
          wallet: '0x1',
          boosted_memes_tdh: 2,
        } as unknown as TdhInfo,
        {
          wallet: '0x2',
          boosted_memes_tdh: 1,
        } as unknown as TdhInfo,
        {
          wallet: '0x3',
          boosted_memes_tdh: 3,
        } as unknown as TdhInfo,
      ],
    } as any);
    const sorted = await sorter.sortByTotalTokensCount({
      tokens: [
        {
          id: '1',
          owner: '0x1',
        },
        {
          id: '1',
          owner: '0x2',
        },
        {
          id: '2',
          owner: '0x1',
        },
        {
          id: '2',
          owner: '0x2',
        },
        {
          id: '1',
          owner: '0x3',
        },
      ],
      contract: null,
      blockNo: null,
      consolidateBlockNo: null,
    });
    expect(sorted).toEqual([
      {
        id: '1',
        owner: '0x1',
      },
      {
        id: '2',
        owner: '0x1',
      },
      {
        id: '1',
        owner: '0x2',
      },
      {
        id: '2',
        owner: '0x2',
      },
      {
        id: '1',
        owner: '0x3',
      },
    ]);
  });

  it('sorts unique tokens', async () => {
    const sorter = new MemesTokenSorter({
      getUploadsForBlock: async (): Promise<TdhInfo[]> => [
        {
          wallet: '0x1',
          boosted_memes_tdh: 2,
        } as unknown as TdhInfo,
        {
          wallet: '0x2',
          boosted_memes_tdh: 1,
        } as unknown as TdhInfo,
        {
          wallet: '0x3',
          boosted_memes_tdh: 3,
        } as unknown as TdhInfo,
      ],
    } as any);
    const sorted = await sorter.sortByUniqueTokensCount({
      tokens: [
        {
          id: '1',
          owner: '0x1',
        },
        {
          id: '2',
          owner: '0x1',
        },
        {
          id: '1',
          owner: '0x2',
        },
        {
          id: '2',
          owner: '0x2',
        },
        {
          id: '1',
          owner: '0x3',
        },
      ],
      contract: null,
      blockNo: null,
      consolidateBlockNo: null,
    });

    expect(sorted).toEqual([
      {
        id: '1',
        owner: '0x1',
      },
      {
        id: '2',
        owner: '0x1',
      },
      {
        id: '1',
        owner: '0x2',
      },
      {
        id: '2',
        owner: '0x2',
      },
      {
        id: '1',
        owner: '0x3',
      },
    ]);
  });

  it('throws exception on tdh sort', async () => {
    const sorter = new MemesTokenSorter({
      getUploadsForBlock: async (): Promise<TdhInfo[]> => [
        {
          wallet: '0x1',
          boosted_memes_tdh: 1,
        } as unknown as TdhInfo,
        {
          wallet: '0x2',
          boosted_memes_tdh: 2,
        } as unknown as TdhInfo,
        {
          wallet: '0x3',
          boosted_memes_tdh: 3,
        } as unknown as TdhInfo,
      ],
    } as any);
    const sorted = await sorter.sortByTdh({
      tokens: [
        {
          id: '1',
          owner: '0x1',
        },
        {
          id: '1',
          owner: '0x1',
        },
        {
          id: '1',
          owner: '0x2',
        },
        {
          id: '2',
          owner: '0x2',
        },
        {
          id: '1',
          owner: '0x3',
        },
      ],
      blockNo: null,
      consolidateBlockNo: null,
    });

    expect(sorted).toEqual([
      {
        id: '1',
        owner: '0x3',
      },
      {
        id: '1',
        owner: '0x2',
      },
      {
        id: '2',
        owner: '0x2',
      },
      {
        id: '1',
        owner: '0x1',
      },
      {
        id: '1',
        owner: '0x1',
      },
    ]);
  });
});
