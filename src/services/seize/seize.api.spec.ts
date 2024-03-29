import { SeizeApi } from './seize.api';
import { Http } from '../http';
import { defaultLogFactory } from '../../logging/logging-emitter';
import * as fs from 'fs';

class MockHttp extends Http {
  constructor(private readonly mockReqResponses: Record<string, any>) {
    super(defaultLogFactory);
  }

  override async get<T>({ endpoint }: { endpoint: string }): Promise<T> {
    const resp = this.mockReqResponses[endpoint];
    if (!resp) {
      throw new Error(`No response mocked for ${endpoint}`);
    }
    return resp;
  }
}

describe('Seize API Uploads', () => {
  let seizeApi: SeizeApi;

  beforeAll(() => {
    const tdhUploadContents = fs.readFileSync(
      `mock-data/tdh_upload.csv`,
      'utf8',
    );
    const consolidatedTdhUploadContents = fs.readFileSync(
      `mock-data/tdh_consolidated_upload.csv`,
      'utf8',
    );
    const mockHttp = new MockHttp({
      'https://www.example.com/api/uploads?block=17531453&page_size=1': {
        data: [
          {
            date: '20230622',
            block: 17531462,
            url: 'https://www.example.com/upload-future.csv',
          },
          {
            date: '20230622',
            block: 17531451,
            url: 'https://www.example.com/upload-expired.csv',
          },
          {
            date: '20230622',
            block: 17531452,
            url: 'https://www.example.com/upload.csv',
          },
        ],
      },
      'https://www.example.com/api/consolidated_uploads?block=17531453&page_size=1':
        {
          data: [
            {
              date: '20230622',
              block: 17531451,
              url: 'https://www.example.com/consolidated_upload.csv',
            },
          ],
        },
      'https://www.example.com/api/uploads?block=1&page_size=1': {
        data: [],
      },
      'https://www.example.com/upload.csv': tdhUploadContents,
      'https://www.example.com/consolidated_upload.csv':
        consolidatedTdhUploadContents,
      // 'https://www.example.com/api/delegations?page=1&collection=c1,c2&use_case=1,2&block=17531453&page_size=5':
      //   {
      //     data: [
      //       {
      //         consolidation_display: 'cd1',
      //         wallets: ['0x1', '0x2', '0x3'],
      //         primary: '0x1',
      //       },
      //       {
      //         consolidation_display: 'cd2',
      //         wallets: ['0x4', '0x5', '0x6'],
      //         primary: '0x4',
      //       },
      //     ],
      //   },
    });
    seizeApi = new SeizeApi(mockHttp, 'https://www.example.com/api');
  });

  it('should fetch and normalise uploads for a block', async () => {
    const tdhInfos = await seizeApi.getUploadsForBlock(17531453);
    expect(tdhInfos.length).toBe(2);
    const tdhInfo = tdhInfos[0];
    expect(JSON.stringify(tdhInfo)).toBe(
      `{"wallet":"0xc6400a5584db71e41b0e5dfbdc769b54b91256cd","memes":[{"id":1,"tdh":164919.027,"balance":111,"tdh__raw":41847},{"id":2,"tdh":184923.543,"balance":133,"tdh__raw":46923},{"id":3,"tdh":164919.027,"balance":111,"tdh__raw":41847},{"id":4,"tdh":150060.14333333334,"balance":32,"tdh__raw":11423},{"id":5,"tdh":142208.4569420035,"balance":59,"tdh__raw":20532},{"id":6,"tdh":102691.2,"balance":32,"tdh__raw":10944},{"id":7,"tdh":131122.56234718827,"balance":81,"tdh__raw":27216},{"id":8,"tdh":217116,"balance":652,"tdh__raw":217116},{"id":9,"tdh":126900.2,"balance":51,"tdh__raw":16422},{"id":10,"tdh":134582.20895522388,"balance":52,"tdh__raw":16016},{"id":11,"tdh":122127.6923076923,"balance":47,"tdh__raw":14100},{"id":12,"tdh":127415.7894736842,"balance":43,"tdh__raw":12900},{"id":13,"tdh":116945.9649122807,"balance":40,"tdh__raw":11840},{"id":14,"tdh":116069.02987697716,"balance":57,"tdh__raw":16758},{"id":15,"tdh":114724.611183355,"balance":78,"tdh__raw":22386},{"id":16,"tdh":110070.9525483304,"balance":58,"tdh__raw":15892},{"id":17,"tdh":108527.71748878925,"balance":69,"tdh__raw":18423},{"id":18,"tdh":104938.7843137255,"balance":97,"tdh__raw":25802},{"id":19,"tdh":105622.0536635707,"balance":98,"tdh__raw":25970},{"id":20,"tdh":103013.8520179372,"balance":67,"tdh__raw":17487},{"id":21,"tdh":107081.58558558558,"balance":58,"tdh__raw":15080},{"id":22,"tdh":102658.52011494253,"balance":70,"tdh__raw":18130},{"id":23,"tdh":101856.49560632688,"balance":57,"tdh__raw":14706},{"id":24,"tdh":103695.21666666666,"balance":43,"tdh__raw":11051},{"id":25,"tdh":100042.02063983488,"balance":98,"tdh__raw":24598},{"id":26,"tdh":98688.99479843953,"balance":79,"tdh__raw":19257},{"id":27,"tdh":95981.98986486488,"balance":89,"tdh__raw":21627},{"id":28,"tdh":94584,"balance":42,"tdh__raw":10080},{"id":29,"tdh":93995.79104477612,"balance":47,"tdh__raw":11186},{"id":30,"tdh":94805.63796133568,"balance":58,"tdh__raw":13688},{"id":31,"tdh":92021.0895522388,"balance":47,"tdh__raw":10951},{"id":32,"tdh":91265.26315789472,"balance":40,"tdh__raw":9240},{"id":33,"tdh":89066.59999999999,"balance":42,"tdh__raw":9492},{"id":34,"tdh":88517.63685636857,"balance":37,"tdh__raw":8288},{"id":35,"tdh":88362.84999999999,"balance":43,"tdh__raw":9417},{"id":36,"tdh":85702.04477611941,"balance":47,"tdh__raw":10199},{"id":37,"tdh":84731.5,"balance":42,"tdh__raw":9030},{"id":38,"tdh":82906.44991212654,"balance":57,"tdh__raw":11970},{"id":39,"tdh":80873.87512899897,"balance":97,"tdh__raw":19885},{"id":40,"tdh":80121.88490284006,"balance":67,"tdh__raw":13601},{"id":41,"tdh":79407.77750611247,"balance":82,"tdh__raw":16482},{"id":42,"tdh":79124.9739826551,"balance":152,"tdh__raw":30096},{"id":43,"tdh":77320.92092092092,"balance":100,"tdh__raw":19600},{"id":44,"tdh":76554.82184655395,"balance":77,"tdh__raw":14938},{"id":45,"tdh":75457.14180929096,"balance":82,"tdh__raw":15662},{"id":46,"tdh":74362.99345335516,"balance":61,"tdh__raw":11529},{"id":47,"tdh":73696.7,"balance":42,"tdh__raw":7854},{"id":48,"tdh":67542.31413612566,"balance":134,"tdh__raw":22914},{"id":49,"tdh":66277.12693498452,"balance":97,"tdh__raw":16296},{"id":50,"tdh":65796.58045977012,"balance":70,"tdh__raw":11620},{"id":51,"tdh":64302.6026026026,"balance":100,"tdh__raw":16300},{"id":52,"tdh":63450.1,"balance":142,"tdh__raw":22862},{"id":53,"tdh":62605.49864986498,"balance":111,"tdh__raw":17649},{"id":54,"tdh":61541.14114114114,"balance":100,"tdh__raw":15600},{"id":55,"tdh":60591.24917491749,"balance":121,"tdh__raw":18634},{"id":56,"tdh":60325.05352112676,"balance":143,"tdh__raw":21736},{"id":57,"tdh":58384.894422310754,"balance":201,"tdh__raw":29748},{"id":58,"tdh":57990.69069069069,"balance":100,"tdh__raw":14700},{"id":59,"tdh":57144.5,"balance":142,"tdh__raw":20590},{"id":60,"tdh":55911.82898289829,"balance":111,"tdh__raw":15762},{"id":61,"tdh":55693.25337837837,"balance":89,"tdh__raw":12549},{"id":62,"tdh":54440.24024024024,"balance":100,"tdh__raw":13800},{"id":63,"tdh":54193.12888888889,"balance":91,"tdh__raw":12376},{"id":64,"tdh":52870.17031070196,"balance":87,"tdh__raw":11658},{"id":65,"tdh":51627.1,"balance":142,"tdh__raw":18602},{"id":66,"tdh":50496.85861713107,"balance":97,"tdh__raw":12416},{"id":67,"tdh":49656.6,"balance":142,"tdh__raw":17892},{"id":68,"tdh":48918.83178534572,"balance":97,"tdh__raw":12028},{"id":69,"tdh":48474.3,"balance":69,"tdh__raw":8487},{"id":70,"tdh":47078.97297297297,"balance":78,"tdh__raw":9282},{"id":71,"tdh":46361.15030674847,"balance":65,"tdh__raw":7670},{"id":72,"tdh":45423.57545045045,"balance":89,"tdh__raw":10235},{"id":73,"tdh":44625.217217217214,"balance":101,"tdh__raw":11312},{"id":74,"tdh":43351,"balance":69,"tdh__raw":7590},{"id":75,"tdh":42239.09849749583,"balance":60,"tdh__raw":6420},{"id":76,"tdh":41453.22495606327,"balance":57,"tdh__raw":5985},{"id":77,"tdh":40592.3,"balance":50,"tdh__raw":5150},{"id":78,"tdh":39479.2618629174,"balance":57,"tdh__raw":5700},{"id":79,"tdh":38677.05293276109,"balance":70,"tdh__raw":6860},{"id":80,"tdh":37909.41883767535,"balance":50,"tdh__raw":4800},{"id":81,"tdh":36729.44776119403,"balance":47,"tdh__raw":4371},{"id":82,"tdh":35939.567164179105,"balance":47,"tdh__raw":4277},{"id":83,"tdh":34967.30828220859,"balance":65,"tdh__raw":5785},{"id":84,"tdh":34197.93873873874,"balance":56,"tdh__raw":4816},{"id":85,"tdh":33435.443999999996,"balance":101,"tdh__raw":8484},{"id":86,"tdh":32316.199999999997,"balance":42,"tdh__raw":3444},{"id":87,"tdh":26111.027027027027,"balance":78,"tdh__raw":5148},{"id":88,"tdh":24828.300000000003,"balance":69,"tdh__raw":4347},{"id":89,"tdh":24076.03437967115,"balance":67,"tdh__raw":4087},{"id":90,"tdh":22897.971880492092,"balance":57,"tdh__raw":3306},{"id":91,"tdh":22102.588938714496,"balance":67,"tdh__raw":3752},{"id":92,"tdh":21324.048096192382,"balance":50,"tdh__raw":2700},{"id":93,"tdh":20125.236671001298,"balance":77,"tdh__raw":3927},{"id":94,"tdh":19363.233062330622,"balance":37,"tdh__raw":1813},{"id":95,"tdh":18595.62401574803,"balance":51,"tdh__raw":2397},{"id":96,"tdh":16552.2,"balance":42,"tdh__raw":1764},{"id":97,"tdh":15803.508771929824,"balance":40,"tdh__raw":1600},{"id":98,"tdh":14581.7,"balance":42,"tdh__raw":1554},{"id":99,"tdh":13821.142284569138,"balance":50,"tdh__raw":1750},{"id":100,"tdh":13033.029850746268,"balance":47,"tdh__raw":1551},{"id":101,"tdh":11799.86301369863,"balance":51,"tdh__raw":1530},{"id":102,"tdh":11058.328358208955,"balance":47,"tdh__raw":1316},{"id":103,"tdh":10246.6,"balance":36,"tdh__raw":936},{"id":104,"tdh":9064.3,"balance":50,"tdh__raw":1150},{"id":105,"tdh":8292.685370741483,"balance":50,"tdh__raw":1050},{"id":106,"tdh":7487.9,"balance":50,"tdh__raw":950},{"id":107,"tdh":6305.599999999999,"balance":42,"tdh__raw":672},{"id":108,"tdh":5561.895161290322,"balance":50,"tdh__raw":700},{"id":109,"tdh":4793.983561643836,"balance":37,"tdh__raw":444},{"id":110,"tdh":3554.4626865671644,"balance":47,"tdh__raw":423},{"id":111,"tdh":2758.7,"balance":42,"tdh__raw":294},{"id":112,"tdh":1952.7477477477476,"balance":44,"tdh__raw":220}],"memes_ranks":[{"id":1,"rank":1},{"id":2,"rank":1},{"id":3,"rank":1},{"id":4,"rank":1},{"id":5,"rank":1},{"id":6,"rank":1},{"id":7,"rank":1},{"id":8,"rank":1},{"id":9,"rank":1},{"id":10,"rank":1},{"id":11,"rank":1},{"id":12,"rank":1},{"id":13,"rank":1},{"id":14,"rank":1},{"id":15,"rank":1},{"id":16,"rank":1},{"id":17,"rank":1},{"id":18,"rank":1},{"id":19,"rank":1},{"id":20,"rank":1},{"id":21,"rank":1},{"id":22,"rank":1},{"id":23,"rank":1},{"id":24,"rank":1},{"id":25,"rank":1},{"id":26,"rank":1},{"id":27,"rank":2},{"id":28,"rank":1},{"id":29,"rank":1},{"id":30,"rank":1},{"id":31,"rank":1},{"id":32,"rank":1},{"id":33,"rank":1},{"id":34,"rank":1},{"id":35,"rank":1},{"id":36,"rank":1},{"id":37,"rank":1},{"id":38,"rank":1},{"id":39,"rank":1},{"id":40,"rank":1},{"id":41,"rank":1},{"id":42,"rank":1},{"id":43,"rank":1},{"id":44,"rank":1},{"id":45,"rank":1},{"id":46,"rank":1},{"id":47,"rank":1},{"id":48,"rank":1},{"id":49,"rank":1},{"id":50,"rank":1},{"id":51,"rank":1},{"id":52,"rank":1},{"id":53,"rank":1},{"id":54,"rank":1},{"id":55,"rank":1},{"id":56,"rank":1},{"id":57,"rank":1},{"id":58,"rank":1},{"id":59,"rank":1},{"id":60,"rank":1},{"id":61,"rank":1},{"id":62,"rank":1},{"id":63,"rank":1},{"id":64,"rank":1},{"id":65,"rank":1},{"id":66,"rank":1},{"id":67,"rank":1},{"id":68,"rank":1},{"id":69,"rank":1},{"id":70,"rank":1},{"id":71,"rank":1},{"id":72,"rank":1},{"id":73,"rank":1},{"id":74,"rank":1},{"id":75,"rank":1},{"id":76,"rank":1},{"id":77,"rank":1},{"id":78,"rank":1},{"id":79,"rank":1},{"id":80,"rank":1},{"id":81,"rank":1},{"id":82,"rank":1},{"id":83,"rank":1},{"id":84,"rank":1},{"id":85,"rank":1},{"id":86,"rank":1},{"id":87,"rank":1},{"id":88,"rank":1},{"id":89,"rank":1},{"id":90,"rank":1},{"id":91,"rank":1},{"id":92,"rank":1},{"id":93,"rank":1},{"id":94,"rank":1},{"id":95,"rank":1},{"id":96,"rank":1},{"id":97,"rank":1},{"id":98,"rank":1},{"id":99,"rank":1},{"id":100,"rank":1},{"id":101,"rank":1},{"id":102,"rank":1},{"id":103,"rank":1},{"id":104,"rank":1},{"id":105,"rank":1},{"id":106,"rank":1},{"id":107,"rank":1},{"id":108,"rank":1},{"id":109,"rank":1},{"id":110,"rank":1},{"id":111,"rank":1},{"id":112,"rank":1}],"gradients":[{"id":0,"rank":9},{"id":10,"rank":32},{"id":20,"rank":34},{"id":30,"rank":35},{"id":40,"rank":36},{"id":50,"rank":10},{"id":60,"rank":37},{"id":70,"rank":38},{"id":80,"rank":41},{"id":90,"rank":44},{"id":100,"rank":11}],"gradients_ranks":[{"id":0,"rank":9},{"id":10,"rank":32},{"id":20,"rank":34},{"id":30,"rank":35},{"id":40,"rank":36},{"id":50,"rank":10},{"id":60,"rank":37},{"id":70,"rank":38},{"id":80,"rank":41},{"id":90,"rank":44},{"id":100,"rank":11}],"created_at":{"ms":1687349430000},"transaction_reference":{"ms":1687349430000},"block":17531453,"tdh_rank":1,"tdh":7533059,"boost":1.3,"boosted_tdh":9792977,"tdh__raw":1550187,"balance":8645,"memes_cards_sets":32,"genesis":1,"unique_memes":112,"memes_tdh":7340887,"memes_tdh__raw":1545262,"memes_balance":8669,"memes_tdh_season1":5041784,"memes_tdh_season1__raw":1019481,"memes_tdh_season2":1943010,"memes_tdh_season2__raw":476400,"gradients_tdh":192173,"gradients_tdh__raw":4925,"gradients_balance":11,"boosted_memes_tdh_season1":6554318.670188044,"boosted_memes_tdh_season2":2525913.3157930644,"boosted_gradients_tdh":249824.28217821784,"tdh_rank_memes":1,"tdh_rank_memes_szn1":1,"tdh_rank_memes_szn2":1,"tdh_rank_gradients":1,"tdh_rank_memes_szn3":1,"unique_memes_season1":47,"unique_memes_season2":39,"unique_memes_season3":26,"boosted_memes_tdh_season3":462920.5241418166,"memes_tdh_season3":356093,"memes_tdh_season3__raw":49381,"boosted_memes_tdh":9543153,"memes_balance_season1":3724,"memes_balance_season2":3590,"memes_balance_season3":1355,"purchases_value":0,"purchases_count":0,"purchases_value_primary":0,"purchases_count_primary":0,"purchases_value_secondary":0,"purchases_count_secondary":0,"sales_value":0,"sales_count":0,"transfers_in":8680,"transfers_out":0,"purchases_value_memes":0,"purchases_count_memes":0,"purchases_value_memes_season1":0,"purchases_count_memes_season1":0,"purchases_value_memes_season2":0,"purchases_count_memes_season2":0,"purchases_value_memes_season3":0,"purchases_count_memes_season3":0,"purchases_value_gradients":0,"purchases_count_gradients":0,"purchases_value_primary_memes":0,"purchases_count_primary_memes":0,"purchases_value_primary_memes_season1":0,"purchases_count_primary_memes_season1":0,"purchases_value_primary_memes_season2":0,"purchases_count_primary_memes_season2":0,"purchases_value_primary_memes_season3":0,"purchases_count_primary_memes_season3":0,"purchases_value_primary_gradients":0,"purchases_count_primary_gradients":0,"purchases_value_secondary_memes":0,"purchases_count_secondary_memes":0,"purchases_value_secondary_memes_season1":0,"purchases_count_secondary_memes_season1":0,"purchases_value_secondary_memes_season2":0,"purchases_count_secondary_memes_season2":0,"purchases_value_secondary_memes_season3":0,"purchases_count_secondary_memes_season3":0,"purchases_value_secondary_gradients":0,"purchases_count_secondary_gradients":0,"sales_value_memes":0,"sales_count_memes":0,"sales_value_memes_season1":0,"sales_count_memes_season1":0,"sales_value_memes_season2":0,"sales_count_memes_season2":0,"sales_value_memes_season3":0,"sales_count_memes_season3":0,"sales_value_gradients":0,"sales_count_gradients":0,"transfers_in_memes":8669,"transfers_out_memes":0,"transfers_in_memes_season1":3724,"transfers_out_memes_season1":0,"transfers_in_memes_season2":3590,"transfers_out_memes_season2":0,"transfers_in_memes_season3":1355,"transfers_out_memes_season3":0,"transfers_in_gradients":11,"transfers_out_gradients":0,"ens":"6529Museum"}`,
    );
  });

  it('should fetch and normalise consolidated uploads for a block', async () => {
    const tdhInfos = await seizeApi.getConsolidatedUploadsForBlock(17531453);
    expect(tdhInfos.length).toBe(2);
    const tdhInfo = tdhInfos[0];
    expect(JSON.stringify(tdhInfo)).toBe(
      `{"wallet":"0xc6400a5584db71e41b0e5dfbdc769b54b91256cd","memes":[{"id":1,"tdh":164919.027,"balance":111,"tdh__raw":41847},{"id":2,"tdh":184923.543,"balance":133,"tdh__raw":46923},{"id":3,"tdh":164919.027,"balance":111,"tdh__raw":41847},{"id":4,"tdh":150060.14333333334,"balance":32,"tdh__raw":11423},{"id":5,"tdh":142208.4569420035,"balance":59,"tdh__raw":20532},{"id":6,"tdh":102691.2,"balance":32,"tdh__raw":10944},{"id":7,"tdh":131122.56234718827,"balance":81,"tdh__raw":27216},{"id":8,"tdh":217116,"balance":652,"tdh__raw":217116},{"id":9,"tdh":126900.2,"balance":51,"tdh__raw":16422},{"id":10,"tdh":134582.20895522388,"balance":52,"tdh__raw":16016},{"id":11,"tdh":122127.6923076923,"balance":47,"tdh__raw":14100},{"id":12,"tdh":127415.7894736842,"balance":43,"tdh__raw":12900},{"id":13,"tdh":116945.9649122807,"balance":40,"tdh__raw":11840},{"id":14,"tdh":116069.02987697716,"balance":57,"tdh__raw":16758},{"id":15,"tdh":114724.611183355,"balance":78,"tdh__raw":22386},{"id":16,"tdh":110070.9525483304,"balance":58,"tdh__raw":15892},{"id":17,"tdh":108527.71748878925,"balance":69,"tdh__raw":18423},{"id":18,"tdh":104938.7843137255,"balance":97,"tdh__raw":25802},{"id":19,"tdh":105622.0536635707,"balance":98,"tdh__raw":25970},{"id":20,"tdh":103013.8520179372,"balance":67,"tdh__raw":17487},{"id":21,"tdh":107081.58558558558,"balance":58,"tdh__raw":15080},{"id":22,"tdh":102658.52011494253,"balance":70,"tdh__raw":18130},{"id":23,"tdh":101856.49560632688,"balance":57,"tdh__raw":14706},{"id":24,"tdh":103695.21666666666,"balance":43,"tdh__raw":11051},{"id":25,"tdh":100042.02063983488,"balance":98,"tdh__raw":24598},{"id":26,"tdh":98688.99479843953,"balance":79,"tdh__raw":19257},{"id":27,"tdh":95981.98986486488,"balance":89,"tdh__raw":21627},{"id":28,"tdh":94584,"balance":42,"tdh__raw":10080},{"id":29,"tdh":93995.79104477612,"balance":47,"tdh__raw":11186},{"id":30,"tdh":94805.63796133568,"balance":58,"tdh__raw":13688},{"id":31,"tdh":92021.0895522388,"balance":47,"tdh__raw":10951},{"id":32,"tdh":91265.26315789472,"balance":40,"tdh__raw":9240},{"id":33,"tdh":89066.59999999999,"balance":42,"tdh__raw":9492},{"id":34,"tdh":88517.63685636857,"balance":37,"tdh__raw":8288},{"id":35,"tdh":88362.84999999999,"balance":43,"tdh__raw":9417},{"id":36,"tdh":85702.04477611941,"balance":47,"tdh__raw":10199},{"id":37,"tdh":84731.5,"balance":42,"tdh__raw":9030},{"id":38,"tdh":82906.44991212654,"balance":57,"tdh__raw":11970},{"id":39,"tdh":80873.87512899897,"balance":97,"tdh__raw":19885},{"id":40,"tdh":80121.88490284006,"balance":67,"tdh__raw":13601},{"id":41,"tdh":79407.77750611247,"balance":82,"tdh__raw":16482},{"id":42,"tdh":79124.9739826551,"balance":152,"tdh__raw":30096},{"id":43,"tdh":77320.92092092092,"balance":100,"tdh__raw":19600},{"id":44,"tdh":76554.82184655395,"balance":77,"tdh__raw":14938},{"id":45,"tdh":75457.14180929096,"balance":82,"tdh__raw":15662},{"id":46,"tdh":74362.99345335516,"balance":61,"tdh__raw":11529},{"id":47,"tdh":73696.7,"balance":42,"tdh__raw":7854},{"id":48,"tdh":67542.31413612566,"balance":134,"tdh__raw":22914},{"id":49,"tdh":66277.12693498452,"balance":97,"tdh__raw":16296},{"id":50,"tdh":65796.58045977012,"balance":70,"tdh__raw":11620},{"id":51,"tdh":64302.6026026026,"balance":100,"tdh__raw":16300},{"id":52,"tdh":63450.1,"balance":142,"tdh__raw":22862},{"id":53,"tdh":62605.49864986498,"balance":111,"tdh__raw":17649},{"id":54,"tdh":61541.14114114114,"balance":100,"tdh__raw":15600},{"id":55,"tdh":60591.24917491749,"balance":121,"tdh__raw":18634},{"id":56,"tdh":60325.05352112676,"balance":143,"tdh__raw":21736},{"id":57,"tdh":58384.894422310754,"balance":201,"tdh__raw":29748},{"id":58,"tdh":57990.69069069069,"balance":100,"tdh__raw":14700},{"id":59,"tdh":57144.5,"balance":142,"tdh__raw":20590},{"id":60,"tdh":55911.82898289829,"balance":111,"tdh__raw":15762},{"id":61,"tdh":55693.25337837837,"balance":89,"tdh__raw":12549},{"id":62,"tdh":54440.24024024024,"balance":100,"tdh__raw":13800},{"id":63,"tdh":54193.12888888889,"balance":91,"tdh__raw":12376},{"id":64,"tdh":52870.17031070196,"balance":87,"tdh__raw":11658},{"id":65,"tdh":51627.1,"balance":142,"tdh__raw":18602},{"id":66,"tdh":50496.85861713107,"balance":97,"tdh__raw":12416},{"id":67,"tdh":49656.6,"balance":142,"tdh__raw":17892},{"id":68,"tdh":48918.83178534572,"balance":97,"tdh__raw":12028},{"id":69,"tdh":48474.3,"balance":69,"tdh__raw":8487},{"id":70,"tdh":47078.97297297297,"balance":78,"tdh__raw":9282},{"id":71,"tdh":46361.15030674847,"balance":65,"tdh__raw":7670},{"id":72,"tdh":45423.57545045045,"balance":89,"tdh__raw":10235},{"id":73,"tdh":44625.217217217214,"balance":101,"tdh__raw":11312},{"id":74,"tdh":43351,"balance":69,"tdh__raw":7590},{"id":75,"tdh":42239.09849749583,"balance":60,"tdh__raw":6420},{"id":76,"tdh":41453.22495606327,"balance":57,"tdh__raw":5985},{"id":77,"tdh":40592.3,"balance":50,"tdh__raw":5150},{"id":78,"tdh":39479.2618629174,"balance":57,"tdh__raw":5700},{"id":79,"tdh":38677.05293276109,"balance":70,"tdh__raw":6860},{"id":80,"tdh":37909.41883767535,"balance":50,"tdh__raw":4800},{"id":81,"tdh":36729.44776119403,"balance":47,"tdh__raw":4371},{"id":82,"tdh":35939.567164179105,"balance":47,"tdh__raw":4277},{"id":83,"tdh":34967.30828220859,"balance":65,"tdh__raw":5785},{"id":84,"tdh":34197.93873873874,"balance":56,"tdh__raw":4816},{"id":85,"tdh":33435.443999999996,"balance":101,"tdh__raw":8484},{"id":86,"tdh":32316.199999999997,"balance":42,"tdh__raw":3444},{"id":87,"tdh":26111.027027027027,"balance":78,"tdh__raw":5148},{"id":88,"tdh":24828.300000000003,"balance":69,"tdh__raw":4347},{"id":89,"tdh":24076.03437967115,"balance":67,"tdh__raw":4087},{"id":90,"tdh":22897.971880492092,"balance":57,"tdh__raw":3306},{"id":91,"tdh":22102.588938714496,"balance":67,"tdh__raw":3752},{"id":92,"tdh":21324.048096192382,"balance":50,"tdh__raw":2700},{"id":93,"tdh":20125.236671001298,"balance":77,"tdh__raw":3927},{"id":94,"tdh":19363.233062330622,"balance":37,"tdh__raw":1813},{"id":95,"tdh":18595.62401574803,"balance":51,"tdh__raw":2397},{"id":96,"tdh":16552.2,"balance":42,"tdh__raw":1764},{"id":97,"tdh":15803.508771929824,"balance":40,"tdh__raw":1600},{"id":98,"tdh":14581.7,"balance":42,"tdh__raw":1554},{"id":99,"tdh":13821.142284569138,"balance":50,"tdh__raw":1750},{"id":100,"tdh":13033.029850746268,"balance":47,"tdh__raw":1551},{"id":101,"tdh":11799.86301369863,"balance":51,"tdh__raw":1530},{"id":102,"tdh":11058.328358208955,"balance":47,"tdh__raw":1316},{"id":103,"tdh":10246.6,"balance":36,"tdh__raw":936},{"id":104,"tdh":9064.3,"balance":50,"tdh__raw":1150},{"id":105,"tdh":8292.685370741483,"balance":50,"tdh__raw":1050},{"id":106,"tdh":7487.9,"balance":50,"tdh__raw":950},{"id":107,"tdh":6305.599999999999,"balance":42,"tdh__raw":672},{"id":108,"tdh":5561.895161290322,"balance":50,"tdh__raw":700},{"id":109,"tdh":4793.983561643836,"balance":37,"tdh__raw":444},{"id":110,"tdh":3554.4626865671644,"balance":47,"tdh__raw":423},{"id":111,"tdh":2758.7,"balance":42,"tdh__raw":294},{"id":112,"tdh":1952.7477477477476,"balance":44,"tdh__raw":220}],"memes_ranks":[{"id":1,"rank":1},{"id":2,"rank":1},{"id":3,"rank":1},{"id":4,"rank":1},{"id":5,"rank":1},{"id":6,"rank":1},{"id":7,"rank":1},{"id":8,"rank":1},{"id":9,"rank":1},{"id":10,"rank":1},{"id":11,"rank":1},{"id":12,"rank":1},{"id":13,"rank":1},{"id":14,"rank":1},{"id":15,"rank":1},{"id":16,"rank":1},{"id":17,"rank":1},{"id":18,"rank":1},{"id":19,"rank":1},{"id":20,"rank":1},{"id":21,"rank":1},{"id":22,"rank":1},{"id":23,"rank":1},{"id":24,"rank":1},{"id":25,"rank":1},{"id":26,"rank":1},{"id":27,"rank":2},{"id":28,"rank":1},{"id":29,"rank":1},{"id":30,"rank":1},{"id":31,"rank":1},{"id":32,"rank":1},{"id":33,"rank":1},{"id":34,"rank":1},{"id":35,"rank":1},{"id":36,"rank":1},{"id":37,"rank":1},{"id":38,"rank":1},{"id":39,"rank":1},{"id":40,"rank":1},{"id":41,"rank":1},{"id":42,"rank":1},{"id":43,"rank":1},{"id":44,"rank":1},{"id":45,"rank":1},{"id":46,"rank":1},{"id":47,"rank":1},{"id":48,"rank":1},{"id":49,"rank":1},{"id":50,"rank":1},{"id":51,"rank":1},{"id":52,"rank":1},{"id":53,"rank":1},{"id":54,"rank":1},{"id":55,"rank":1},{"id":56,"rank":1},{"id":57,"rank":1},{"id":58,"rank":1},{"id":59,"rank":1},{"id":60,"rank":1},{"id":61,"rank":1},{"id":62,"rank":1},{"id":63,"rank":1},{"id":64,"rank":1},{"id":65,"rank":1},{"id":66,"rank":1},{"id":67,"rank":1},{"id":68,"rank":1},{"id":69,"rank":1},{"id":70,"rank":1},{"id":71,"rank":1},{"id":72,"rank":1},{"id":73,"rank":1},{"id":74,"rank":1},{"id":75,"rank":1},{"id":76,"rank":1},{"id":77,"rank":1},{"id":78,"rank":1},{"id":79,"rank":1},{"id":80,"rank":1},{"id":81,"rank":1},{"id":82,"rank":1},{"id":83,"rank":1},{"id":84,"rank":1},{"id":85,"rank":1},{"id":86,"rank":1},{"id":87,"rank":1},{"id":88,"rank":1},{"id":89,"rank":1},{"id":90,"rank":1},{"id":91,"rank":1},{"id":92,"rank":1},{"id":93,"rank":1},{"id":94,"rank":1},{"id":95,"rank":1},{"id":96,"rank":1},{"id":97,"rank":1},{"id":98,"rank":1},{"id":99,"rank":1},{"id":100,"rank":1},{"id":101,"rank":1},{"id":102,"rank":1},{"id":103,"rank":1},{"id":104,"rank":1},{"id":105,"rank":1},{"id":106,"rank":1},{"id":107,"rank":1},{"id":108,"rank":1},{"id":109,"rank":1},{"id":110,"rank":1},{"id":111,"rank":1},{"id":112,"rank":1}],"gradients":[{"id":0,"rank":9},{"id":10,"rank":32},{"id":20,"rank":34},{"id":30,"rank":35},{"id":40,"rank":36},{"id":50,"rank":10},{"id":60,"rank":37},{"id":70,"rank":38},{"id":80,"rank":41},{"id":90,"rank":44},{"id":100,"rank":11}],"gradients_ranks":[{"id":0,"rank":9},{"id":10,"rank":32},{"id":20,"rank":34},{"id":30,"rank":35},{"id":40,"rank":36},{"id":50,"rank":10},{"id":60,"rank":37},{"id":70,"rank":38},{"id":80,"rank":41},{"id":90,"rank":44},{"id":100,"rank":11}],"created_at":{"ms":1687349430000},"transaction_reference":{"ms":1687349430000},"block":17531453,"tdh_rank":1,"tdh":7533059,"boost":1.3,"boosted_tdh":9792977,"tdh__raw":1550187,"balance":8645,"memes_cards_sets":32,"genesis":1,"unique_memes":112,"memes_tdh":7340887,"memes_tdh__raw":1545262,"memes_balance":8669,"memes_tdh_season1":5041784,"memes_tdh_season1__raw":1019481,"memes_tdh_season2":1943010,"memes_tdh_season2__raw":476400,"gradients_tdh":192173,"gradients_tdh__raw":4925,"gradients_balance":11,"boosted_memes_tdh_season1":6554319.2,"boosted_memes_tdh_season2":2525913,"boosted_gradients_tdh":249824.9,"tdh_rank_memes":1,"tdh_rank_memes_szn1":1,"tdh_rank_memes_szn2":1,"tdh_rank_gradients":1,"tdh_rank_memes_szn3":1,"unique_memes_season1":47,"unique_memes_season2":39,"unique_memes_season3":26,"boosted_memes_tdh_season3":462920.9,"memes_tdh_season3":356093,"memes_tdh_season3__raw":49381,"boosted_memes_tdh":9543153,"memes_balance_season1":3724,"memes_balance_season2":3590,"memes_balance_season3":1355,"purchases_value":0,"purchases_count":0,"purchases_value_primary":0,"purchases_count_primary":0,"purchases_value_secondary":0,"purchases_count_secondary":0,"sales_value":0,"sales_count":0,"transfers_in":8680,"transfers_out":0,"purchases_value_memes":0,"purchases_count_memes":0,"purchases_value_memes_season1":0,"purchases_count_memes_season1":0,"purchases_value_memes_season2":0,"purchases_count_memes_season2":0,"purchases_value_memes_season3":0,"purchases_count_memes_season3":0,"purchases_value_gradients":0,"purchases_count_gradients":0,"purchases_value_primary_memes":0,"purchases_count_primary_memes":0,"purchases_value_primary_memes_season1":0,"purchases_count_primary_memes_season1":0,"purchases_value_primary_memes_season2":0,"purchases_count_primary_memes_season2":0,"purchases_value_primary_memes_season3":0,"purchases_count_primary_memes_season3":0,"purchases_value_primary_gradients":0,"purchases_count_primary_gradients":0,"purchases_value_secondary_memes":0,"purchases_count_secondary_memes":0,"purchases_value_secondary_memes_season1":0,"purchases_count_secondary_memes_season1":0,"purchases_value_secondary_memes_season2":0,"purchases_count_secondary_memes_season2":0,"purchases_value_secondary_memes_season3":0,"purchases_count_secondary_memes_season3":0,"purchases_value_secondary_gradients":0,"purchases_count_secondary_gradients":0,"sales_value_memes":0,"sales_count_memes":0,"sales_value_memes_season1":0,"sales_count_memes_season1":0,"sales_value_memes_season2":0,"sales_count_memes_season2":0,"sales_value_memes_season3":0,"sales_count_memes_season3":0,"sales_value_gradients":0,"sales_count_gradients":0,"transfers_in_memes":8669,"transfers_out_memes":0,"transfers_in_memes_season1":3724,"transfers_out_memes_season1":0,"transfers_in_memes_season2":3590,"transfers_out_memes_season2":0,"transfers_in_memes_season3":1355,"transfers_out_memes_season3":0,"transfers_in_gradients":11,"transfers_out_gradients":0,"consolidation_display":"0xc6400a5584db71e41b0e5dfbdc769b54b91256cd","wallets":["0xc6400a5584db71e41b0e5dfbdc769b54b91256cd"]}`,
    );
  });

  it('should throw error if there is no data for given block', async () => {
    let error: string;
    try {
      await seizeApi.getUploadsForBlock(1);
    } catch (e) {
      error = e.message;
    }
    expect(error).toBe(`No TDH found for block 1`);
  });
});

describe('Seize API Consolidations', () => {
  let seizeApi: SeizeApi;

  beforeAll(() => {
    const mockHttp = new MockHttp({
      'https://www.example.com/api/consolidations?block=17531453&page=1&page_size=5':
        {
          data: [
            {
              consolidation_display: 'cd1',
              wallets: ['0x1', '0x2', '0x3'],
              primary: '0x1',
            },
            {
              consolidation_display: 'cd2',
              wallets: ['0x4', '0x5', '0x6'],
              primary: '0x4',
            },
          ],
        },
    });
    seizeApi = new SeizeApi(mockHttp, 'https://www.example.com/api');
  });

  it('should fetch the consolidations', async () => {
    const { data } = await seizeApi.getConsolidations({
      block: 17531453,
      limit: 5,
      page: 1,
    });
    expect(data.length).toBe(2);
    expect(JSON.stringify(data[0])).toBe(
      `{"consolidation_display":"cd1","wallets":["0x1","0x2","0x3"],"primary":"0x1"}`,
    );
    expect(JSON.stringify(data[1])).toBe(
      `{"consolidation_display":"cd2","wallets":["0x4","0x5","0x6"],"primary":"0x4"}`,
    );
  });
});
