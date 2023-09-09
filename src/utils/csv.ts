import { parse } from 'csv-parse';
import { Options } from 'csv-parse';

export async function parseCsv<T>(
  csvContents: string,
  options: Options,
  parser: (records: string[][]) => T[],
): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    parse(csvContents, options, function (err, records: string[][]) {
      if (err) {
        console.error(`Failed to parse CSV`, err);
        reject(err);
      }
      try {
        return resolve(parser(records));
      } catch (e) {
        console.error(`Failed to parse CSV`, err);
        return reject(e);
      }
    });
  });
}
