import { ItemSortWalletsByMemesTdhOperation } from './item-sort-wallets-by-memes-tdh-operation';
import { defaultLogFactory } from '../../../logging/logging-emitter';
import { AllowlistState } from '../../state-types/allowlist-state';
import { ItemSortWalletsByMemesTdhParams } from './item-sort-wallets-by-memes-tdh.types';
import {
  anAllowlistComponent,
  anAllowlistItem,
  anAllowlistPhase,
  anAllowlistState,
} from '../../state-types/allowlist-state.test.fixture';
import { anAllowlistRandomMemes100Tokens } from '../../state-types/allowlist-state.test.fixture.large';
import * as fs from 'fs';
import { Mutable } from '../../../app-types';

describe('ItemSortWalletsByMemesTdhOperation', () => {
  const op = new ItemSortWalletsByMemesTdhOperation(
    {
      getUploadsForBlock: jest
        .fn()
        .mockResolvedValue(
          JSON.parse(fs.readFileSync(`mock-data/random100Tdh.json`, 'utf8')),
        ),
    } as any,
    defaultLogFactory,
  );
  let state: AllowlistState;
  let params: Mutable<
    ItemSortWalletsByMemesTdhParams,
    'itemId' | 'tdhBlockNumber'
  >;

  beforeEach(() => {
    state = anAllowlistState({
      phases: [
        anAllowlistPhase({
          components: [
            anAllowlistComponent({
              items: [
                anAllowlistItem({
                  tokens: anAllowlistRandomMemes100Tokens(),
                }),
              ],
            }),
          ],
        }),
      ],
    });
    params = {
      itemId: 'item-1',
      tdhBlockNumber: 17676050,
    };
  });

  it('throws if missing itemId', async () => {
    delete params.itemId;
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Missing itemId',
    );
  });

  it('throws if itemId is not a string', async () => {
    params.itemId = 1 as any;
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Invalid itemId',
    );
  });

  it('thorws if itemId is empty string', async () => {
    params.itemId = '';
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Invalid itemId',
    );
  });

  it('throws if missing tdhBlockNumber', async () => {
    delete params.tdhBlockNumber;
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Missing tdhBlockNumber',
    );
  });

  it('throws if tdhBlockNumber is not a number', async () => {
    params.tdhBlockNumber = '1' as any;
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Invalid tdhBlockNumber',
    );
  });

  it('throws if tdhBlockNumber is not an integer', async () => {
    params.tdhBlockNumber = 1.1;
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Invalid tdhBlockNumber',
    );
  });

  it('throws if tdhBlockNumber is negative', async () => {
    params.tdhBlockNumber = -1;
    await expect(op.execute({ params, state })).rejects.toThrow(
      'Invalid tdhBlockNumber',
    );
  });

  it('validates params', async () => {
    expect(op.validate(params)).toEqual(true);
  });

  it('throws if item does not exist', async () => {
    params.itemId = 'item-2';
    await expect(op.execute({ params, state })).rejects.toThrow(
      "Item 'item-2' not found",
    );
  });
});
