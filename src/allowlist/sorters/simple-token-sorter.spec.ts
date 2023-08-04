import { SimpleTokenSorter } from './simple-token-sorter';

describe('Simple tokensorter', () => {
  it('sorts total tokens', async () => {
    const sorter = new SimpleTokenSorter();
    const sorted = await sorter.sortByTotalTokensCount({
      tokens: [
        {
          id: '1',
          owner: '0x1',
        },
        {
          id: '2',
          owner: '0x2',
        },
        {
          id: '1',
          owner: '0x1',
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
        id: '1',
        owner: '0x1',
      },
      {
        id: '2',
        owner: '0x2',
      },
    ]);
  });

  it('sorts unique tokens', async () => {
    const sorter = new SimpleTokenSorter();
    const sorted = await sorter.sortByUniqueTokensCount({
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
      ],
      contract: null,
      blockNo: null,
      consolidateBlockNo: null,
    });

    expect(sorted).toEqual([
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

  it('throws exception on tdh sort', async () => {
    const sorter = new SimpleTokenSorter();
    try {
      await sorter.sortByTdh({
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
        ],
        blockNo: null,
        tdhs: [],
      });
      throw new Error('Method should not be implemented');
    } catch (e) {
      expect(e.message).toEqual('Method not implemented in SimpleTokenSorter');
    }
  });
});
