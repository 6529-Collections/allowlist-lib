import { CommonTdhInfo, ConsolidatedTdhInfo, TdhInfo } from './tdh-info';
import { parse } from 'csv-parse';
import { Time } from '../../time';
import { Http } from '../http';

export class TdhApiService {
  constructor(private readonly http: Http, private readonly apiUri: string) {}

  async getUploadsForBlock(blockId: number): Promise<TdhInfo[]> {
    const rawData = await this.getDataForBlock({ path: '/uploads', blockId });
    return rawData.map((rawColumn) => ({
      ...this.mapCommon(rawColumn),
      ens: rawColumn.ens,
    }));
  }

  async getConsolidatedUploadsForBlock(
    blockId: number,
  ): Promise<ConsolidatedTdhInfo[]> {
    const rawData = await this.getDataForBlock({
      path: '/consolidated_uploads',
      blockId,
    });
    return rawData.map((rawColumn) => ({
      ...this.mapCommon(rawColumn),
      consolidation_display: rawColumn.consolidation_display,
      wallets: JSON.parse(rawColumn.wallets),
    }));
  }

  private mapCommon(rawColumn: any): CommonTdhInfo {
    return {
      wallet: rawColumn.wallet,
      memes: JSON.parse(rawColumn.memes),
      memes_ranks: JSON.parse(rawColumn.memes_ranks),
      gradients: JSON.parse(rawColumn.gradients_ranks),
      gradients_ranks: JSON.parse(rawColumn.gradients_ranks),
      created_at: Time.fromString(rawColumn.created_at),
      transaction_reference: Time.fromString(rawColumn.transaction_reference),
      block: +rawColumn.block,
      tdh_rank: +rawColumn.tdh_rank,
      tdh: +rawColumn.tdh,
      boost: +rawColumn.boost,
      boosted_tdh: +rawColumn.boosted_tdh,
      tdh__raw: +rawColumn.tdh__raw,
      balance: +rawColumn.balance,
      memes_cards_sets: +rawColumn.memes_cards_sets,
      genesis: +rawColumn.genesis,
      unique_memes: +rawColumn.unique_memes,
      memes_tdh: +rawColumn.memes_tdh,
      memes_tdh__raw: +rawColumn.memes_tdh__raw,
      memes_balance: +rawColumn.memes_balance,
      memes_tdh_season1: +rawColumn.memes_tdh_season1,
      memes_tdh_season1__raw: +rawColumn.memes_tdh_season1__raw,
      memes_tdh_season2: +rawColumn.memes_tdh_season2,
      memes_tdh_season2__raw: +rawColumn.memes_tdh_season2__raw,
      gradients_tdh: +rawColumn.gradients_tdh,
      gradients_tdh__raw: +rawColumn.gradients_tdh__raw,
      gradients_balance: +rawColumn.gradients_balance,
      boosted_memes_tdh_season1: +rawColumn.boosted_memes_tdh_season1,
      boosted_memes_tdh_season2: +rawColumn.boosted_memes_tdh_season2,
      boosted_gradients_tdh: +rawColumn.boosted_gradients_tdh,
      tdh_rank_memes: +rawColumn.tdh_rank_memes,
      tdh_rank_memes_szn1: +rawColumn.tdh_rank_memes_szn1,
      tdh_rank_memes_szn2: +rawColumn.tdh_rank_memes_szn2,
      tdh_rank_gradients: +rawColumn.tdh_rank_gradients,
      tdh_rank_memes_szn3: +rawColumn.tdh_rank_memes_szn3,
      unique_memes_season1: +rawColumn.unique_memes_season1,
      unique_memes_season2: +rawColumn.unique_memes_season2,
      unique_memes_season3: +rawColumn.unique_memes_season3,
      boosted_memes_tdh_season3: +rawColumn.boosted_memes_tdh_season3,
      memes_tdh_season3: +rawColumn.memes_tdh_season3,
      memes_tdh_season3__raw: +rawColumn.memes_tdh_season3__raw,
      boosted_memes_tdh: +rawColumn.boosted_memes_tdh,
      memes_balance_season1: +rawColumn.memes_balance_season1,
      memes_balance_season2: +rawColumn.memes_balance_season2,
      memes_balance_season3: +rawColumn.memes_balance_season3,
      purchases_value: +rawColumn.purchases_value,
      purchases_count: +rawColumn.purchases_count,
      purchases_value_primary: +rawColumn.purchases_value_primary,
      purchases_count_primary: +rawColumn.purchases_count_primary,
      purchases_value_secondary: +rawColumn.purchases_value_secondary,
      purchases_count_secondary: +rawColumn.purchases_count_secondary,
      sales_value: +rawColumn.sales_value,
      sales_count: +rawColumn.sales_count,
      transfers_in: +rawColumn.transfers_in,
      transfers_out: +rawColumn.transfers_out,
      purchases_value_memes: +rawColumn.purchases_value_memes,
      purchases_count_memes: +rawColumn.purchases_count_memes,
      purchases_value_memes_season1: +rawColumn.purchases_value_memes_season1,
      purchases_count_memes_season1: +rawColumn.purchases_count_memes_season1,
      purchases_value_memes_season2: +rawColumn.purchases_value_memes_season2,
      purchases_count_memes_season2: +rawColumn.purchases_count_memes_season2,
      purchases_value_memes_season3: +rawColumn.purchases_value_memes_season3,
      purchases_count_memes_season3: +rawColumn.purchases_count_memes_season3,
      purchases_value_gradients: +rawColumn.purchases_value_gradients,
      purchases_count_gradients: +rawColumn.purchases_count_gradients,
      purchases_value_primary_memes: +rawColumn.purchases_value_primary_memes,
      purchases_count_primary_memes: +rawColumn.purchases_count_primary_memes,
      purchases_value_primary_memes_season1:
        +rawColumn.purchases_value_primary_memes_season1,
      purchases_count_primary_memes_season1:
        +rawColumn.purchases_count_primary_memes_season1,
      purchases_value_primary_memes_season2:
        +rawColumn.purchases_value_primary_memes_season2,
      purchases_count_primary_memes_season2:
        +rawColumn.purchases_count_primary_memes_season2,
      purchases_value_primary_memes_season3:
        +rawColumn.purchases_value_primary_memes_season3,
      purchases_count_primary_memes_season3:
        +rawColumn.purchases_count_primary_memes_season3,
      purchases_value_primary_gradients:
        +rawColumn.purchases_value_primary_gradients,
      purchases_count_primary_gradients:
        +rawColumn.purchases_count_primary_gradients,
      purchases_value_secondary_memes:
        +rawColumn.purchases_value_secondary_memes,
      purchases_count_secondary_memes:
        +rawColumn.purchases_count_secondary_memes,
      purchases_value_secondary_memes_season1:
        +rawColumn.purchases_value_secondary_memes_season1,
      purchases_count_secondary_memes_season1:
        +rawColumn.purchases_count_secondary_memes_season1,
      purchases_value_secondary_memes_season2:
        +rawColumn.purchases_value_secondary_memes_season2,
      purchases_count_secondary_memes_season2:
        +rawColumn.purchases_count_secondary_memes_season2,
      purchases_value_secondary_memes_season3:
        +rawColumn.purchases_value_secondary_memes_season3,
      purchases_count_secondary_memes_season3:
        +rawColumn.purchases_count_secondary_memes_season3,
      purchases_value_secondary_gradients:
        +rawColumn.purchases_value_secondary_gradients,
      purchases_count_secondary_gradients:
        +rawColumn.purchases_count_secondary_gradients,
      sales_value_memes: +rawColumn.sales_value_memes,
      sales_count_memes: +rawColumn.sales_count_memes,
      sales_value_memes_season1: +rawColumn.sales_value_memes_season1,
      sales_count_memes_season1: +rawColumn.sales_count_memes_season1,
      sales_value_memes_season2: +rawColumn.sales_value_memes_season2,
      sales_count_memes_season2: +rawColumn.sales_count_memes_season2,
      sales_value_memes_season3: +rawColumn.sales_value_memes_season3,
      sales_count_memes_season3: +rawColumn.sales_count_memes_season3,
      sales_value_gradients: +rawColumn.sales_value_gradients,
      sales_count_gradients: +rawColumn.sales_count_gradients,
      transfers_in_memes: +rawColumn.transfers_in_memes,
      transfers_out_memes: +rawColumn.transfers_out_memes,
      transfers_in_memes_season1: +rawColumn.transfers_in_memes_season1,
      transfers_out_memes_season1: +rawColumn.transfers_out_memes_season1,
      transfers_in_memes_season2: +rawColumn.transfers_in_memes_season2,
      transfers_out_memes_season2: +rawColumn.transfers_out_memes_season2,
      transfers_in_memes_season3: +rawColumn.transfers_in_memes_season3,
      transfers_out_memes_season3: +rawColumn.transfers_out_memes_season3,
      transfers_in_gradients: +rawColumn.transfers_in_gradients,
      transfers_out_gradients: +rawColumn.transfers_out_gradients,
    };
  }

