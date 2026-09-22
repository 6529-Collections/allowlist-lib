import { AlchemyClient } from './alchemy-client';
import { AlchemyService } from './alchemy.service';

const UINT256_MAX =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';

describe('Alchemy ownership token IDs', () => {
  function serviceFor(tokenId: unknown) {
    const client: AlchemyClient = {
      nft: {
        getOwnersForContract: jest.fn().mockResolvedValue({
          owners: [
            {
              ownerAddress: '0xowner',
              tokenBalances: [{ tokenId, balance: 2 }],
            },
          ],
        }),
      },
      core: { resolveName: jest.fn(), lookupAddress: jest.fn() },
    };
    return new AlchemyService(client);
  }

  it.each([
    ['0', '0'],
    ['10', '10'],
    ['16', '16'],
    ['00010', '10'],
    ['0x0a', '10'],
    ['0X0A', '10'],
    ['0x0010', '16'],
    ['9007199254740993', '9007199254740993'],
    [UINT256_MAX, UINT256_MAX],
    [`0x${'f'.repeat(64)}`, UINT256_MAX],
  ])('reads %s as token %s without precision loss', async (input, expected) => {
    await expect(
      serviceFor(input).getCollectionOwnersInBlock({
        contract: '0xcontract',
        block: 123,
      }),
    ).resolves.toEqual([
      { ownerAddress: '0xowner', tokens: [{ tokenId: expected, balance: 2 }] },
    ]);
  });

  it.each([
    '',
    ' ',
    ' 10',
    '10 ',
    '-1',
    '+10',
    '1.5',
    '1e2',
    '0x',
    '0xgg',
    'a',
    `${UINT256_MAX}0`,
    `0x1${'0'.repeat(64)}`,
    null,
    undefined,
    10,
  ])('rejects malformed or out-of-range token ID %s', async (input) => {
    await expect(
      serviceFor(input).getCollectionOwnersInBlock({ contract: '0xcontract' }),
    ).rejects.toThrow('Invalid Alchemy token ID');
  });
});
