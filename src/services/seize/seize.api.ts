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
      wallet: rawColumn.wallet.toLowerCase(),
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
      wallets: JSON.parse(rawColumn.wallets).map((w) => w.toLowerCase()),
    }));
  }

  private mapCommon(rawColumn: any): CommonTdhInfo {
    return {
      consolidation_key: rawColumn.consolidation_key,
      consolidation_display: rawColumn.consolidation_display,
      block: +rawColumn.block,
      date: rawColumn.date,
      total_balance: +rawColumn.total_balance,
      boosted_tdh: +rawColumn.boosted_tdh,
      tdh_rank: +rawColumn.tdh_rank,
      tdh: +rawColumn.tdh,
      tdh__raw: +rawColumn.tdh__raw,
      boost: +rawColumn.boost,
      memes_balance: +rawColumn.memes_balance,
      unique_memes: +rawColumn.unique_memes,
      memes_cards_sets: +rawColumn.memes_cards_sets,
      memes_cards_sets_minus1: +rawColumn.memes_cards_sets_minus1,
      memes_cards_sets_minus2: +rawColumn.memes_cards_sets_minus2,
      genesis: +rawColumn.genesis,
      nakamoto: +rawColumn.nakamoto,
      boosted_memes_tdh: +rawColumn.boosted_memes_tdh,
      memes_tdh: +rawColumn.memes_tdh,
      memes_tdh__raw: +rawColumn.memes_tdh__raw,
      tdh_rank_memes: +rawColumn.tdh_rank_memes,
      memes: JSON.parse(rawColumn.memes).map((m) => ({
        id: +m.id,
        tdh: +m.tdh,
        balance: +m.balance,
        tdh__raw: +m.tdh__raw,
        rank: +m.rank,
      })),
      gradients_balance: +rawColumn.gradients_balance,
      boosted_gradients_tdh: +rawColumn.boosted_gradients_tdh,
      gradients_tdh: +rawColumn.gradients_tdh,
      gradients_tdh__raw: +rawColumn.gradients_tdh__raw,
      tdh_rank_gradients: +rawColumn.tdh_rank_gradients,
      gradients: JSON.parse(rawColumn.gradients).map((g) => ({
        id: +g.id,
        tdh: +g.tdh,
        balance: +g.balance,
        tdh__raw: +g.tdh__raw,
        rank: +g.rank,
      })),
      nextgen_balance: +rawColumn.nextgen_balance,
      boosted_nextgen_tdh: +rawColumn.boosted_nextgen_tdh,
      nextgen_tdh: +rawColumn.nextgen_tdh,
      nextgen_tdh__raw: +rawColumn.nextgen_tdh__raw,
      nextgen: JSON.parse(rawColumn.nextgen).map((n) => ({
        id: +n.id,
        tdh: +n.tdh,
        balance: +n.balance,
        tdh__raw: +n.tdh__raw,
        rank: +n.rank,
      })),
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
    return [...apiResponseData.data]
      .sort((a, b) => a.block - b.block)
      .filter((a) => a.block <= blockId)
      .at(-1)?.url;
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
  readonly url: string;
}>;


// const x =    {
//       wallet: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd',
//       ens: '6529Museum',
//       block: '19557270',
//       date: '20240401',
//       total_balance: '12192',
//       boosted_tdh: '36685121',
//       tdh_rank: '1',
//       tdh: '26203658',
//       tdh__raw: '4536913',
//       boost: '1.4',
//       memes_balance: '12130',
//       unique_memes: '212',
//       memes_cards_sets: '31',
//       memes_cards_sets_minus1: '0',
//       memes_cards_sets_minus2: '32',
//       genesis: '111',
//       nakamoto: '32',
//       boosted_memes_tdh: '36233014',
//       memes_tdh: '25880724',
//       memes_tdh__raw: '4526615',
//       tdh_rank_memes: '1',
//       memes: '[{"id":1,"tdh":289155.111,"balance":111,"tdh__raw":73371,"rank":1},{"id":2,"tdh":333782.995,"balance":133,"tdh__raw":84695,"rank":1},{"id":3,"tdh":289155.111,"balance":111,"tdh__raw":73371,"rank":1},{"id":4,"tdh":269446.17,"balance":32,"tdh__raw":20511,"rank":1},{"id":5,"tdh":258263.6344463972,"balance":59,"tdh__raw":37288,"rank":1},{"id":6,"tdh":187966.93333333332,"balance":32,"tdh__raw":20032,"rank":1},{"id":7,"tdh":241952.34718826407,"balance":81,"tdh__raw":50220,"rank":1},{"id":8,"tdh":402284,"balance":652,"tdh__raw":402284,"rank":1},{"id":9,"tdh":238824.6,"balance":51,"tdh__raw":30906,"rank":1},{"id":10,"tdh":258677.49253731343,"balance":52,"tdh__raw":30784,"rank":1},{"id":11,"tdh":237741.9076923077,"balance":47,"tdh__raw":27448,"rank":1},{"id":12,"tdh":248036.0701754386,"balance":43,"tdh__raw":25112,"rank":1},{"id":13,"tdh":229150.87719298244,"balance":40,"tdh__raw":23200,"rank":1},{"id":14,"tdh":228190.1335676626,"balance":57,"tdh__raw":32946,"rank":1},{"id":15,"tdh":228250.01040312092,"balance":78,"tdh__raw":44538,"rank":1},{"id":16,"tdh":224159.09314586996,"balance":58,"tdh__raw":32364,"rank":1},{"id":17,"tdh":223965.4394618834,"balance":69,"tdh__raw":38019,"rank":1},{"id":18,"tdh":216978.68937048505,"balance":97,"tdh__raw":53350,"rank":1},{"id":19,"tdh":218817.0092879257,"balance":98,"tdh__raw":53802,"rank":1},{"id":20,"tdh":215105.553064275,"balance":67,"tdh__raw":36515,"rank":1},{"id":21,"tdh":224047.62522522523,"balance":58,"tdh__raw":31552,"rank":1},{"id":22,"tdh":215226.16379310345,"balance":70,"tdh__raw":38010,"rank":1},{"id":23,"tdh":213977.59929701232,"balance":57,"tdh__raw":30894,"rank":1},{"id":24,"tdh":218284.4833333333,"balance":43,"tdh__raw":23263,"rank":1},{"id":25,"tdh":213236.9762641899,"balance":98,"tdh__raw":52430,"rank":1},{"id":26,"tdh":213669.84785435628,"balance":79,"tdh__raw":41693,"rank":1},{"id":27,"tdh":208158.47184684683,"balance":89,"tdh__raw":46903,"rank":2},{"id":28,"tdh":206508.4,"balance":42,"tdh__raw":22008,"rank":1},{"id":29,"tdh":206158.83582089553,"balance":47,"tdh__raw":24534,"rank":1},{"id":30,"tdh":208893.77855887523,"balance":58,"tdh__raw":30160,"rank":1},{"id":31,"tdh":204184.13432835825,"balance":47,"tdh__raw":24299,"rank":1},{"id":32,"tdh":203470.1754385965,"balance":40,"tdh__raw":20600,"rank":1},{"id":33,"tdh":200991,"balance":42,"tdh__raw":21420,"rank":1},{"id":34,"tdh":200745.35501355017,"balance":37,"tdh__raw":18796,"rank":1},{"id":35,"tdh":202952.11666666667,"balance":43,"tdh__raw":21629,"rank":1},{"id":36,"tdh":197865.0895522388,"balance":47,"tdh__raw":23547,"rank":1},{"id":37,"tdh":196655.9,"balance":42,"tdh__raw":20958,"rank":1},{"id":38,"tdh":195027.55360281197,"balance":57,"tdh__raw":28158,"rank":1},{"id":39,"tdh":192913.78018575851,"balance":97,"tdh__raw":47433,"rank":1},{"id":40,"tdh":192213.58594917785,"balance":67,"tdh__raw":32629,"rank":1},{"id":41,"tdh":191605.83129584353,"balance":82,"tdh__raw":39770,"rank":1},{"id":42,"tdh":192617.3609072715,"balance":152,"tdh__raw":73264,"rank":1},{"id":43,"tdh":189357.35735735737,"balance":100,"tdh__raw":48000,"rank":1},{"id":44,"tdh":188624.76723016903,"balance":77,"tdh__raw":36806,"rank":1},{"id":45,"tdh":187655.195599022,"balance":82,"tdh__raw":38950,"rank":1},{"id":46,"tdh":186104.21112929625,"balance":61,"tdh__raw":28853,"rank":1},{"id":47,"tdh":185621.1,"balance":42,"tdh__raw":19782,"rank":1},{"id":48,"tdh":179852.37275449102,"balance":134,"tdh__raw":60970,"rank":1},{"id":49,"tdh":178317.03199174406,"balance":97,"tdh__raw":43844,"rank":1},{"id":50,"tdh":178364.22413793104,"balance":70,"tdh__raw":31500,"rank":1},{"id":51,"tdh":176339.03903903905,"balance":100,"tdh__raw":44700,"rank":1},{"id":52,"tdh":175374.5,"balance":142,"tdh__raw":63190,"rank":1},{"id":53,"tdh":174429.15661566154,"balance":111,"tdh__raw":49173,"rank":1},{"id":54,"tdh":173577.57757757758,"balance":100,"tdh__raw":44000,"rank":1},{"id":55,"tdh":172330.95544554453,"balance":121,"tdh__raw":52998,"rank":1},{"id":56,"tdh":173037.65352112675,"balance":143,"tdh__raw":62348,"rank":1},{"id":57,"tdh":170420.77290836652,"balance":201,"tdh__raw":86832,"rank":1},{"id":58,"tdh":170027.12712712714,"balance":100,"tdh__raw":43100,"rank":1},{"id":59,"tdh":169068.9,"balance":142,"tdh__raw":60918,"rank":1},{"id":60,"tdh":167735.48694869486,"balance":111,"tdh__raw":47286,"rank":1},{"id":61,"tdh":167869.73536036036,"balance":89,"tdh__raw":37825,"rank":1},{"id":62,"tdh":166476.67667667667,"balance":100,"tdh__raw":42200,"rank":1},{"id":63,"tdh":167361.13333333333,"balance":91,"tdh__raw":38220,"rank":1},{"id":64,"tdh":164923.3670886076,"balance":87,"tdh__raw":36366,"rank":1},{"id":65,"tdh":170767.00735294115,"balance":142,"tdh__raw":58930,"rank":1},{"id":66,"tdh":162536.7636738906,"balance":97,"tdh__raw":39964,"rank":1},{"id":67,"tdh":161581,"balance":142,"tdh__raw":58220,"rank":1},{"id":68,"tdh":160958.73684210528,"balance":97,"tdh__raw":39576,"rank":1},{"id":69,"tdh":160398.7,"balance":69,"tdh__raw":28083,"rank":1},{"id":70,"tdh":159435.51351351352,"balance":78,"tdh__raw":31434,"rank":1},{"id":71,"tdh":174835.8743633277,"balance":65,"tdh__raw":26130,"rank":1},{"id":72,"tdh":157600.05743243243,"balance":89,"tdh__raw":35511,"rank":1},{"id":73,"tdh":157782.01801801802,"balance":101,"tdh__raw":39996,"rank":1},{"id":74,"tdh":155275.40000000002,"balance":69,"tdh__raw":27186,"rank":1},{"id":75,"tdh":154350.3505843072,"balance":60,"tdh__raw":23460,"rank":1},{"id":76,"tdh":153574.32864674868,"balance":57,"tdh__raw":22173,"rank":1},{"id":77,"tdh":152516.69999999998,"balance":50,"tdh__raw":19350,"rank":1},{"id":78,"tdh":151600.3655536028,"balance":57,"tdh__raw":21888,"rank":1},{"id":79,"tdh":150761.57367668097,"balance":70,"tdh__raw":26740,"rank":1},{"id":80,"tdh":150058.11623246493,"balance":50,"tdh__raw":19000,"rank":1},{"id":81,"tdh":148892.49253731343,"balance":47,"tdh__raw":17719,"rank":1},{"id":82,"tdh":148102.61194029852,"balance":47,"tdh__raw":17625,"rank":1},{"id":83,"tdh":146548.3819018405,"balance":65,"tdh__raw":24245,"rank":1},{"id":84,"tdh":147130.66666666666,"balance":56,"tdh__raw":20720,"rank":1},{"id":85,"tdh":146479.088,"balance":101,"tdh__raw":37168,"rank":1},{"id":86,"tdh":144240.6,"balance":42,"tdh__raw":15372,"rank":1},{"id":87,"tdh":138467.56756756757,"balance":78,"tdh__raw":27300,"rank":1},{"id":88,"tdh":136752.7,"balance":69,"tdh__raw":23943,"rank":1},{"id":89,"tdh":136167.73542600896,"balance":67,"tdh__raw":23115,"rank":1},{"id":90,"tdh":135019.0755711775,"balance":57,"tdh__raw":19494,"rank":1},{"id":91,"tdh":134194.2899850523,"balance":67,"tdh__raw":22780,"rank":1},{"id":92,"tdh":133472.74549098196,"balance":50,"tdh__raw":16900,"rank":1},{"id":93,"tdh":132195.18205461637,"balance":77,"tdh__raw":25795,"rank":1},{"id":94,"tdh":131590.9512195122,"balance":37,"tdh__raw":12321,"rank":1},{"id":95,"tdh":130960.67125984252,"balance":51,"tdh__raw":16881,"rank":1},{"id":96,"tdh":128476.6,"balance":42,"tdh__raw":13692,"rank":1},{"id":97,"tdh":128008.42105263156,"balance":40,"tdh__raw":12960,"rank":1},{"id":98,"tdh":126506.1,"balance":42,"tdh__raw":13482,"rank":1},{"id":99,"tdh":125969.83967935872,"balance":50,"tdh__raw":15950,"rank":1},{"id":100,"tdh":125196.07462686568,"balance":47,"tdh__raw":14899,"rank":1},{"id":101,"tdh":123505.23287671233,"balance":51,"tdh__raw":16014,"rank":1},{"id":102,"tdh":123221.37313432836,"balance":47,"tdh__raw":14664,"rank":1},{"id":103,"tdh":122171,"balance":36,"tdh__raw":11160,"rank":1},{"id":104,"tdh":120988.7,"balance":50,"tdh__raw":15350,"rank":1},{"id":105,"tdh":120441.38276553106,"balance":50,"tdh__raw":15250,"rank":1},{"id":106,"tdh":119412.3,"balance":50,"tdh__raw":15150,"rank":1},{"id":107,"tdh":118230,"balance":42,"tdh__raw":12600,"rank":1},{"id":108,"tdh":118388.91129032258,"balance":50,"tdh__raw":14900,"rank":1},{"id":109,"tdh":118251.59452054794,"balance":37,"tdh__raw":10952,"rank":1},{"id":110,"tdh":115717.50746268655,"balance":47,"tdh__raw":13771,"rank":1},{"id":111,"tdh":114683.1,"balance":42,"tdh__raw":12222,"rank":1},{"id":112,"tdh":112868.8198198198,"balance":44,"tdh__raw":12716,"rank":1},{"id":113,"tdh":111924.4,"balance":35,"tdh__raw":9940,"rank":1},{"id":114,"tdh":111136.2,"balance":45,"tdh__raw":12690,"rank":1},{"id":115,"tdh":109953.9,"balance":35,"tdh__raw":9765,"rank":1},{"id":116,"tdh":109165.7,"balance":40,"tdh__raw":11080,"rank":1},{"id":117,"tdh":108771.6,"balance":35,"tdh__raw":9660,"rank":1},{"id":118,"tdh":109862.12328767125,"balance":37,"tdh__raw":10175,"rank":1},{"id":119,"tdh":102593.81621621622,"balance":56,"tdh__raw":14448,"rank":1},{"id":120,"tdh":102271.64931506848,"balance":37,"tdh__raw":9472,"rank":1},{"id":121,"tdh":100352.28070175438,"balance":40,"tdh__raw":10160,"rank":1},{"id":122,"tdh":98027.93693693694,"balance":44,"tdh__raw":11044,"rank":1},{"id":123,"tdh":98396.837398374,"balance":37,"tdh__raw":9213,"rank":1},{"id":124,"tdh":97606.50135501356,"balance":37,"tdh__raw":9139,"rank":1},{"id":125,"tdh":96160.4,"balance":35,"tdh__raw":8540,"rank":1},{"id":126,"tdh":95372.2,"balance":40,"tdh__raw":9680,"rank":1},{"id":127,"tdh":94584,"balance":36,"tdh__raw":8640,"rank":1},{"id":128,"tdh":93654.8211382114,"balance":37,"tdh__raw":8769,"rank":1},{"id":129,"tdh":92864.48509485096,"balance":37,"tdh__raw":8695,"rank":1},{"id":130,"tdh":92074.14905149052,"balance":37,"tdh__raw":8621,"rank":1},{"id":131,"tdh":90888.64498644989,"balance":37,"tdh__raw":8510,"rank":1},{"id":132,"tdh":90080,"balance":40,"tdh__raw":9120,"rank":1},{"id":133,"tdh":89307.97289972901,"balance":37,"tdh__raw":8362,"rank":1},{"id":134,"tdh":88122.46883468835,"balance":37,"tdh__raw":8251,"rank":1},{"id":135,"tdh":87332.13279132792,"balance":37,"tdh__raw":8177,"rank":1},{"id":136,"tdh":85530.35135135135,"balance":44,"tdh__raw":9636,"rank":2},{"id":137,"tdh":85125.6,"balance":36,"tdh__raw":7776,"rank":1},{"id":138,"tdh":84565.9566395664,"balance":37,"tdh__raw":7918,"rank":1},{"id":139,"tdh":83758.59649122808,"balance":40,"tdh__raw":8480,"rank":2},{"id":140,"tdh":82573.33333333333,"balance":40,"tdh__raw":8360,"rank":2}'... 5189 more characters,
//       gradients_balance: '11',
//       boosted_gradients_tdh: '439698.5405940593',
//       gradients_tdh: '314070',
//       gradients_tdh__raw: '8049',
//       tdh_rank_gradients: '1',
//       gradients: '[{"id":0,"tdh":34454.48514851485,"rank":7,"balance":1,"tdh__raw":883},{"id":10,"tdh":26338.366336633662,"rank":29,"balance":1,"tdh__raw":675},{"id":20,"tdh":26338.366336633662,"rank":31,"balance":1,"tdh__raw":675},{"id":30,"tdh":26338.366336633662,"rank":32,"balance":1,"tdh__raw":675},{"id":40,"tdh":26338.366336633662,"rank":33,"balance":1,"tdh__raw":675},{"id":50,"tdh":34454.48514851485,"rank":8,"balance":1,"tdh__raw":883},{"id":60,"tdh":26338.366336633662,"rank":34,"balance":1,"tdh__raw":675},{"id":70,"tdh":26338.366336633662,"rank":35,"balance":1,"tdh__raw":675},{"id":80,"tdh":26338.366336633662,"rank":38,"balance":1,"tdh__raw":675},{"id":90,"tdh":26338.366336633662,"rank":41,"balance":1,"tdh__raw":675},{"id":100,"tdh":34454.48514851485,"rank":9,"balance":1,"tdh__raw":883}]',
//       nextgen_balance: '51',
//       boosted_nextgen_tdh: '12408.632600000015',
//       nextgen_tdh: '8863',
//       nextgen_tdh__raw: '2249',
//       nextgen: '[{"id":"10000000013","tdh":173.404,"rank":808,"balance":1,"tdh__raw":44},{"id":"10000000085","tdh":173.404,"rank":810,"balance":1,"tdh__raw":44},{"id":"10000000331","tdh":173.404,"rank":817,"balance":1,"tdh__raw":44},{"id":"10000000437","tdh":173.404,"rank":818,"balance":1,"tdh__raw":44},{"id":"10000000438","tdh":173.404,"rank":819,"balance":1,"tdh__raw":44},{"id":"10000000454","tdh":173.404,"rank":820,"balance":1,"tdh__raw":44},{"id":"10000000455","tdh":173.404,"rank":821,"balance":1,"tdh__raw":44},{"id":"10000000464","tdh":173.404,"rank":822,"balance":1,"tdh__raw":44},{"id":"10000000465","tdh":173.404,"rank":823,"balance":1,"tdh__raw":44},{"id":"10000000466","tdh":173.404,"rank":824,"balance":1,"tdh__raw":44},{"id":"10000000467","tdh":204.932,"rank":343,"balance":1,"tdh__raw":52},{"id":"10000000531","tdh":173.404,"rank":827,"balance":1,"tdh__raw":44},{"id":"10000000532","tdh":173.404,"rank":828,"balance":1,"tdh__raw":44},{"id":"10000000533","tdh":173.404,"rank":829,"balance":1,"tdh__raw":44},{"id":"10000000534","tdh":173.404,"rank":830,"balance":1,"tdh__raw":44},{"id":"10000000538","tdh":173.404,"rank":831,"balance":1,"tdh__raw":44},{"id":"10000000539","tdh":173.404,"rank":832,"balance":1,"tdh__raw":44},{"id":"10000000616","tdh":173.404,"rank":834,"balance":1,"tdh__raw":44},{"id":"10000000688","tdh":161.581,"rank":901,"balance":1,"tdh__raw":41},{"id":"10000000727","tdh":173.404,"rank":836,"balance":1,"tdh__raw":44},{"id":"10000000728","tdh":173.404,"rank":837,"balance":1,"tdh__raw":44},{"id":"10000000729","tdh":173.404,"rank":838,"balance":1,"tdh__raw":44},{"id":"10000000730","tdh":173.404,"rank":839,"balance":1,"tdh__raw":44},{"id":"10000000731","tdh":173.404,"rank":840,"balance":1,"tdh__raw":44},{"id":"10000000732","tdh":173.404,"rank":841,"balance":1,"tdh__raw":44},{"id":"10000000737","tdh":173.404,"rank":842,"balance":1,"tdh__raw":44},{"id":"10000000738","tdh":173.404,"rank":843,"balance":1,"tdh__raw":44},{"id":"10000000739","tdh":173.404,"rank":844,"balance":1,"tdh__raw":44},{"id":"10000000740","tdh":173.404,"rank":845,"balance":1,"tdh__raw":44},{"id":"10000000741","tdh":173.404,"rank":846,"balance":1,"tdh__raw":44},{"id":"10000000742","tdh":173.404,"rank":847,"balance":1,"tdh__raw":44},{"id":"10000000743","tdh":173.404,"rank":848,"balance":1,"tdh__raw":44},{"id":"10000000776","tdh":173.404,"rank":849,"balance":1,"tdh__raw":44},{"id":"10000000777","tdh":173.404,"rank":850,"balance":1,"tdh__raw":44},{"id":"10000000778","tdh":173.404,"rank":851,"balance":1,"tdh__raw":44},{"id":"10000000779","tdh":173.404,"rank":852,"balance":1,"tdh__raw":44},{"id":"10000000783","tdh":173.404,"rank":853,"balance":1,"tdh__raw":44},{"id":"10000000784","tdh":173.404,"rank":854,"balance":1,"tdh__raw":44},{"id":"10000000785","tdh":173.404,"rank":855,"balance":1,"tdh__raw":44},{"id":"10000000786","tdh":173.404,"rank":856,"balance":1,"tdh__raw":44},{"id":"10000000787","tdh":173.404,"rank":857,"balance":1,"tdh__raw":44},{"id":"10000000788","tdh":173.404,"rank":858,"balance":1,"tdh__raw":44},{"id":"10000000789","tdh":173.404,"rank":859,"balance":1,"tdh__raw":44},{"id":"10000000790","tdh":173.404,"rank":860,"balance":1,"tdh__raw":44},{"id":"10000000791","tdh":173.404,"rank":861,"balance":1,"tdh__raw":44},{"id":"10000000792","tdh":173.404,"rank":862,"balance":1,"tdh__raw":44},{"id":"10000000793","tdh":173.404,"rank":863,"balance":1,"tdh__raw":44},{"id":"10000000794","tdh":173.404,"rank":864,"balance":1,"tdh__raw":44},{"id":"10000000795","tdh":173.404,"rank":865,"balance":1,"tdh__raw":44},{"id":"10000000796","tdh":173.404,"rank":866,"balance":1,"tdh__raw":44},{"id":"10000000797","tdh":173.404,"rank":867,"balance":1,"tdh__raw":44}]',
//       boost_breakdown: '{"gradients":{"acquired":0.06,"available":0.06,"acquired_info":["0.06 for holding 11 Gradients"],"available_info":["0.02 for each Gradient up to 3"]},"memes_szn1":{"acquired":0,"available":0.05,"acquired_info":[],"available_info":["0.05 for Season 1 Set"]},"memes_szn2":{"acquired":0,"available":0.05,"acquired_info":[],"available_info":["0.05 for Season 2 Set"]},"memes_szn3":{"acquired":0,"available":0.05,"acquired_info":[],"available_info":["0.05 for Season 3 Set"]},"memes_szn4":{"acquired":0,"available":0.05,"acquired_info":[],"available_info":["0.05 for Season 4 Set"]},"memes_szn5":{"acquired":0,"available":0.05,"acquired_info":[],"available_info":["0.05 for Season 5 Set"]},"memes_szn6":{"acquired":0,"available":0.05,"acquired_info":[],"available_info":["0.05 for Season 6 Set"]},"memes_genesis":{"acquired":0,"available":0.01,"acquired_info":[],"available_info":["0.01 for Meme Cards #1, #2, #3 (Genesis Set)"]},"memes_nakamoto":{"acquired":0,"available":0.01,"acquired_info":[],"available_info":["0.01 for Meme Card #4 (NakamotoFreedom)"]},"memes_card_sets":{"acquired":0.33999999999999997,"available":0.34,"acquired_info":["0.3 for Full Collection Set","0.04 for 30 additional sets"],"available_info":["0.3 for Full Collection Set","0.02 for each additional set up to 2"]}}'
//     }