import { Http } from '../../../http';
import { parseCsv } from '../../../../utils/csv';
import { SanctionedWallet } from '../../sanctioned-wallet';

const SPECIAL_CHARACTER_REGEX = /[\x00-\x08\x0B-\x1F\x7F]+/g;

export class OfacApi {
  constructor(private readonly http: Http) {}

  public async getSanctionedWallets(): Promise<SanctionedWallet[]> {
    const response = await this.http.get<string>({
      endpoint: 'https://www.treasury.gov/ofac/downloads/sdn_comments.csv',
    });
    const idsAndWallets = await parseCsv<{ wallet: string; id: string }>(
      response.replace(SPECIAL_CHARACTER_REGEX, ''),
      { delimiter: ',' },
      (records: string[][]) => {
        return records
          .map<{ wallet: string; id: string }[]>((record: string[]) => {
            const id = record.at(0);
            const wallets =
              record
                .at(1)
                ?.match(/(0x[a-fA-F0-9]{40};)/g)
                ?.map((wallet) => {
                  if (wallet) {
                    return wallet.toLowerCase().replace(';', '');
                  }
                  return null;
                }) || [];
            return wallets.map((wallet) => ({ id, wallet }));
          })
          ?.flat();
      },
    );
    return idsAndWallets.map((idAndWallet) => ({
      recordId: idAndWallet.id,
      wallet: idAndWallet.wallet,
      profile: `https://sanctionssearch.ofac.treas.gov/Details.aspx?id=${idAndWallet.id}`,
      listProvider: 'OFAC',
    }));
  }
}
