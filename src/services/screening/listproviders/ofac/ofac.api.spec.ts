import { OfacApi } from './ofac.api';
import { Http } from '../../../http';
import { defaultLogFactory } from '../../../../logging/logging-emitter';
import * as fs from 'fs';

class MockHttp extends Http {
  constructor() {
    super(defaultLogFactory);
  }

  override async get<T>(): Promise<T> {
    return fs.readFileSync('mock-data/ofac.csv', 'utf8') as T;
  }
}

describe('OFAC API', () => {
  const ofacApi = new OfacApi(new MockHttp());
  it('should return a list of OFAC sanctioned wallets', async () => {
    const sanctionedWallets = await ofacApi.getSanctionedWallets();
    expect(JSON.stringify(sanctionedWallets)).toBe(
      JSON.stringify([
        {
          recordId: '29703',
          wallet: '0x8576acc5c05d6ce88f4e49bf65bdf0c62f91353c',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=29703',
          listProvider: 'OFAC',
        },
        {
          recordId: '30518',
          wallet: '0x1da5821544e25c636c1417ba96ade4cf6d2f9b5a',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=30518',
          listProvider: 'OFAC',
        },
        {
          recordId: '30518',
          wallet: '0x7db418b5d567a4e0e8c59ad71be1fce48f3e6107',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=30518',
          listProvider: 'OFAC',
        },
        {
          recordId: '30518',
          wallet: '0x72a5843cc08275c8171e582972aa4fda8c397b2a',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=30518',
          listProvider: 'OFAC',
        },
        {
          recordId: '30518',
          wallet: '0x7f19720a857f834887fc9a7bc0a0fbe7fc7f8102',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=30518',
          listProvider: 'OFAC',
        },
        {
          recordId: '33151',
          wallet: '0x2f389ce8bd8ff92de3402ffce4691d17fc4f6535',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=33151',
          listProvider: 'OFAC',
        },
        {
          recordId: '33151',
          wallet: '0x19aa5fe80d33a56d56c78e82ea5e50e5d80b4dff',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=33151',
          listProvider: 'OFAC',
        },
        {
          recordId: '33151',
          wallet: '0xe7aa314c77f4233c18c6cc84384a9247c0cf367b',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=33151',
          listProvider: 'OFAC',
        },
        {
          recordId: '33151',
          wallet: '0x308ed4b7b49797e1a98d3818bff6fe5385410370',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=33151',
          listProvider: 'OFAC',
        },
        {
          recordId: '33151',
          wallet: '0x2f389ce8bd8ff92de3402ffce4691d17fc4f6535',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=33151',
          listProvider: 'OFAC',
        },
        {
          recordId: '33151',
          wallet: '0x19aa5fe80d33a56d56c78e82ea5e50e5d80b4dff',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=33151',
          listProvider: 'OFAC',
        },
        {
          recordId: '33854',
          wallet: '0x67d40ee1a85bf4a4bb7ffae16de985e8427b6b45',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=33854',
          listProvider: 'OFAC',
        },
        {
          recordId: '33854',
          wallet: '0x6f1ca141a28907f78ebaa64fb83a9088b02a8352',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=33854',
          listProvider: 'OFAC',
        },
        {
          recordId: '33854',
          wallet: '0x6acdfba02d390b97ac2b2d42a63e85293bcc160e',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=33854',
          listProvider: 'OFAC',
        },
        {
          recordId: '33854',
          wallet: '0x48549a34ae37b12f6a30566245176994e17c6b4a',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=33854',
          listProvider: 'OFAC',
        },
        {
          recordId: '33854',
          wallet: '0x5512d943ed1f7c8a43f3435c85f7ab68b30121b0',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=33854',
          listProvider: 'OFAC',
        },
        {
          recordId: '33854',
          wallet: '0xc455f7fd3e0e12afd51fba5c106909934d8a0e4a',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=33854',
          listProvider: 'OFAC',
        },
        {
          recordId: '39585',
          wallet: '0x83e5bc4ffa856bb84bb88581f5dd62a433a25e0d',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39585',
          listProvider: 'OFAC',
        },
        {
          recordId: '39585',
          wallet: '0x08b2efdcdb8822efe5ad0eae55517cf5dc544251',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39585',
          listProvider: 'OFAC',
        },
        {
          recordId: '39585',
          wallet: '0x04dba1194ee10112fe6c3207c0687def0e78bacf',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39585',
          listProvider: 'OFAC',
        },
        {
          recordId: '39585',
          wallet: '0x0ee5067b06776a89ccc7dc8ee369984ad7db5e06',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39585',
          listProvider: 'OFAC',
        },
        {
          recordId: '39585',
          wallet: '0x502371699497d08d5339c870851898d6d72521dd',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39585',
          listProvider: 'OFAC',
        },
        {
          recordId: '39585',
          wallet: '0x5a14e72060c11313e38738009254a90968f58f51',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39585',
          listProvider: 'OFAC',
        },
        {
          recordId: '39585',
          wallet: '0xefe301d259f525ca1ba74a7977b80d5b060b3cca',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39585',
          listProvider: 'OFAC',
        },
        {
          recordId: '39593',
          wallet: '0xd0975b32cea532eadddfc9c60481976e39db3472',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39593',
          listProvider: 'OFAC',
        },
        {
          recordId: '39593',
          wallet: '0x1967d8af5bd86a497fb3dd7899a020e47560daaf',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39593',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x4736dcf1b7a3d580672cce6e7c65cd5cc9cfba9d',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xdd4c48c0b24039969fc16d1cdf626eab821d3384',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xd96f2b1c14db8458374d9aca76e26c3d18364307',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x169ad27a470d064dede56a2d3ff727986b15d52b',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x0836222f2b2b24a3f36f98668ed8f0b38d1a872f',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x178169b423a011fff22b9e3f3abea13414ddd0f1',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x610b717796ad172b316836ac95a2ffad065ceab4',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xbb93e510bbcd0b7beb5a853875f9ec60275cf498',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x84443cfd09a48af6ef360c6976c5392ac5023a1f',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xd47438c816c9e7f2e2888e060936a499af9582b3',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x330bdfade01ee9bf63c209ee33102dd334618e0a',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x1e34a77868e19a6647b1f2f47b51ed72dede95dd',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xdf231d99ff8b6c6cbf4e9b9a945cbacef9339178',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xaf4c0b70b2ea9fb7487c7cbb37ada259579fe040',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xa5c2254e4253490c54cef0a4347fddb8f75a4998',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xaf8d1839c3c67cf571aa74b5c12398d4901147b3',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x6bf694a291df3fec1f7e69701e3ab6c592435ae7',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x3aac1cc67c2ec5db4ea850957b967ba153ad6279',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x723b78e67497e85279cb204544566f4dc5d2aca0',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x0e3a09dda6b20afbb34ac7cd4a6881493f3e7bf7',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x76d85b4c0fc497eecc38902397ac608000a06607',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xcc84179ffd19a1627e79f8648d09e095252bc418',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xd5d6f8d9e784d0e26222ad3834500801a68d027d',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x407cceeaa7c95d2fe2250bf9f2c105aa7aafb512',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x833481186f16cece3f1eeea1a694c42034c3a0db',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xd8d7de3349ccaa0fde6298fe6d7b7d0d34586193',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x8281aa6795ade17c8973e1aedca380258bc124f9',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x57b2b8c82f065de8ef5573f9730fc1449b403c9f',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x05e0b5b40b7b66098c2161a5ee11c5740a3a7c45',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x23173fe8b96a4ad8d2e17fb83ea5dcccdca1ae52',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x538ab61e8a9fc1b2f93b3dd9011d662d89be6fe6',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x94be88213a387e992dd87de56950a9aef34b9448',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x242654336ca2205714071898f67e254eb49acdce',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x776198ccf446dfa168347089d7338879273172cf',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xedc5d01286f99a066559f60a585406f3878a033e',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xd692fd2d0b2fbd2e52cfa5b5b9424bc981c30696',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xca0840578f57fe71599d29375e16783424023357',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xdf3a408c53e5078af6e8fb2a85088d46ee09a61b',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x743494b60097a2230018079c02fe21a7b687eaa5',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x94c92f096437ab9958fc0a37f09348f30389ae79',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x5efda50f22d34f262c29268506c5fa42cb56a1ce',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x2f50508a8a3d323b91336fa3ea6ae50e55f32185',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xcee71753c9820f063b38fdbe4cfdaf1d3d928a80',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xffbac21a641dcfe4552920138d90f3638b3c9fba',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x179f48c78f57a3a78f0608cc9197b8972921d1d2',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xb04e030140b30c27bcdfaafffa98c57d80eda7b4',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x77777feddddffc19ff86db637967013e6c6a116c',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x3efa30704d2b8bbac821307230376556cf8cc39e',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x746aebc06d2ae31b71ac51429a19d54e797878e9',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xd90e2f925da726b50c4ed8d0fb90ad053324f31b',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x5f6c97c6ad7bdd0ae7e0dd4ca33a4ed3fdabd4d7',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xf4b067dd14e95bab89be928c07cb22e3c94e0daa',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x58e8dcc13be9780fc42e8723d8ead4cf46943df2',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x01e2919679362dfbc9ee1644ba9c6da6d6245bb1',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x2fc93484614a34f26f7970cbb94615ba109bb4bf',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x26903a5a198d571422b2b4ea08b56a37cbd68c89',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xb20c66c4de72433f3ce747b58b86830c459ca911',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x2573bac39ebe2901b4389cd468f2872cf7767faf',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x527653ea119f3e6a1f5bd18fbf4714081d7b31ce',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x653477c392c16b0765603074f157314cc4f40c32',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x88fd245fedec4a936e700f9173454d1931b4c307',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x09193888b3f38c82dedfda55259a82c0e7de875e',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x5cab7692d4e94096462119ab7bf57319726eed2a',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x756c4628e57f7e7f8a459ec2752968360cf4d1aa',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x722122df12d4e14e13ac3b6895a86e84145b6967',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x94a1b5cdb22c43faab4abeb5c74999895464ddaf',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xb541fc07bc7619fd4062a54d96268525cbc6ffef',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xd82ed8786d7c69dc7e052f7a542ab047971e73d2',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xf67721a2d8f736e75a49fdd7fad2e31d8676542a',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x9ad122c22b14202b4490edaf288fdb3c7cb3ff5e',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xd691f27f38b395864ea86cfc7253969b409c362d',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xaeaac358560e11f52454d997aaff2c5731b6f8a6',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x1356c899d8c9467c7f71c195612f8a395abf2f0a',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xa60c772958a3ed56c1f15dd055ba37ac8e523a0d',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xba214c1c1928a32bffe790263e38b4af9bfcd659',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xb1c8094b234dce6e03f10a5b673c1d8c69739a00',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0xf60dd140cff0706bae9cd734ac3ae76ad9ebc32a',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
        {
          recordId: '39796',
          wallet: '0x8589427373d6d84e98730d7795d8f6f8731fda16',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=39796',
          listProvider: 'OFAC',
        },
      ]),
    );
  });
});
