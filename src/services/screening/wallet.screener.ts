import { OfacApi } from './listproviders/ofac/ofac.api';
import { SanctionedWallet } from './sanctioned-wallet';

export class WalletScreener {
  private cachedOfacResponse: Record<string, SanctionedWallet>;

  constructor(private readonly ofacApi: OfacApi) {}

  public async getProfilesForSanctionedWallets({
    walletsToScreen,
  }: {
    walletsToScreen: string[];
  }): Promise<Record<string, SanctionedWallet>> {
    if (!this.cachedOfacResponse) {
      const sanctionedWallets = await this.ofacApi.getSanctionedWallets();
      this.cachedOfacResponse = sanctionedWallets.reduce((acc, curr) => {
        acc[curr.wallet] = curr;
        return acc;
      }, {});
    }
    return walletsToScreen.reduce((acc, curr) => {
      if (this.cachedOfacResponse[curr]) {
        acc[curr] = this.cachedOfacResponse[curr];
      }
      return acc;
    }, {});
  }
}
