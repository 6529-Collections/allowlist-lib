import { SanctionedWallet } from './sanctioned-wallet';
import { OfacApi } from './listproviders/ofac/ofac.api';
import { WalletScreener } from './wallet.screener';

class MockOfacApi extends OfacApi {
  private askedOnce = false;
  constructor() {
    super(undefined);
  }

  public async getSanctionedWallets(): Promise<SanctionedWallet[]> {
    if (this.askedOnce) {
      throw `Should not be called more than once`;
    }
    this.askedOnce = true;
    return [
      {
        recordId: 'TEST',
        wallet: '0xTEST',
        profile: 'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=TEST',
        listProvider: 'OFAC',
      },
    ];
  }
}

describe('Wallet Screener', () => {
  const screener = new WalletScreener(new MockOfacApi());
  it('should screen given wallets against list providers and use cached results the second time', async () => {
    const walletsToScreen = ['0xTEST', '0xTEST2'];
    const sanctionWalletsProfiles =
      await screener.getProfilesForSanctionedWallets({
        walletsToScreen,
      });
    expect(JSON.stringify(sanctionWalletsProfiles)).toEqual(
      JSON.stringify({
        '0xTEST': {
          recordId: 'TEST',
          wallet: '0xTEST',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=TEST',
          listProvider: 'OFAC',
        },
      }),
    );

    const sanctionWalletsProfiles2 =
      await screener.getProfilesForSanctionedWallets({
        walletsToScreen,
      });
    expect(JSON.stringify(sanctionWalletsProfiles2)).toEqual(
      JSON.stringify({
        '0xTEST': {
          recordId: 'TEST',
          wallet: '0xTEST',
          profile:
            'https://sanctionssearch.ofac.treas.gov/Details.aspx?id=TEST',
          listProvider: 'OFAC',
        },
      }),
    );
  });
});