  private async getDataForBlock({
    path,
    blockId,
  }: {
    path: string;
    blockId: number;
  }): Promise<any[]> {
    const apiResponseData = await this.http.get<TdhInfoApiResponse>({
      endpoint: `${this.apiUri}${path}`,
    });
    const tdh = this.getClosestTdh(apiResponseData, blockId);
    if (!tdh) {
      throw new Error(`No TDH found for block ${blockId}`);
    }
    const csvContents = await this.http.get<string>({
      endpoint: tdh,
    });
    return this.parseCsv<any>(csvContents);
  }

  private getClosestTdh(apiResponseData: TdhInfoApiResponse, blockId: number) {
    return apiResponseData.data
      .sort((a, b) => a.block - b.block)
      .filter((a) => a.block <= blockId)
      .at(-1)?.tdh;
  }

  private async parseCsv<T>(csvContents: string): Promise<T[]> {
    return new Promise<T[]>((resolve) => {
      parse(csvContents, { delimiter: ',' }, function (err, records) {
        const lines: T[] = [];
        const header = records[0];
        for (let i = 1; i < records.length; i++) {
          const o = {};
          for (let j = 0; j < header.length; j++) {
            o[header[j]] = records[i][j];
          }
          lines.push(o as T);
        }
        return resolve(lines);
      });
    });
  }
}

interface TdhInfoApiResponse {
  readonly count: number;
  readonly page: number;
  readonly next: string | null;
  data: {
    readonly date: string;
    readonly block: number;
    readonly tdh: string;
  }[];
}
