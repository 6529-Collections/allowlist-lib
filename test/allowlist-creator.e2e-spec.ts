import { AllowlistCreator } from '../src/allowlist/allowlist-creator';
import { AllowlistOperation } from '../src/allowlist/allowlist-operation';
import { AllowlistOperationCode } from '../src/allowlist/allowlist-operation-code';
import { Pool } from '../src/app-types';
import axios from 'axios';

describe('AllowlistCreator e2e tests', () => {
  let allowlistCreator: AllowlistCreator;

  beforeEach(async () => {
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
    if (!etherscanApiKey) {
      throw new Error('Environment variable ETHERSCAN_API_KEY is not defined');
    }
    const alchemyApiKey = process.env.ALCHEMY_API_KEY;
    if (!alchemyApiKey) {
      throw new Error('Environment variable ALCHEMY_API_KEY is not defined');
    }
    allowlistCreator = AllowlistCreator.getInstance({
      etherscanApiKey: etherscanApiKey,
      alchemyApiKey: process.env.ALCHEMY_API_KEY,
      seizeApiPath: 'https://api.seize.io/api',
      seizeApiKey: process.env.SEIZE_API_KEY,
      onAfterOperation: () => {
        return;
      },
      onBeforeOperation: () => {
        return;
      },
    });
  });

  it.skip(
    'TEST',
    async () => {
      const operations: AllowlistOperation[] = [
        {
          code: AllowlistOperationCode.CREATE_ALLOWLIST,
          params: {
            id: 'allowlist-1',
            name: 'MEME CARD 95 DISTRIBUTION',
            description: 'Allowlist for meme card 95 distribution',
          },
        },
        {
          code: AllowlistOperationCode.CREATE_TOKEN_POOL,
          params: {
            id: '64cd236ab7b52ead80179903',
            name: 'The Memes by 6529 SZN4',
            description: 'The Memes by 6529 SZN4',
            contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
            blockNo: 17832569,
            consolidateBlockNo: 17837574,
            tokenIds: '119-126',
          },
        },
        {
          code: AllowlistOperationCode.CREATE_CUSTOM_TOKEN_POOL,
          params: {
            id: '64cd2386b113565b8cbfcaad',
            name: 'team',
            description: 'team',
            tokens: [
              { owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd' },
              { owner: '0x8ba68cfe71550efc8988d81d040473709b7f9218' },
              { owner: '0xa743c8c57c425b84cb2ed18c6b9ae3ad21629cb5' },
              { owner: '0x1b7844cfae4c823ac6389855d47106a70c84f067' },
              { owner: '0x76d078d7e5755b66ff50166863329d27f2566b43' },
              { owner: '0xfd22004806a6846ea67ad883356be810f0428793' },
              { owner: '0xc3c9737cce778d7583f31ae7c4f2ab8782ed51e5' },
              { owner: '0xa62da2ea9f5bb03a58174060535ae32131973178' },
              { owner: '0xe16df6503acd3c79b6e032f62c61752bec16eef2' },
              { owner: '0x9769334fc882775f4951865aa473481880669d47' },
              { owner: '0x3852471d266d9e2222ca9fdd922bafc904dc49e5' },
              { owner: '0x88d3574660711e03196af8a96f268697590000fa' },
              { owner: '0x885846850aabf20d8f8e051f400354d94a32ff55' },
              { owner: '0x61d9d9cc8c3203dab7100ea79ced77587201c990' },
              { owner: '0xe359ab04cec41ac8c62bc5016c10c749c7de5480' },
              { owner: '0xfe3b3f0d64f354b69a5b40d02f714e69ca4b09bd' },
              { owner: '0x8889ebb11295f456541901f50bcb5f382047caac' },
              { owner: '0x4269aadfd043b58cba893bfe6029c9895c25cb61' },
              { owner: '0xbdf82b13580b918ebc3c24b4034e8468ea168e21' },
              { owner: '0x83ee335ca72759caeded7b1afd11dcf75f48436b' },
              { owner: '0xdda3cb2741fac4a87caebec9efc7963087304097' },
              { owner: '0xf9e129817bc576f937e4774e3c3aec98787cfb91' },
              { owner: '0x8e63380ac1e34c7d61bf404af63e885875c18ce3' },
              { owner: '0xaf5c021754ab82bf556bc6c90650de21cf92d1c7' },
              { owner: '0x7f3774eadae4beb01919dec7f32a72e417ab5de3' },
              { owner: '0xc03e57b6ace9dd62c84a095e11e494e3c8fd4d42' },
              { owner: '0xe70d73c76ff3b4388ee9c58747f0eaa06c6b645b' },
            ],
          },
        },
        {
          code: AllowlistOperationCode.ADD_PHASE,
          params: {
            id: '64cd238b62e03f8dd562e03b',
            name: 'phase',
            description: 'phase',
          },
        },
        {
          code: AllowlistOperationCode.ADD_COMPONENT,
          params: {
            id: '64cd23b4339af0b9f4eec45d',
            phaseId: '64cd238b62e03f8dd562e03b',
            name: 'g',
            description: 'g',
          },
        },
        {
          code: AllowlistOperationCode.ADD_ITEM,
          params: {
            id: '64cd23b4cb5e64721c418cb3',
            name: 'g',
            description: 'g',
            componentId: '64cd23b4339af0b9f4eec45d',
            poolId: '64cd236ab7b52ead80179903',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: AllowlistOperationCode.ITEM_REMOVE_WALLETS_FROM_CERTAIN_TOKEN_POOLS,
          params: {
            itemId: '64cd23b4cb5e64721c418cb3',
            pools: [
              {
                poolType: 'CUSTOM_TOKEN_POOL',
                poolId: '64cd2386b113565b8cbfcaad',
              },
            ],
          },
        },
        {
          code: AllowlistOperationCode.ITEM_SORT_WALLETS_BY_UNIQUE_TOKENS_COUNT,
          params: { itemId: '64cd23b4cb5e64721c418cb3' },
        },
        {
          code: AllowlistOperationCode.ITEM_SELECT_FIRST_N_WALLETS,
          params: { itemId: '64cd23b4cb5e64721c418cb3', count: 150 },
        },
        {
          code: AllowlistOperationCode.COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS,
          params: { componentId: '64cd23b4339af0b9f4eec45d', spots: 1 },
        },
      ];
      const state = await allowlistCreator.execute(operations);

      const targetResults = [
        '0x0064f02799ea7748a9b51b5e78bcd274d9e7d0a1'.toLowerCase(),
        '0x01f4ab9ccf822e74cd514b1fc16068e749d37b1c'.toLowerCase(),
        '0x0679f9107298adc4e7cca3cbf0088e875e8fcd71'.toLowerCase(),
        '0x06e13bd0a3cba08e61028f2326b9ea2ca2539900'.toLowerCase(),
        '0x0c4a911ed6af1032beec7c19225c91a3160e39e3'.toLowerCase(),
        '0x0ccbe7a96839ae801e7aaa51a63dc41584fe8540'.toLowerCase(),
        '0x0dd38657d7c8024e7d62bde3d0423ca34769be50'.toLowerCase(),
        '0x0e3e001a00c07e2cb3219d1ec0c47cc532d87804'.toLowerCase(),
        '0x0e81a8a496f9cb7e1d29382e91f06a6f7416cb9a'.toLowerCase(),
        '0x13928eb9a86c8278a45b6ff2935c7730b58ac675'.toLowerCase(),
        '0x13c612f1eba31f1a6566d94bab8a4c482b2c2360'.toLowerCase(),
        '0x13eee41d67b8d99e11174161d72cf8ccd194458c'.toLowerCase(),
        '0x144c704bf25f1865e4b24fd6596ffed7d92470b0'.toLowerCase(),
        '0x16b5ec9e34bd0a916822d6785b1c600ac911d6dd'.toLowerCase(),
        '0x17e31bf839acb700e0f584797574a2c1fde46d0b'.toLowerCase(),
        '0x17eebf2b0c31f6af94abdb551d1dd509ba6e4f0a'.toLowerCase(),
        '0x185952b3bb31da0ae18354bbb90ae40adc840c33'.toLowerCase(),
        '0x19e7a132bd4b42f580f546197f42e19c42cdfe6c'.toLowerCase(),
        '0x1ee5106b2233169b84dad2acdbf498b29c3c7d15'.toLowerCase(),
        '0x2177da04f9479496c2292d6344d306aa49beb34a'.toLowerCase(),
        '0x21e2254ab84a5ecab8ad6b66320d1d1b375c56f9'.toLowerCase(),
        '0x220da3fc3b905c968dfb20c81c170bc4dce56603'.toLowerCase(),
        '0x2929e4c81c4c72a1d9371b09b0bcda2fa593ab6a'.toLowerCase(),
        '0x2a87046ba5fc27b8630fd6e46b953c8523e81345'.toLowerCase(),
        '0x2c9646bf2477a747897047b69ca1a1913ae5f611'.toLowerCase(),
        '0x2fb24b1021e51fa23db91a9b995000181fda0963'.toLowerCase(),
        '0x303a8925d1479a49212e5f7a77396f5fab12db3f'.toLowerCase(),
        '0x334cb32bc18ec632ab04ee55157aae1ff165e093'.toLowerCase(),
        '0x346aaf2e75cfccb82cff0fcb8d2cdc21d5656358'.toLowerCase(),
        '0x3c2286342e143d511ae6b7caefd548bf38c8c1ab'.toLowerCase(),
        '0x3d91ad906c3969f86c588c988f721d5a735c6f81'.toLowerCase(),
        '0x3df7131fbd4f6b27be8317c69e41817498e1bc0c'.toLowerCase(),
        '0x411dd34f17d5b6398f155f768ed27c32ad194862'.toLowerCase(),
        '0x41254fe73d3b49f0fe3cc7743b4d40ef26bb338e'.toLowerCase(),
        '0x42e5abe19ba467b0b32a4d042d3dfd4ba2e196af'.toLowerCase(),
        '0x44f301b1de6c3fec0f8a8aea53311f5cca499904'.toLowerCase(),
        '0x482a13a18634574bdf495c03855d95c543804de6'.toLowerCase(),
        '0x4fc2d05d6c89c744831e6a6959c56ab050ffce7b'.toLowerCase(),
        '0x54913cc8ea17731d62589039dd0152f306473843'.toLowerCase(),
        '0x57c23be389a66a94bbe83871ead5450272f1efd3'.toLowerCase(),
        '0x58059014c5952c04370bcb88a2e0503e9eafb209'.toLowerCase(),
        '0x5cfab23d47598464747dfb169828eebde5e68ff5'.toLowerCase(),
        '0x5df5342342701b8ae5bce28f74ebb73b5fc13a54'.toLowerCase(),
        '0x64f02c24bb510e27b5eaec705eaa840ff7b4df15'.toLowerCase(),
        '0x66b280b5778c35c719209614428caddf00aaa3ce'.toLowerCase(),
        '0x69cb3b1de24e08f1cfc2994171b6c6930498f750'.toLowerCase(),
        '0x69cd43dd4ecf3a076b1b9d2cfd41589987129bc0'.toLowerCase(),
        '0x6b457642d4c02c46f9e1097518cd689e2f7778ac'.toLowerCase(),
        '0x6c529b261a887a7c70db14108d5ea0ebc3becb83'.toLowerCase(),
        '0x6d1db4a7e83dae0eee7e95d421722d46d2a7e94b'.toLowerCase(),
        '0x6f566a6672f615c2975f6c48224c46153e12ffcf'.toLowerCase(),
        '0x722f897909cb4ba363b9b877e4019e3e8e2421ef'.toLowerCase(),
        '0x7330289723b6fcb071acc92e275aa52cc691f1fc'.toLowerCase(),
        '0x740c37bb711d6372ce7de36b2c20a8a6f906b474'.toLowerCase(),
        '0x74c2e5ebf5b7d9d1f43425c77b4237533dcf66b5'.toLowerCase(),
        '0x75005a05bc163b85991b9c9facbcf3155372422e'.toLowerCase(),
        '0x76f51986e21495178646cf499d925b276c84ba4c'.toLowerCase(),
        '0x774a34da2ee2e2d242180819f1ee88783215f7b9'.toLowerCase(),
        '0x775f78da3710a2febe41aae2f8caed6bde504a14'.toLowerCase(),
        '0x78fc8aa7bb4ee047257a245ca590fac4ae4aa97b'.toLowerCase(),
        '0x7a616f70604716c98cbd930903a9b24908bdb264'.toLowerCase(),
        '0x7c0cbf95bcfd15291d991c06d4bdb6912eded9ca'.toLowerCase(),
        '0x7ca00a09e3b431d48c30e3e6cceaaeaf6385cc81'.toLowerCase(),
        '0x801ac1049467293c3d8564a039c63eb133757e82'.toLowerCase(),
        '0x80a1c9fdc26199a69d190ebc8ad287ef48758977'.toLowerCase(),
        '0x81974c1a09e53c5129c6e4f74e547fda0adf4d2d'.toLowerCase(),
        '0x81b55fbe66c5ffbb8468328e924af96a84438f14'.toLowerCase(),
        '0x82139687faae8a29851902783e02e699de0e0846'.toLowerCase(),
        '0x84aeccde4c9f217e83d3fa28c31d34378b903f91'.toLowerCase(),
        '0x86ae37857534a842ac56a4eaeaaf83d02f46d1f8'.toLowerCase(),
        '0x8ac7248a36fffb7e101e6e73bc8d7187f4faf101'.toLowerCase(),
        '0x8b4d0402f7b2f063f255214b7095b5911a257a30'.toLowerCase(),
        '0x8d5e59e11838cff72af5fb0681d96a9136ad0604'.toLowerCase(),
        '0x8f160eb907a80517a3fa6d22f7cf20f552696a44'.toLowerCase(),
        '0x90af376346ca97d4e9d1e510e82543ef99b56a28'.toLowerCase(),
        '0x94d25c0f01977452caf63d0ea939702cb1608ee1'.toLowerCase(),
        '0x957143815f0e1d1b1a31b2bfcded5b416ee675ed'.toLowerCase(),
        '0x966133652465b15365a91a8b1f6c95276838300d'.toLowerCase(),
        '0x96e861634b4c0e0a9e7c6a65dec549cc2a8a0e56'.toLowerCase(),
        '0x97d2b1b4a249ec77d56fd1576546996d14f7db1a'.toLowerCase(),
        '0x9dbc84d7199c97f9adcc9b57439d69c5ca9ad103'.toLowerCase(),
        '0x9e1e3857fb2484379858b9daf230379015a7a100'.toLowerCase(),
        '0x9e23d2db65a1b8b6f31fb57c47148907545b3ff5'.toLowerCase(),
        '0x9eaee59cc2cffb8e99d2b8d70d57128d792e6913'.toLowerCase(),
        '0x9eb69d42dc42c0b20bc93caf1a15a92afa5c4569'.toLowerCase(),
        '0xa6f2088af83fa7a0510a795c695721612c110e17'.toLowerCase(),
        '0xa817b9bd1ece360e4a1692894a5ad1d40b889f20'.toLowerCase(),
        '0xa97204eb6b0f3e58e8acff48a2317511e7628949'.toLowerCase(),
        '0xa978eadb605761725d11d3b3a4045cf5859e2d3c'.toLowerCase(),
        '0xaa1d3f5d45333e40467e989d472effac4da00da9'.toLowerCase(),
        '0xac772daaa5079e005eec3e53314d6d1e9149dc87'.toLowerCase(),
        '0xafc093b1c8419f05d4de6ff54d38121c0d733752'.toLowerCase(),
        '0xb08f95dbc639621dbaf48a472ae8fce0f6f56a6e'.toLowerCase(),
        '0xb099a3c3043b262518d9b6cd4d5c9f589b15e2ad'.toLowerCase(),
        '0xb1c11a879c47debc22e3816e7b727fc8bbe3c8ac'.toLowerCase(),
        '0xb26c452e8ac20ae7445fcf46b6478d3984f5d8e9'.toLowerCase(),
        '0xb3b16685ca2d2a764882e2bb2a8d3d769cd74145'.toLowerCase(),
        '0xb42ab92f5af0f162fffefa2b1e12702ce3fc9e17'.toLowerCase(),
        '0xb692704d590e224c67fa96830c4b2526fccaf3a3'.toLowerCase(),
        '0xb775df51776d6767f8c2f5a14b667e300f60447f'.toLowerCase(),
        '0xb8937891f08af9854a5ae7a5ec0cbaf4e68acd4c'.toLowerCase(),
        '0xb9ad9d091c6841e640dba4cab02baefaf1134cfd'.toLowerCase(),
        '0xbb0af8fb13473b81c2b6fe1503a0f70207231717'.toLowerCase(),
        '0xbbc6e7b905d7794a2318e22ec011bf36b09e1d2b'.toLowerCase(),
        '0xbc2ab46887142d546a976d56eb9a3d9da147ee65'.toLowerCase(),
        '0xbc9ca5bd0f07700929f8d538233b0a9e60f4ddc5'.toLowerCase(),
        '0xc02e6b0d0c1a5d8cd26beeba0fe8d76c5d2f19b9'.toLowerCase(),
        '0xc0ced4439c1f0871f16a46e13fbe41fbf61ba265'.toLowerCase(),
        '0xc13d5024c2ee14c5f80847afd09275f8b550a135'.toLowerCase(),
        '0xc29ded4c6ede7482068197c3e3205d850ffedb0f'.toLowerCase(),
        '0xc45920062985116eaac6589058ed337066d6f2e6'.toLowerCase(),
        '0xc522289168311a765cf17c067f0118578c99cf08'.toLowerCase(),
        '0xc7ea6791cc150a5326d55fdb47e31c16d8bcf17d'.toLowerCase(),
        '0xcaf3365d474690a1ac6643d3d6ef44cb0c6deec4'.toLowerCase(),
        '0xcbb49b18f2e9d002bd79fc1495fcb6f6f87f1e0a'.toLowerCase(),
        '0xcd69150ece65cf880eaa7b91ca6fbb7d38e97cc3'.toLowerCase(),
        '0xd193a7d7b231c204b76b9d638768ea602de515f6'.toLowerCase(),
        '0xd1f6e5592361257aef68b96df42aef064080c5cc'.toLowerCase(),
        '0xd2ce17b0566df31f8020700fbda6521d28d98c22'.toLowerCase(),
        '0xd2f2a56affb67a9ae2499ab9df1689ee78fad89a'.toLowerCase(),
        '0xd60d11cdea2735b3fe0ce990d37722666df044eb'.toLowerCase(),
        '0xd7192081e5f481364c190022f0012a729fba37a5'.toLowerCase(),
        '0xd74e767c77d2e9f9e467e7914f2379da81b63a44'.toLowerCase(),
        '0xda23ab0b2636c3f9806a868278d73aef2439ab60'.toLowerCase(),
        '0xda512cd98dd54056003f11ac3adaecef9850f8e3'.toLowerCase(),
        '0xdde27b3ba448e15357183060ae006bb54ebb3d86'.toLowerCase(),
        '0xdded73b0bbdb3782a453c9202f54c746fd391068'.toLowerCase(),
        '0xde59d4fbd48fae4b3c20817981baae47f360f4c6'.toLowerCase(),
        '0xdf3d58d2cc8a4f9e9e3003f87571094ed7671589'.toLowerCase(),
        '0xe22059d454c705f70ffe2a5706844a3a27a2bec8'.toLowerCase(),
        '0xe25b24cebed3055236e369570a437a99e1d32602'.toLowerCase(),
        '0xe2d22dc1c2f7c58f86606e405325c69f5210a6a7'.toLowerCase(),
        '0xe7de1e998ee34918cabab534282803fce02e3f40'.toLowerCase(),
        '0xe7f684f218aee4ea23d13304646e90d605ee0962'.toLowerCase(),
        '0xeac5f9b3cd48123a69fe69ce93a7f58100a56552'.toLowerCase(),
        '0xf1f476f144df01480297dca47efca565e8b0c9f1'.toLowerCase(),
        '0xf28fc8d0eb98a34f2b03d384f7db6f1e7b877a33'.toLowerCase(),
        '0xf2cce62603ac08d3fe92bc97bd68f137b7f1b765'.toLowerCase(),
        '0xf2e1ad6c4e221759a90fb853c69cd7065f413b38'.toLowerCase(),
        '0xf36796fc4f8fee589ff959264c9e99ca37a1b659'.toLowerCase(),
        '0xf84408070b4de16d6bb0ab2fd8b19d37e3fd1422'.toLowerCase(),
        '0xfa69519696e9d4abdf7d054c3ba44d32fe350ead'.toLowerCase(),
        '0xfbb7c9966ca3eea503a3e159d9ec233285fc158a'.toLowerCase(),
        '0xfc0c476530d9742cb116027c04559d0dc26bbd12'.toLowerCase(),
        '0xfd17019d6a7ddc7ad585afa68dbef71084162601'.toLowerCase(),
        '0xfd849d8cf365fe98bc60025ff7fab45cef0f557b'.toLowerCase(),
        '0xfe7ace0f186a54c0be46f992dd3072e0053a1010'.toLowerCase(),
        '0xfed74f78700bb468e824b6bfe4a2ed305a9d86ba'.toLowerCase(),
        '0xff3bc8de74bb1d2f9066c9687f62bf810c66c5ea'.toLowerCase(),
        '0xfff39900273ffb1045c7cfde62df1720b63fd6bd'.toLowerCase(),
      ];

      const results = Object.keys(
        state.phases['64cd238b62e03f8dd562e03b'].components[
          '64cd23b4339af0b9f4eec45d'
        ].winners,
      ).map((winner) => winner.toLowerCase());
      let resultsMissing = 0;
      let resultExample = '';
      for (const t of targetResults) {
        if (!results.includes(t)) {
          resultsMissing++;
          resultExample = t;
        }
      }
      let targetResultsMissing = 0;
      let targetResultExample = '';
      for (const r of results) {
        if (!targetResults.includes(r)) {
          targetResultsMissing++;
          targetResultExample = r;
        }
      }
      console.log({
        resultsMissing,
        resultExample,
        targetResultsMissing,
        targetResultExample,
      });
    },
    60 * 60 * 1000,
  );

  it.skip(
    'should create allowlist',
    async () => {
      const contract = '0x495f947276749ce646f68ac8c248420045cb7b5e';
      const finishBlock = 17720173;
      let targetBlock = 16822230;
      const baseUrl = 'https://allowlist-api.staging.seize.io';
      // c060ce6d-3a7f-4d94-aa11-4ef9088155d3

      while (targetBlock < finishBlock) {
        const startingTime = new Date().getTime();
        const allowlist = await axios.post(`${baseUrl}/allowlists`, {
          name: 'MEME CARD 95 DISTRIBUTION',
          description: 'Allowlist for meme card 95 distribution',
        });
        const allowlistId = allowlist.data.id;
        console.log({ allowlistId, targetBlock, startingTime });
        await axios.post(`${baseUrl}/allowlists/${allowlistId}/operations`, {
          code: AllowlistOperationCode.GET_COLLECTION_TRANSFERS,
          params: {
            id: 'transfer-pool-1',
            name: 'random name',
            description: 'random description',
            contract,
            blockNo: targetBlock,
          },
        });
        await axios.post(`${baseUrl}/allowlists/${allowlistId}/runs`, {});
        let runCompleted = false;
        while (!runCompleted) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const response = await axios.get(
            `${baseUrl}/allowlists/${allowlistId}`,
          );
          const activeRun = response.data.activeRun;
          console.log({
            activeRun,
            allowlistId,
            targetBlock,
            timeDiff: Math.floor((new Date().getTime() - startingTime) / 1000),
          });
          if (activeRun?.status === 'COMPLETED') {
            runCompleted = true;
          }
        }
        await axios.delete(`${baseUrl}/allowlists/${allowlistId}`);
        targetBlock += 100000;
        await new Promise((resolve) => setTimeout(resolve, 240000));
      }
    },
    60 * 60 * 10000,
  );

  it.skip('should create allowlist', async () => {
    const ops = [
      {
        code: AllowlistOperationCode.CREATE_ALLOWLIST,
        params: {
          id: '372b93d3-9ecd-4dbc-8b59-04cab7d8d537',
          name: '372b93d3-9ecd-4dbc-8b59-04cab7d8d537',
          description: '372b93d3-9ecd-4dbc-8b59-04cab7d8d537',
        },
      },
      {
        code: AllowlistOperationCode.CREATE_TOKEN_POOL,
        params: {
          id: '6de28e1b-2a5a-45fe-ba2c-2cd84a637dee',
          name: '6de28e1b-2a5a-45fe-ba2c-2cd84a637dee',
          description: '6de28e1b-2a5a-45fe-ba2c-2cd84a637dee',
          contract: '0x0c58ef43ff3032005e472cb5709f8908acb00205',
          tokenIds: null,
          blockNo: 17862438,
          consolidateBlockNo: null,
        },
      },
    ];
    const state = await allowlistCreator.execute(ops);
    console.log(state.tokenPools);
  });
});
