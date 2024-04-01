import { AllowlistCreator } from '../src/allowlist/allowlist-creator';
import { AllowlistOperation } from '../src/allowlist/allowlist-operation';
import { AllowlistOperationCode } from '../src/allowlist/allowlist-operation-code';
import axios from 'axios';
import * as fs from 'fs';

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

  it.skip(
    'runs',
    async () => {
      const ops1 = [
        {
          code: 'CREATE_ALLOWLIST',
          params: {
            id: '5451e142-6f6b-472e-85d3-4b5e7c0ac1e7',
            name: 'card212',
            description: 'card212 allowlists',
          },
        },
        {
          code: 'CREATE_TOKEN_POOL',
          params: {
            id: '65f40955b307fa57f0631ca1',
            name: 'The Memes by 6529 SZN5 SZN6',
            description: 'The Memes by 6529 SZN5 SZN6',
            contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
            blockNo: 19431469,
            consolidateBlockNo: 19439206,
            tokenIds: '152-180,181-211',
          },
        },
        {
          code: 'CREATE_TOKEN_POOL',
          params: {
            id: '65f4097795f37befb532673f',
            name: 'The Memes by 6529 SZN1 SZN2 SZN3 SZN4 SZN5 SZN6',
            description: 'The Memes by 6529 SZN1 SZN2 SZN3 SZN4 SZN5 SZN6',
            contract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
            blockNo: 19431469,
            consolidateBlockNo: 19439206,
            tokenIds: '1-47,48-86,87-118,119-151,152-180,181-211',
          },
        },
        {
          code: 'CREATE_TOKEN_POOL',
          params: {
            id: '65f4097a8efb02e718aebaa5',
            name: '6529 Gradient',
            description: '6529 Gradient',
            contract: '0x0c58ef43ff3032005e472cb5709f8908acb00205',
            blockNo: 19431469,
            consolidateBlockNo: 19439206,
          },
        },
        {
          code: 'CREATE_CUSTOM_TOKEN_POOL',
          params: {
            id: '65f40bba8bf53fefe6b83bcd',
            name: 'Artist Collectors',
            description: 'Artist Collectors',
            tokens: [
              { owner: '0x00ff192363430a35abbf968c535b64147e88abdb' },
              { owner: '0x01d71a1e369cd675a1215b9f1bd63b582f6f257a' },
              { owner: '0x0518be2e60bd3f0da9402b02194957018865cebd' },
              { owner: '0x052564eb0fd8b340803df55def89c25c432f43f4' },
              { owner: '0x09b5859c61472225eea395b1aa31e2cd976d34a3' },
              { owner: '0x0d9d376e582b82b71122814756c103cadd5a59c1' },
              { owner: '0x0f0eae91990140c560d4156db4f00c854dc8f09e' },
              { owner: '0x11a51b3af70afae1b52cf51cb38cade20c1203dc' },
              { owner: '0x146d745139d417b8b5a1190cc73b34d7d37a9bba' },
              { owner: '0x1619f7076866ddc852a5a0a69cbb4d6a338d6d67' },
              { owner: '0x17bb4076ab59e0ef20ad5a873ab4b5341bf01b78' },
              { owner: '0x1d10b0166a761f269adf864ebdaca9be445ca637' },
              { owner: '0x1d130d29b3906555030452f0f29cdb0b9750fd21' },
              { owner: '0x1f6db2c51185429a1b166321d8ae164a4c189b49' },
              { owner: '0x205a46012bc3c1a2583fdd426679dff276fb257e' },
              { owner: '0x22bd04906e808196b19f7d10463fe463ed5f88cb' },
              { owner: '0x23602ca06e977c86339ffddad74966e824ab691e' },
              { owner: '0x23fed2634fdc629c1a82eb6ed3391efad2a58670' },
              { owner: '0x242d0b281fd6a85b13e2035ef87d3efeb1874512' },
              { owner: '0x279775d31fbbfa8e589631ef49c6b3d0913803e1' },
              { owner: '0x27fb0a35ac158fe460b91b04e5087b0131352ed9' },
              { owner: '0x287bdf8c332d44bb015f8b4deb6513010c951f39' },
              { owner: '0x28cf5d9d465dfaf5c616958ef8b23dbee567e2b7' },
              { owner: '0x28d4aba03b5bc52a9239ee09fc8f7edf6c844c21' },
              { owner: '0x2dfe6174eb339036000717fe86f1450f0e43a606' },
              { owner: '0x2e0a86c23066134b7ba0079f0419d00852048df1' },
              { owner: '0x2f44fb58135ae5d3793803c73d471c7cde4bb774' },
              { owner: '0x32084ce62e8955da04ce2a2969bd6edbb4b346a5' },
              { owner: '0x335e19b3f5dcfa2e398ee7d5ff430a1f8ccc88b2' },
              { owner: '0x337101def3eeb6f06e071efe02216274507937bb' },
              { owner: '0x33d7a3ad5b4168f30c051ee66afd3c2a865ed919' },
              { owner: '0x3595a1508cb1180e8e7f50008db1109f5293efc5' },
              { owner: '0x367c597f1e91045607389ab4d6415bb7a7bd69ef' },
              { owner: '0x3852471d266d9e2222ca9fdd922bafc904dc49e5' },
              { owner: '0x38e23cea342deea0744a4f68780053f347b8bfa6' },
              { owner: '0x3a661a18cb0258119636dfdde098648c6ad5ba62' },
              { owner: '0x3d6b9ee137844e278d1ddbded29e57154f492349' },
              { owner: '0x42ec9ab7db1ad0b3a0c77bbe77c436c58db8eb7e' },
              { owner: '0x431060e2da89e839a5be02cee86fc1f2d03edd2e' },
              { owner: '0x47865cbb78ac8b25b2619efe17b822a357945ddf' },
              { owner: '0x528eeb05a93a22a9cb1f9e507af991e264b9cf3b' },
              { owner: '0x5622cc24ddecf5888d31df4b8b12648d105472bc' },
              { owner: '0x568a2e5713458a263da2b86cae2f6af0693799fd' },
              { owner: '0x576a655161b5502dcf40602be1f3519a89b71658' },
              { owner: '0x5849734d2e3ada23b64e12311adfa6bcd6fe687c' },
              { owner: '0x5b513d7bb62f7f28bc3aba2d52fe6167a9b3a827' },
              { owner: '0x5e93ab46e9a0b39312b5e112d4b053a768203f9f' },
              { owner: '0x6112083d4bb12dbf64e4850842685aaefbeacb10' },
              { owner: '0x6186290b28d511bff971631c916244a9fc539cfe' },
              { owner: '0x618c7671366caaab6701f06ae9925ae682c6bf97' },
              { owner: '0x61b04d2b5cb1f1f8505e7b4e1cb3d9e8a0b15bae' },
              { owner: '0x6493182cc538c8b4d60174bde8aaa6861f862b10' },
              { owner: '0x6ce52498047b8279ccc7c25b41c95cd482525e54' },
              { owner: '0x6d9dd2b0fbf6e7d800f31c55f0f2f9089dfb7dc2' },
              { owner: '0x6e7d6b505deb2c67fb64ece9995a26b8ad70678f' },
              { owner: '0x707bfeed11b63d3360de40313f01092aa9b365c1' },
              { owner: '0x7143f19d9df476227013260f015b06359918ef3f' },
              { owner: '0x7290bf7488af285e5ae095dbc5234dd2eac9b61b' },
              { owner: '0x74abf717f4f069c0aaa2074fa1f80e35466079b3' },
              { owner: '0x7535da202d79ca57299918c60c218f9b779aa14c' },
              { owner: '0x75a56cd64e10c4f07a6d2cb9027580b7b9a728db' },
              { owner: '0x75aadbb7c36db057e5ac64183899f118de76df35' },
              { owner: '0x77037050bb27ae8f09118a0c480224d897589c65' },
              { owner: '0x7a204ae5b7e4458f87c9ec5056953caf3f9aece9' },
              { owner: '0x7a4709062134e62de720850cb941e9b006cc058e' },
              { owner: '0x7c4731f32a2bc67dc03e14b813982f49a3867d6f' },
              { owner: '0x7ce30498e564f081ca65a226f44b1751f93a0f82' },
              { owner: '0x7ed9cf5dbf2f68bd33ea2c95ef2b4634976ba7f8' },
              { owner: '0x7f14a8d51a8df9a2d4c2965f4a336a1d0c173216' },
              { owner: '0x7fc55376d5a29e0ee86c18c81bb2fc8f9f490e50' },
              { owner: '0x827c622c85c9970b4902918bc5b843e0aa291489' },
              { owner: '0x838c764421bc013cf61c3c281d5d4acc6d77544d' },
              { owner: '0x8560cbe177a4b28320e22012df9c908aabe24dcf' },
              { owner: '0x86286d93d79a9e5b78de97cbbc8dcaba0f2489fc' },
              { owner: '0x877966054785c393ef68b2c4bc45d5676915c7e2' },
              { owner: '0x88668b63218bcfd31692e14f635d195f9f45c030' },
              { owner: '0x8e45de3ad0f4ffa634e2d84d4995450cdb6b49f9' },
              { owner: '0x900c0c2fd84f7385ae36421499c7b3e99c8e058a' },
              { owner: '0x91215d71a00b0907ca67b25401172ab18d4b18f9' },
              { owner: '0x938ca546225b55f2db2ff251e7a71ddc530f6fcb' },
              { owner: '0x957a965e386aa1b66b61924d75ce64642b643b4e' },
              { owner: '0x9c51532ef51ab720514b5acaf97fe6c600fbfb54' },
              { owner: '0xa067705a0b8482162c3244e660c77ac48e8c1fa1' },
              { owner: '0xa29528463c8241c1b7fe5343e93f57cac2ecb9f5' },
              { owner: '0xa78b54a5486ce07838c1511c5ad5f72df2ac833a' },
              { owner: '0xab6ca2017548a170699890214bfd66583a0c1754' },
              { owner: '0xab80cd468c733735d407374579b47cf30ca356b3' },
              { owner: '0xabb3738f04dc2ec20f4ae4462c3d069d02ae045b' },
              { owner: '0xace1c6f4dab142925a3d628c0fa5440c4dedd815' },
              { owner: '0xb05b7ea3714a95857e45629def2b9c3577690208' },
              { owner: '0xb0bdd53b627d7e61cfc5c13ef110e47e210fac6f' },
              { owner: '0xb2892b27eb4fcfd6169e8e5f6bb88c1456b4f994' },
              { owner: '0xb3007ff3c3f40bdf0126fec7c8e43c3fc50ea813' },
              { owner: '0xb43461f2b60f63de07d80eb1a667a9b84802e8cc' },
              { owner: '0xbaea3cf94abd0d6e0f029ef5b0e54e9424a72985' },
              { owner: '0xbc0398a920ae62e01f486f9fbee90ffeb46ad7a6' },
              { owner: '0xbd72d021d3cb334deb3151db905ee073b8eee518' },
              { owner: '0xbddb878b393bf91f8d34b2edf7087ca529e3ccaf' },
              { owner: '0xbdde100544020fc3dd072bf4ce9a62845e6c9884' },
              { owner: '0xbddf499207d29e920c0500642567b43238b30fd3' },
              { owner: '0xbfacde4341f32b5f77ad81831e128ede4b5e6073' },
              { owner: '0xc31da5c844177b716ecc3f78fb8b08098c222452' },
              { owner: '0xc550716af5cfe7e6315e6d8b94d2154448b2444a' },
              { owner: '0xc5aca861be2856d25821f3ef0317950c369044fa' },
              { owner: '0xc68c7771ec6a6e5d67d62aa9c6f22df69865e401' },
              { owner: '0xc7ec028c706ec2fcfdcf66bba7e80ded634f6ca9' },
              { owner: '0xc927105490efaea1248f27e280e2296b525be157' },
              { owner: '0xca3872b1f2203c4b488955f6d8fc28c35315b507' },
              { owner: '0xca9ba6a0974ba3a09c8fee76dfdd87ba1d6a2801' },
              { owner: '0xcf3b555729822b93ab8f05c9124b10243cd3748f' },
              { owner: '0xd821e6d6d96ecf3aed987bbaf259c761b0cd28b6' },
              { owner: '0xd849843971653d1d3c8d40864ab4f16080fdcbf4' },
              { owner: '0xd8d3ccbac5df46b67aa8f3cc84a68ddc8c784b40' },
              { owner: '0xd94da55433369cb75283ab5deac0158b6b7e2ca9' },
              { owner: '0xdcd87f8c295c5cdd1dda66f11ed1a01c42a5f1a3' },
              { owner: '0xdf067d1c62b6a94e45ced3f01ebc94ae304cb045' },
              { owner: '0xe01a97fc4607a388a41626d5e039fdecbfc6acd9' },
              { owner: '0xe288a00df4b697606078876788e4d64633cd2e01' },
              { owner: '0xe2bb39f857195fbd8bd0c4833a4fa28496083b29' },
              { owner: '0xe4c6c46645988bbafd8ef6b4d1b60d969cc857c3' },
              { owner: '0xe55a329415a518e3f743cbb850f2dbc694fe4bc0' },
              { owner: '0xe6d6758d2fc0a7a0c476794855d035f3bcba245f' },
              { owner: '0xe70c7cda0ee51c20c4ea4bbc34c85f5f8d404ad9' },
              { owner: '0xe8dbd6474fb0128863f5d3204af5ef363d90adb0' },
              { owner: '0xe96b4cc1dc97dbca6690c8eb0434181466d680e7' },
              { owner: '0xeab3739d4e716bb07901d72dc94b4139b6968623' },
              { owner: '0xed3d7456997d9af7d284230b5017b35d140da798' },
              { owner: '0xed8982578836f7d498856b3f543f128bb8621f2a' },
              { owner: '0xeebd455c141750d4ebf27d66be57dd3c7aa3e554' },
              { owner: '0xf2c5f1fd977dbd6de9d04bc4e62dff722d4bb1a1' },
              { owner: '0xf5671d951c0aa6e4bd69a854fc2d15fe707ddd0e' },
              { owner: '0xf74aa398050f15c7c58750ce71cf0be5440ba47a' },
              { owner: '0xf7764568b698e5954892c00ed7d9a390b105c5f7' },
              { owner: '0xf8e90d2d2f6f67a13d0a04374e22624a80a1e918' },
              { owner: '0xf987a65115b267bc9a16f0eb52b7f7e94e554cbb' },
              { owner: '0xf997a1a60cf8a65185a938647bd22c6158463195' },
              { owner: '0xfad0a4097d64e5950f04f4e96d5609a96eb6ac9f' },
              { owner: '0xfb3df26810b5f41172731ee406c2ad577d5c8a5a' },
              { owner: '0xfdd9a3e4c07756c1dc31ba938fc062d45eab1668' },
              { owner: '0xfe10952f8af7c2c7c719988f7444dfcccba87d50' },
            ],
          },
        },
        {
          code: 'CREATE_CUSTOM_TOKEN_POOL',
          params: {
            id: '65f40bc48f878d504696f2de',
            name: 'RAW and 1 of 1s',
            description: 'RAW and 1 of 1s',
            tokens: [
              { owner: '0x2c8875f34ceb219f61b7453b2c5f100ec2f6ed33' },
              { owner: '0x89ef05c30c821c49b67d06e630686c5c3232baab' },
              { owner: '0x9274f2f89fbe5dc00c21c628e46a18c7187c14d7' },
              { owner: '0xd3e401814d1faa8ca0419ecccbfee93ac7b15b31' },
            ],
          },
        },
        {
          code: 'CREATE_CUSTOM_TOKEN_POOL',
          params: {
            id: '65f40bce66fab597966a81b5',
            name: 'Team Funds Museum',
            description: 'Team Funds Museum',
            tokens: [
              { owner: '0xfd22004806a6846ea67ad883356be810f0428793' },
              { owner: '0x3d885cb987c00fe980c20e76e21c53313f43946a' },
              { owner: '0xc3c9737cce778d7583f31ae7c4f2ab8782ed51e5' },
              { owner: '0xa62da2ea9f5bb03a58174060535ae32131973178' },
              { owner: '0xe16df6503acd3c79b6e032f62c61752bec16eef2' },
              { owner: '0x9769334fc882775f4951865aa473481880669d47' },
              { owner: '0x3852471d266d9e2222ca9fdd922bafc904dc49e5' },
              { owner: '0x88d3574660711e03196af8a96f268697590000fa' },
              { owner: '0x885846850aabf20d8f8e051f400354d94a32ff55' },
              { owner: '0x61d9d9cc8c3203dab7100ea79ced77587201c990' },
              { owner: '0x7ba3e8f17582462676c44dd143388ed4b6b20655' },
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
              { owner: '0x1ac8858e29cbe5c8d6b60ec4d3242ed0f81bfe9f' },
              { owner: '0x8ba68cfe71550efc8988d81d040473709b7f9218' },
              { owner: '0xa743c8c57c425b84cb2ed18c6b9ae3ad21629cb5' },
              { owner: '0x1b7844cfae4c823ac6389855d47106a70c84f067' },
              { owner: '0x76d078d7e5755b66ff50166863329d27f2566b43' },
              { owner: '0xc6400a5584db71e41b0e5dfbdc769b54b91256cd' },
            ],
          },
        },
        {
          code: 'ADD_PHASE',
          params: {
            id: '65f40bd5b73e0e42a2c5b564',
            name: 'Phase 0',
            description: 'Phase 0',
          },
        },
        {
          code: 'ADD_PHASE',
          params: {
            id: '65f40bd893f2ca6b8fd7a458',
            name: 'Phase 1',
            description: 'Phase 1',
          },
        },
        {
          code: 'ADD_PHASE',
          params: {
            id: '65f40cb63fbf55d955bbe500',
            name: 'Phase 2',
            description: 'Phase 2',
          },
        },
        {
          code: 'ADD_COMPONENT',
          params: {
            id: '65f40d2359d398c180192dc5',
            phaseId: '65f40bd5b73e0e42a2c5b564',
            name: 'Phase 0 - Top 200 SZN5+SZN6',
            description: 'Top 200 SZN5+SZN6 Memes collectors (ranked by TDH)',
          },
        },
        {
          code: 'ADD_ITEM',
          params: {
            id: '65f40d230c1405356a33a4a4',
            name: 'Phase 0 - Top 200 SZN5+SZN6',
            description: 'Phase 0 - Top 200 SZN5+SZN6',
            componentId: '65f40d2359d398c180192dc5',
            poolId: '65f40955b307fa57f0631ca1',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: 'ITEM_REMOVE_WALLETS_FROM_CERTAIN_TOKEN_POOLS',
          params: {
            itemId: '65f40d230c1405356a33a4a4',
            pools: [
              {
                poolType: 'CUSTOM_TOKEN_POOL',
                poolId: '65f40bce66fab597966a81b5',
              },
            ],
          },
        },
        {
          code: 'ITEM_SORT_WALLETS_BY_MEMES_TDH',
          params: {
            itemId: '65f40d230c1405356a33a4a4',
            tdhBlockNumber: 19431469,
          },
        },
        {
          code: 'ITEM_SELECT_FIRST_N_WALLETS',
          params: { itemId: '65f40d230c1405356a33a4a4', count: 200 },
        },
        {
          code: 'COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS',
          params: { componentId: '65f40d2359d398c180192dc5', spots: 1 },
        },
        {
          code: 'ADD_COMPONENT',
          params: {
            id: '65f40dca9636f2caa1de2603',
            phaseId: '65f40bd5b73e0e42a2c5b564',
            name: 'Phase 0 - 20 random out of 100 Global TDH',
            description: '20 random out of 100 Global TDH Memes collectors',
          },
        },
        {
          code: 'ADD_ITEM',
          params: {
            id: '65f40dca6476a63bf915c886',
            name: 'Phase 0 - 20 random out of 100 Global TDH',
            description: 'Phase 0 - 20 random out of 100 Global TDH',
            componentId: '65f40dca9636f2caa1de2603',
            poolId: '65f4097795f37befb532673f',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: 'ITEM_REMOVE_WALLETS_FROM_CERTAIN_TOKEN_POOLS',
          params: {
            itemId: '65f40dca6476a63bf915c886',
            pools: [
              {
                poolType: 'CUSTOM_TOKEN_POOL',
                poolId: '65f40bce66fab597966a81b5',
              },
            ],
          },
        },
        {
          code: 'ITEM_REMOVE_WALLETS_FROM_CERTAIN_COMPONENTS',
          params: {
            itemId: '65f40dca6476a63bf915c886',
            componentIds: ['65f40d2359d398c180192dc5'],
          },
        },
        {
          code: 'ITEM_SORT_WALLETS_BY_MEMES_TDH',
          params: {
            itemId: '65f40dca6476a63bf915c886',
            tdhBlockNumber: 19431469,
          },
        },
        {
          code: 'ITEM_SELECT_FIRST_N_WALLETS',
          params: { itemId: '65f40dca6476a63bf915c886', count: 100 },
        },
        {
          code: 'COMPONENT_SELECT_RANDOM_WALLETS',
          params: {
            componentId: '65f40dca9636f2caa1de2603',
            seed: '0x09f3264bfb16358e91abdf305761be59dafd893c39f4ce6fed2ab45ac7826e9a',
            weightType: 'TOTAL_CARDS',
            count: 20,
          },
        },
        {
          code: 'COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS',
          params: { componentId: '65f40dca9636f2caa1de2603', spots: 1 },
        },
        {
          code: 'ADD_COMPONENT',
          params: {
            id: '65f40e42e443ebccd9dcba91',
            phaseId: '65f40bd893f2ca6b8fd7a458',
            name: 'Phase 1 - All Rebecca Rose collectors',
            description: 'All Rebecca Rose collectors',
          },
        },
        {
          code: 'ADD_ITEM',
          params: {
            id: '65f40e42f6f5435b95f3f542',
            name: 'Phase 1 - All Rebecca Rose collectors',
            description: 'Phase 1 - All Rebecca Rose collectors',
            componentId: '65f40e42e443ebccd9dcba91',
            poolId: '65f40bba8bf53fefe6b83bcd',
            poolType: 'CUSTOM_TOKEN_POOL',
          },
        },
        {
          code: 'ITEM_REMOVE_WALLETS_FROM_CERTAIN_TOKEN_POOLS',
          params: {
            itemId: '65f40e42f6f5435b95f3f542',
            pools: [
              {
                poolType: 'CUSTOM_TOKEN_POOL',
                poolId: '65f40bce66fab597966a81b5',
              },
            ],
          },
        },
        {
          code: 'ITEM_REMOVE_WALLETS_FROM_CERTAIN_COMPONENTS',
          params: {
            itemId: '65f40e42f6f5435b95f3f542',
            componentIds: [
              '65f40d2359d398c180192dc5',
              '65f40dca9636f2caa1de2603',
            ],
          },
        },
        {
          code: 'COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS',
          params: { componentId: '65f40e42e443ebccd9dcba91', spots: 1 },
        },
        {
          code: 'ADD_COMPONENT',
          params: {
            id: '65f40f4fb30704afdfcb5fad',
            phaseId: '65f40bd893f2ca6b8fd7a458',
            name: 'Phase 1 - All Gradient collectors',
            description: 'All Gradient collectors',
          },
        },
        {
          code: 'ADD_ITEM',
          params: {
            id: '65f40f4f78b6dc8fe7de0268',
            name: 'Phase 1 - All Gradient collectors',
            description: 'Phase 1 - All Gradient collectors',
            componentId: '65f40f4fb30704afdfcb5fad',
            poolId: '65f4097a8efb02e718aebaa5',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: 'ITEM_REMOVE_WALLETS_FROM_CERTAIN_TOKEN_POOLS',
          params: {
            itemId: '65f40f4f78b6dc8fe7de0268',
            pools: [
              {
                poolType: 'CUSTOM_TOKEN_POOL',
                poolId: '65f40bce66fab597966a81b5',
              },
            ],
          },
        },
        {
          code: 'ITEM_REMOVE_WALLETS_FROM_CERTAIN_COMPONENTS',
          params: {
            itemId: '65f40f4f78b6dc8fe7de0268',
            componentIds: [
              '65f40d2359d398c180192dc5',
              '65f40dca9636f2caa1de2603',
              '65f40e42e443ebccd9dcba91',
            ],
          },
        },
        {
          code: 'COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS',
          params: { componentId: '65f40f4fb30704afdfcb5fad', spots: 1 },
        },
        {
          code: 'ADD_COMPONENT',
          params: {
            id: '65f40fd5f85792e519113a2e',
            phaseId: '65f40bd893f2ca6b8fd7a458',
            name: 'Phase 1 - All 6529 RAW and 1/1s collectors',
            description: 'All 6529 RAW and 1/1s collectors',
          },
        },
        {
          code: 'ADD_ITEM',
          params: {
            id: '65f40fd53451f7361d6743a0',
            name: 'Phase 1 - All 6529 RAW and 1/1s collectors',
            description: 'Phase 1 - All 6529 RAW and 1/1s collectors',
            componentId: '65f40fd5f85792e519113a2e',
            poolId: '65f40bc48f878d504696f2de',
            poolType: 'CUSTOM_TOKEN_POOL',
          },
        },
        {
          code: 'ITEM_REMOVE_WALLETS_FROM_CERTAIN_TOKEN_POOLS',
          params: {
            itemId: '65f40fd53451f7361d6743a0',
            pools: [
              {
                poolType: 'CUSTOM_TOKEN_POOL',
                poolId: '65f40bce66fab597966a81b5',
              },
            ],
          },
        },
        {
          code: 'ITEM_REMOVE_WALLETS_FROM_CERTAIN_COMPONENTS',
          params: {
            itemId: '65f40fd53451f7361d6743a0',
            componentIds: [
              '65f40d2359d398c180192dc5',
              '65f40dca9636f2caa1de2603',
              '65f40e42e443ebccd9dcba91',
              '65f40f4fb30704afdfcb5fad',
            ],
          },
        },
        {
          code: 'COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS',
          params: { componentId: '65f40fd5f85792e519113a2e', spots: 1 },
        },
        {
          code: 'ADD_COMPONENT',
          params: {
            id: '65f41c07464b1eb315b3da6c',
            phaseId: '65f40bd893f2ca6b8fd7a458',
            name: 'Phase 1 - Next Top 267 SZN5+SZN6',
            description:
              'Next Top 267 SZN5+SZN6 Memes collectors (ranked by TDH)',
          },
        },
        {
          code: 'ADD_ITEM',
          params: {
            id: '65f41c078c1685ba88a0565b',
            name: 'Phase 1 - Next Top 267 SZN5+SZN6',
            description: 'Phase 1 - Next Top 267 SZN5+SZN6',
            componentId: '65f41c07464b1eb315b3da6c',
            poolId: '65f40955b307fa57f0631ca1',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: 'ITEM_REMOVE_WALLETS_FROM_CERTAIN_TOKEN_POOLS',
          params: {
            itemId: '65f41c078c1685ba88a0565b',
            pools: [
              {
                poolType: 'CUSTOM_TOKEN_POOL',
                poolId: '65f40bce66fab597966a81b5',
              },
            ],
          },
        },
        {
          code: 'ITEM_REMOVE_WALLETS_FROM_CERTAIN_COMPONENTS',
          params: {
            itemId: '65f41c078c1685ba88a0565b',
            componentIds: [
              '65f40d2359d398c180192dc5',
              '65f40dca9636f2caa1de2603',
              '65f40e42e443ebccd9dcba91',
              '65f40f4fb30704afdfcb5fad',
              '65f40fd5f85792e519113a2e',
            ],
          },
        },
        {
          code: 'ITEM_SORT_WALLETS_BY_MEMES_TDH',
          params: {
            itemId: '65f41c078c1685ba88a0565b',
            tdhBlockNumber: 19431469,
          },
        },
        {
          code: 'ITEM_SELECT_FIRST_N_WALLETS',
          params: { itemId: '65f41c078c1685ba88a0565b', count: 267 },
        },
        {
          code: 'COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS',
          params: { componentId: '65f41c07464b1eb315b3da6c', spots: 1 },
        },
        {
          code: 'ADD_COMPONENT',
          params: {
            id: '65f41cc4a14c712696e81062',
            phaseId: '65f40bd893f2ca6b8fd7a458',
            name: 'Phase 1 - Top 220 All SZNs',
            description: 'Top 220 All SZNs Memes collectors (ranked by TDH)',
          },
        },
        {
          code: 'ADD_ITEM',
          params: {
            id: '65f41cc426a1337fe050d356',
            name: 'Phase 1 - Top 220 All SZNs',
            description: 'Phase 1 - Top 220 All SZNs',
            componentId: '65f41cc4a14c712696e81062',
            poolId: '65f4097795f37befb532673f',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: 'ITEM_REMOVE_WALLETS_FROM_CERTAIN_TOKEN_POOLS',
          params: {
            itemId: '65f41cc426a1337fe050d356',
            pools: [
              {
                poolType: 'CUSTOM_TOKEN_POOL',
                poolId: '65f40bce66fab597966a81b5',
              },
            ],
          },
        },
        {
          code: 'ITEM_REMOVE_WALLETS_FROM_CERTAIN_COMPONENTS',
          params: {
            itemId: '65f41cc426a1337fe050d356',
            componentIds: [
              '65f40d2359d398c180192dc5',
              '65f40dca9636f2caa1de2603',
              '65f40e42e443ebccd9dcba91',
              '65f40f4fb30704afdfcb5fad',
              '65f40fd5f85792e519113a2e',
              '65f41c07464b1eb315b3da6c',
            ],
          },
        },
        {
          code: 'ITEM_SORT_WALLETS_BY_MEMES_TDH',
          params: {
            itemId: '65f41cc426a1337fe050d356',
            tdhBlockNumber: 19431469,
          },
        },
        {
          code: 'ITEM_SELECT_FIRST_N_WALLETS',
          params: { itemId: '65f41cc426a1337fe050d356', count: 220 },
        },
        {
          code: 'COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS',
          params: { componentId: '65f41cc4a14c712696e81062', spots: 1 },
        },
        {
          code: 'ADD_COMPONENT',
          params: {
            id: '65f41d947ac146b7b92be159',
            phaseId: '65f40cb63fbf55d955bbe500',
            name: 'Phase 2 - All Memes Collectors',
            description: 'All Memes Collectors',
          },
        },
        {
          code: 'ADD_ITEM',
          params: {
            id: '65f41d946270c90ce2e578f3',
            name: 'Phase 2 - All Memes Collectors',
            description: 'Phase 2 - All Memes Collectors',
            componentId: '65f41d947ac146b7b92be159',
            poolId: '65f4097795f37befb532673f',
            poolType: 'TOKEN_POOL',
          },
        },
        {
          code: 'ITEM_REMOVE_WALLETS_FROM_CERTAIN_TOKEN_POOLS',
          params: {
            itemId: '65f41d946270c90ce2e578f3',
            pools: [
              {
                poolType: 'CUSTOM_TOKEN_POOL',
                poolId: '65f40bce66fab597966a81b5',
              },
            ],
          },
        },
        {
          code: 'ITEM_REMOVE_WALLETS_FROM_CERTAIN_COMPONENTS',
          params: {
            itemId: '65f41d946270c90ce2e578f3',
            componentIds: [
              '65f40d2359d398c180192dc5',
              '65f40dca9636f2caa1de2603',
              '65f40e42e443ebccd9dcba91',
              '65f40f4fb30704afdfcb5fad',
              '65f40fd5f85792e519113a2e',
              '65f41c07464b1eb315b3da6c',
              '65f41cc4a14c712696e81062',
            ],
          },
        },
        {
          code: 'COMPONENT_ADD_SPOTS_TO_ALL_ITEM_WALLETS',
          params: { componentId: '65f41d947ac146b7b92be159', spots: 1 },
        },
        {
          code: 'MAP_RESULTS_TO_DELEGATED_WALLETS',
          params: {
            delegationContract: '0x33fd426905f149f8376e227d0c9d3340aad17af1',
          },
        },
      ] as AllowlistOperation[];

      const state = await allowlistCreator.execute(ops1);
      for (const phase of Object.keys(state.phases)) {
        for (const component of Object.keys(state.phases[phase].components)) {
          const name = `${state.phases[phase].name}-${state.phases[
            phase
          ].components[component].name.replace('/', '-')}`;
          console.log('saving', name);
          fs.writeFileSync(
            `./state/${name}.json`,
            JSON.stringify(
              state.phases[phase].components[component].winners,
              null,
              2,
            ),
          );
          console.log('saved', name);
        }
      }
    },
    60 * 60 * 10000,
  );

  it.skip('runs', () => {
    const file = fs.readFileSync(
      './state/Phase 1-Phase 1 - Top 220 All SZNs.json',
    );
    const test = [
      '0x7e737324cd6702e1b93c9240072ec9cc036dce21',
      '0x571493b6bb0b99dda41e2da1774b8c9b5bc302af',
      '0x3927e502c865a2c873a735775e224930eadfd2e3',
      '0x65876304b2e6da8248094808cf2a2f6022c534e1',
      '0x343e85ac3009ac01538d4251900ce1a2b7d7ffec',
      '0x4c3daaef71d76fe12625e6be29d1c073dbf4e989',
      '0x51db75f734f02f392452d94e06b7b703bf6ce197',
      '0x4d4c0cbb2d169a96a9b20ee4e36aec807a07eabe',
      '0x8729250ad053ee455b55d862fccf1030c2eb4e0c',
      '0x614a62584658d555cc28b3aabdb691e85e002c8b',
      '0x614b89f072ea263a9387460963142e73548fbaf1',
      '0x1e47bc8b6c585dfff2e166257767050666151f0a',
      '0x5feadf8ef647da7f07584b3d33fcd565b79359a4',
      '0xe776de32c9dc8889e2dcf1cf0606010a51d1abb2',
      '0x6474183ade6709a76c3c411157f501d78b4c5482',
      '0x3fc9d73f76e697113bae54eea77325fd74aa6057',
      '0x3c8a67ff9d751c3cce50c9acf617959396daacd3',
      '0xe7079eec020ddfc3f1c0abe1d946c55e6ed30eb3',
      '0x58ac0439d856e25729d24beaef4f50effa00d834',
      '0xfb541dc23e3b4359275d37e9e8ea3dc54cae5ff8',
      '0xee91d62eb5aaea933efbfd0790613af5db305006',
      '0xf4141aef39803327497f6b81a21bb3f2acfa2436',
      '0xc6411ff69f1ec6bfb4b082f47db61dbedcab250d',
      '0xd3069c9e486a8b77add55ae3ceb3a4b138fb76c7',
      '0x0d69a096b2c66310309f0ead1d6c97c4dfe87086',
      '0xcf2f67229aeade145c9beb8508798458798e7b82',
      '0x6191c173e855202083455859e670ac16a669788d',
      '0x8af0b9a9b751e086122bc340188bd9d99b8c7ec1',
      '0x35bb964878d7b6ddfa69cf0b97ee63fa3c9d9b49',
      '0xacc4b6f3ca8d59f631c1148dcaa52b9d7f5c819a',
      '0xdf8b134fb7743acd805ecdee11335dd0cca921fc',
      '0x6232d7a6085d0ab8f885292078eeb723064a376b',
      '0x2db19ee7f7e0eae5730e7a393fcc899d70df9f25',
      '0xed1e25178d7a6438c356d3459fc3efa9458ad52b',
      '0xe95e35d6e05c1ef8d442ddfe83faa0d9c5c4b143',
      '0x7b50b1f2634fa38d078eb067a4f8f22a666b49a2',
      '0x2b6565c457d6e73efc15eab80b8ffa34b6bf122b',
      '0x13dcdadea84242eacbb956f16fd5eeec593f1731',
      '0xbe9998830c38910ef83e85eb33c90dd301d5516e',
      '0x8f72a6934ce350b19432a3dcb1c698d6f7b49fb6',
      '0xdd5cecf2835d465d490f79ad9773a848805a3219',
      '0x84df1fb4801e72cf6958a994dc0b690f9e7cb23b',
      '0x66fa06bd24294ab3bf123153e49b9065cb7672e7',
      '0xf1e1c701b49b1dc2405a9e8ef40f9f88802b80fa',
      '0xd1afbe4da2a5adc6faf30fcbea9e4eea0ba8c70a',
      '0xb9cf551e73bec54332d76a7542fdacbb77bfa430',
      '0xb3eb9bc116fcf22c3d6d5f920855d4bf34a9b0ba',
      '0xa4580851905c60fca8c6a7995036ddcecf060f4a',
      '0x177a8340bddc2041cc362aabf543dee4e394e3e3',
      '0x49d6531aea6dced6595d50da685274766e4cfc8b',
      '0xb56ae8a727cf38f1f4716aeda6749d2af340d8f4',
      '0x37ea6c993c5f42e1fc3455d5781e4a580760970a',
      '0xd361363a6401870ff8a23b7c77c004aecb8c8b84',
      '0x3a78c445a403c72080cf7e29a1193e79656c6ac7',
      '0x82a214b23c0119f0c37be360889927d68c2caab6',
      '0x31a02440ec79306ca8f557d1ab1f5f7f85590676',
      '0xbf99363007b348b7a019e70cce02e8ba62e95129',
      '0xc04208f289d3842ac168f2c373b3164e1d872650',
      '0x7c0cbf95bcfd15291d991c06d4bdb6912eded9ca',
      '0xcfb3adac1f63fcae9b9c559afd60fd2d6b52008e',
      '0xa3d998b61e214f5a1963ef52a19706a3a2a136db',
      '0x6140f00e4ff3936702e68744f2b5978885464cbb',
      '0x39256c222e2a16db63f21da9d8266fc6f95f45b9',
      '0xe04da86529bc2078c8ae3474b2d67bedf1139c95',
      '0x037a3079e857e383454fefbea892fde12a2e83fd',
      '0xb196931ec22517b0510705eb56d5652fe73877f0',
      '0x12efdcbbcdd6695109ada38e33c56173c2ffe2c3',
      '0xa71000e72d38e6a84d7190f59fd3dfc73931c0e8',
      '0x6ac7466fa71c7af32f4ffcfd20016eb4fc9ad879',
      '0xd8f3d5e9a199a35429870fca8befd159bfe48747',
      '0xadd72e24a9e9117aa16d253cb421cb93b00240e3',
      '0x30f96a8defbfd7729d1b9ca0cb148e0c8460b9d8',
      '0x0c481cd7d09bdd222351d52622d272367cb3d159',
      '0x6372d3c71aa13be4942b1c854b01608f97572e3a',
      '0x8e6d18a600f8bdf70074d93a7da57932f763ac85',
      '0xefb3da5189a6169a61176d1357579e135a1d1187',
      '0xc8cb180415b83f3f9a61691d246fe39a74c6a41e',
      '0xf9b0ca0da3ea91a40deb0f01b3f3a060d69cf6aa',
      '0xb37c5603fb0c6c2e2b62d0525affed9e1e5a6a19',
      '0x0d08c74268c1260d9b50175c41738e1a45819700',
      '0xddc27a0a0c24d60b607dbc7b008f2016585e57bf',
      '0xadebdeab678647a457743ea3af98f8b804e45c24',
      '0x71aa6c4e87225fcae2df49f977c7fc0d1e8d2112',
      '0x32e263cb9003f7fef329080bdcbc82f5cfd6c02f',
      '0xa8d8342e6c68a10aaa88ce9134eb101d5a9d858d',
      '0xafa5057edc21cca0a8406c59c76a6ff61fe113d8',
      '0xfa24cdb97ec294a82417280c86bc4e5a12eb40eb',
      '0x3f4373afdde3d7de3ac433acc7de685338c3980e',
      '0x21b9c7556376efdbf9ee316a4ede0c8257fb7533',
      '0xf031d015a1bef62136694b05c6d83378e13ba71f',
      '0x7f6ca49d1e50671a586a76bb082dd6b3f73fef17',
      '0xe0e31366067277dde4a391cd5d77f43cdb9ffa6d',
      '0x506452ab0dacf04db0ab1544b6be4019651ada90',
      '0x62c868061cddbe38e01e7a8295fdcec72c10ca06',
      '0x7c741ed01ee259feba4b7f9cac114f48bcafacf3',
      '0xcd69150ece65cf880eaa7b91ca6fbb7d38e97cc3',
      '0xa32c38646299818ccedc6401818c2e1639c39c08',
      '0xb960be49f51a6c3234319acc0b9fe1a10f70a94a',
      '0xe8bee2f6bf252ed9efbbd483ca4093ace7350c92',
      '0x2be96c05fb7e81b020c42086b69d21bbf427b53a',
      '0xa1b669414d40e68c11652b1cd82381f2a6495b89',
      '0x08627cddb9710dce14c3949ce41278514a82253d',
      '0xe26027e219998c0acfbd00b74795dc850aee244a',
      '0x40e6d6e798dc878e12987ed978f23c2391f1f570',
      '0x8668681d2017c2322d7ba37070a8ea223ef3729c',
      '0xf6109779752d1fdb8b6063a158bed1b02000b700',
      '0x97ece7185467c78293f3b796bde3704421d4fa69',
      '0x1a7f174dcd4211d41c7c4d7dbb3a0e4db5780c67',
      '0xeb0c4e7244100075c227cb60ea8107cae39c3211',
      '0x3d20c3f372207074df1a0ab5272c7168ce23d178',
      '0x03024d05b1aea10b64ff3af1fed6a3df9adeebb7',
      '0xa10bb823fb55a9199e4f521d0a88993c4cba7150',
      '0x60acf8d95fd365122e56f414b2c13d9dc7742ad7',
      '0x9f35af4727fb91114563d8a8f779a792cb557f3f',
      '0xd36590461162795ee33099b2076a0d4e017ae17c',
      '0xc58326c7020f26345f4568cc09daddf019a8e6d4',
      '0x5c95598fe454882fec1139c3ed1284255b49c8b3',
      '0xe59e088489a85a6de407768deb671c7e493fd799',
      '0x017347cb75ac8725608e593ea35d83f9b2b3cfb8',
      '0xd35f84a9f82fbec2082b2b6c9afd20b4a8f7c959',
      '0xec47cbbd9e05f8c4d587eb604f41740b0b2f33e4',
      '0xe96eb4507a1d162bbb99301fe592d310e9489e40',
      '0x2cfdaf06e39e5d9d3c9afe20362b725b41f68725',
      '0xeecc9f94c674161e84ab0c60c020432ea8f88bc0',
      '0x8a9bfdc136d5d1166497882af5d8c9718f27fbed',
      '0x2a0a412e0a0d436cca7ddba177c4dd9f29801062',
      '0x92c75284b0d863165a8b33e212f02ffeecb2853e',
      '0x5b8ed97b1e85ea4e5e96c3a6e00b0835b087fce5',
      '0xffe6832850476eb6d5ff184d747ed84f1b686aa9',
      '0x1920dbcfdf0fd291a71bec0b66e20ff8674b01a7',
      '0x2c45f65d254e85584b47ec82450c91a30cfc6be1',
      '0xa73421c987e97278e9d9f7e55c687c2ab114b853',
      '0x289256fa6de33947fd292a9e94a738c3d986f8e5',
      '0x7ae3b0627dac32d3ee16c204ef791e37067b8460',
      '0x877d45306e8c7506e9a20c9b7a79bdda97c4e7fe',
      '0x47d278101ee9335c3a3baa14fe184f757229a7b8',
      '0x5b33b6f41e87111b7d22685b297f086b5535034d',
      '0x7a231b6d33f1da74e9fb593bc785b4914a852867',
      '0x67a3a43a55bd9cbfa5d696a7ef2d57e9e0869fdd',
      '0xee2c055f7706b9dfcd98cd5a23d5629d6316c0bd',
      '0x9a40129125dff8e9cb6ca8fbeb07ddc7e4a94647',
      '0x886478d3cf9581b624cb35b5446693fc8a58b787',
      '0x692d6cf19e0c082185e20ff5ea6bb267e7aeb278',
      '0xd981a38d80de1c1528349b841833d3a9a745cb37',
      '0x733983a4c7e778ca9f57cac6ee361c4a9b24e4b1',
      '0x76d01054ff91afc2d515f7fea9a3e3313e248615',
      '0x04294157cfba9ff0892f48f8345ea3539995f449',
      '0x4c97762d6b0355ba508abd284e55afa4896525f5',
      '0x36ff6a01782501553486a4efe6ea6e07f8f3ae28',
      '0x0c844ba95ee1d4a7c54ef35435775e2d5bd2a3d6',
      '0xfeb41f7dc10c98fb5a7995fd9c5de7c83e02dde7',
      '0x6d35392121a6687fe19d6159601b17517f73d0ea',
      '0xb67a577a1855dc3a43df1d94b05a8f5d29570f89',
      '0xbc9ca5bd0f07700929f8d538233b0a9e60f4ddc5',
      '0xdcefc9ff1e47e458e56959154c1cdcf56003d30b',
      '0xc72dd02e34129c57f0e68fb9e0df1fe185d71857',
      '0x70e680b9493685f72e76243c09993fca768eedf1',
      '0x29cd8d94a4e564a6d6576b467ea0bb9d51c9f05e',
      '0xf5671d951c0aa6e4bd69a854fc2d15fe707ddd0e',
      '0xd9e2ad004ac82915d7472448cef2b182547487bd',
      '0xac1c7cc22ff431b5fc07c177b629d926a45eafa8',
      '0x0a87cbf5eec20d8d9880ad21f0260522ff5a675a',
      '0xe8a05c7f4e9c1aa060cf941dbb50381f342d7d43',
      '0xd6ce702632f94069e138d30836194b121f047e79',
      '0x1ee5106b2233169b84dad2acdbf498b29c3c7d15',
      '0x8f4f8916a5c22aa4d0ca25695146e8e4dacc7b13',
      '0xf1d83de0ead95747f4ac184b36659c0d538309c8',
      '0x20163ec2afd9698433a031b0a7dcd70ed77ba8c7',
      '0xf4df143e90c2095e173f861a22f1e6a2503d06cb',
      '0xe2b76c9f15a1e5841a91b404ab4be1c3e5d19551',
      '0x44f2afb689aea37ab17feb2420f17f9a3e851307',
      '0xd87ca052936bcc2b6283b87d2f0aa95cf0080584',
      '0x94f052ca65a34d7f581bba95a749b1cf52689dd5',
      '0x4a162ea613912dbcc7034867f67f667cb5e8855a',
      '0x9313d20e1657ab7fd434943c931f4b796841bac2',
      '0xa94ba6f81ede0d81a5252e71916b5c5567ad6a01',
      '0x954d65e5310607e12f93f6156de92cd37ffcae8e',
      '0xedafab34d7df41ecf39938de47b2308fa923d51e',
      '0x03f4cb9e297ea659f30e09341ee7155a7d136398',
      '0x1471966abfe75cf87fdad8b76d657eab8400f0b0',
      '0xf83fc0d27d92233e789e4d13d452d72404be6fe3',
      '0x47dc3a7aec5c0e1f4b2c71303a4b1eaa0bee3e4c',
      '0xf620422e1e2cbf123386ea664f536d1016e5a5d0',
      '0xa5894f85b5bb5145a69c3f4a41bb4918a8463701',
      '0xbc5a7cf988f7e7e8f3893cd0ee1d0786cd4af889',
      '0xceae4ca7d082856d140f3672780029d6e90c3dcd',
      '0x5a7a4bde5ec6064a66504321af27a82b093f6438',
      '0xc7a295b1b2df1efb82aa204958b98ac30171cb85',
      '0x7dd14501c25c221ffe213d7d56d225f4fe411038',
      '0x57bd982d577660ab22d0a65d2c0a32e482112348',
      '0x37145f730aa36ee38230c49830238beb3f4b3d32',
      '0x72cea5aaaabd1cc5232bd2117e5d21e83cbd0e51',
      '0x387f802c6a9ecffc8b8f6bb7b80ea0db4cef9810',
      '0xc33164f7ecc76869fafd44363cd094a22e0c296f',
      '0xdebd22d7f63648dfb69bb6e2a4c88264d578c0a4',
      '0xbfb7969e75ee4e58620f74135d167f5bdd60800a',
      '0x5fbe799de139710a2eb644f0410fdffbd5f189d3',
      '0x0fb7f9eb8e9bee4dd70dc334b94dee2621a32fb3',
      '0xb98af149b33dee33c97650e877a497bd6a934d54',
      '0x22418183c90741bab6606c0e0d240ae6c3a148f0',
      '0xc6cf5a020bcfc65c6f8181c04cbb5ef5050fe28e',
      '0x11267972b5ec7554fe1b315390c8315f91c4826e',
      '0xc17248624eddbd8fa6c0cf29fbe9b4e2b59e6254',
      '0x9ecdae245a159b4385aaa7f7c6bd8a82660b86bc',
      '0x0ce98350b9dea81fe0b47dbc4787a1e9f8f1d7ff',
      '0x765718a8e4a5562be34b122af259ce5a71372e12',
      '0x956f7db2fdb52de9453ae184d51d1883b8cd9d68',
      '0x84ea8215947e5484ee59818b789de9b4555bcfae',
      '0xa56c04347abee42f663eff9bc2d0147b97c8f782',
      '0xd1380a4e089950ee3a23d818e24ccbbef003a432',
      '0xea9f3a983d965e582c34eb852c18babac52050d8',
      '0xd7e32b8a326ffd9e784a1ee1eea37684a7512171',
      '0x18595f049a9c5c2019efda113009b0ec1c89ceaa',
      '0x0216ac50fdb6b46f6b74254b84ecdd1d431d670c',
      '0x4705bc2775cee0fe266dc2a376010c0eb1bcb474',
      '0x09b2f0988b6d24336b348c84c2764d2b4f85142f',
      '0xa0494ebea98f71b0f5daafbe3c7e77d933a85e56',
      '0x54669ca58bf3a59caea8ae5135db491e4738f65a',
      '0xa490a0346808dda91aea6698cb19e4697d9fc5cc',
      '0x388160a99390392278afdba240046b8b5e73f77b',
    ].map((i) => i.toLowerCase());
    const winners = Object.keys(JSON.parse(file.toString())).map((key) =>
      key.toLowerCase(),
    );
    for (const winner of winners) {
      if (!test.includes(winner)) {
        console.log('missing', winner);
      }
    }
    for (const item of test) {
      if (!winners.includes(item)) {
        console.log('extra', item);
      }
    }
  });
});
