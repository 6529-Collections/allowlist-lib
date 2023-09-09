import { CommonTdhInfo, ConsolidatedTdhInfo, TdhInfo } from './tdh-info';
import { Time } from '../../time';
import { Http } from '../http';
import { SeizeApiPage } from './seize-api-page';
import {
  ConsolidationMapping,
  ConsolidationMappingPage,
} from './consolidation-mapping';
import { DelegateMapping, DelegateMappingPage } from './delegation-mapping';
import { TokenOwnership } from '../../allowlist/state-types/token-ownership';
import { parseCsv } from '../../utils/csv';

export class SeizeApi {
  constructor(
    private readonly http: Http,
    private readonly apiUri: string,
    private readonly apiToken?: string,
  ) {}

  async getAllConsolidations({
    block,
  }: {
    block: number;
  }): Promise<ConsolidationMapping[]> {
    const result: ConsolidationMapping[] = [];
    for (let page = 1; ; ) {
      const resultPage = await this.getConsolidations({ block, page });
      if (resultPage.next) {
        page++;
      } else {
        break;
      }
    }
    return result;
  }

  async getConsolidations({
    block,
    limit,
    page,
  }: {
    block: number;
    limit?: number;
    page: number;
  }): Promise<ConsolidationMappingPage> {
    let headers = undefined;
    if (this.apiToken) {
      headers = { 'x-6529-auth': this.apiToken };
    }
    let endpoint = `${this.apiUri}/consolidations?block=${block}&page=${page}`;
    if (limit) {
      endpoint += `&page_size=${limit}`;
    }
    const result = await this.http.get<ConsolidationMappingPage>({
      endpoint,
      headers,
    });

    return {
      ...result,
      data: result.data.map((item) => ({
        ...item,
        wallets: item.wallets.map((wallet) => wallet.toLowerCase()),
        primary: item.primary.toLowerCase(),
      })),
    };
  }

  async getAllDelegations({
    block,
    collections,
    useCases,
  }: {
    block: number | null;
    collections: string[];
    useCases: string[];
  }): Promise<DelegateMapping[]> {
    const result: DelegateMapping[] = [];
    for (let page = 1; ; ) {
      const resultPage = await this.getDelegations({
        block,
        page,
        collections,
        useCases,
      });

      result.push(
        ...resultPage.data.map((item) => ({
          ...item,
          from_address: item.from_address.toLowerCase(),
          to_address: item.to_address.toLowerCase(),
          collection: item.collection.toLowerCase(),
        })),
      );
      if (resultPage.next) {
        page++;
      } else {
        break;
      }
    }
    return result;
  }

  async getDelegations({
    block,
    limit,
    page,
    collections,
    useCases,
  }: {
    block: number | null;
    collections: string[];
    useCases: string[];
    limit?: number;
    page: number;
  }): Promise<DelegateMappingPage> {
    let headers = undefined;
    if (this.apiToken) {
      headers = { 'x-6529-auth': this.apiToken };
    }
    let endpoint = `${
      this.apiUri
    }/delegations?page=${page}&collection=${collections.join(
      ',',
    )}&use_case=${useCases.join(',')}`;

    if (block) {
      endpoint += `&block=${block}`;
    }
    if (limit) {
      endpoint += `&page_size=${limit}`;
    }
    return this.http.get<DelegateMappingPage>({
      endpoint,
      headers,
    });
  }

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
      wallet: rawColumn.wallet.toLowerCase(),
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
    let headers = undefined;
    if (this.apiToken) {
      headers = { 'x-6529-auth': this.apiToken };
    }
    const apiResponseData = await this.http.get<TdhInfoApiResponse>({
      endpoint: `${this.apiUri}${path}?block=${blockId}&page_size=1`,
      headers,
    });
    const tdh = this.getClosestTdh(apiResponseData, blockId);
    if (!tdh) {
      throw new Error(`No TDH found for block ${blockId}`);
    }
    const csvContents = await this.http.get<string>({
      endpoint: tdh,
    });
    return parseCsv<any>(
      csvContents,
      { delimiter: ',' },
      (records: string[][]) => {
        const lines: any[] = [];
        const header = records[0];
        for (let i = 1; i < records.length; i++) {
          const o = {};
          for (let j = 0; j < header.length; j++) {
            o[header[j]] = records[i][j];
          }
          lines.push(o);
        }
        return lines;
      },
    );
  }

  private getClosestTdh(apiResponseData: TdhInfoApiResponse, blockId: number) {
    return apiResponseData.data
      .sort((a, b) => a.block - b.block)
      .filter((a) => a.block <= blockId)
      .at(-1)?.tdh;
  }

  async consolidate(params: {
    blockNo: number;
    tokens: TokenOwnership[];
  }): Promise<TokenOwnership[]> {
    const { blockNo, tokens } = params;

    const [consolidatedSnapshot, singleSnapshot] = await Promise.all([
      this.getConsolidatedUploadsForBlock(blockNo),
      this.getUploadsForBlock(blockNo),
    ]);

    const walletTdhs = singleSnapshot.reduce<Record<string, number>>(
      (acc, curr) => {
        acc[curr.wallet.toLowerCase()] = curr.boosted_memes_tdh;
        return acc;
      },
      {},
    );

    const mainWallets = consolidatedSnapshot.reduce<Record<string, string>>(
      (acc, curr) => {
        let maxTdhWallet = curr.wallets.at(0).toLowerCase();
        for (const wallet of curr.wallets) {
          if (
            (walletTdhs[wallet.toLowerCase()] ?? 0) >
            (walletTdhs[maxTdhWallet.toLowerCase()] ?? 0)
          ) {
            maxTdhWallet = wallet.toLowerCase();
          }
        }
        for (const wallet of curr.wallets) {
          acc[wallet.toLowerCase()] = maxTdhWallet;
        }
        return acc;
      },
      {},
    );

    return tokens.map((token) => ({
      ...token,
      owner: mainWallets[token.owner] ?? token.owner,
    }));
  }
}

type TdhInfoApiResponse = SeizeApiPage<{
  readonly date: string;
  readonly block: number;
  readonly tdh: string;
}>;
