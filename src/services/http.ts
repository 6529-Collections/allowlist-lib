import axios from 'axios';
import { Logger, LoggerFactory } from '../logging/logging-emitter';
import { Time } from '../time';

export class Http {
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create('Http');
  }

  async get<T>({
    endpoint,
    headers,
    options,
  }: {
    endpoint: string;
    headers?: Record<string, string>;
    options?: { maxRetries?: number; pauseBetweenRetries?: Time };
  }): Promise<T> {
    const maxRetries = options?.maxRetries ?? 1;
    const pauseBetweenRetries = options?.pauseBetweenRetries ?? Time.zero();
    for (let retry = 1; retry <= maxRetries; retry++) {
      try {
        const apiResponse = await axios.get<T>(endpoint, { headers });
        if (+`${apiResponse.status}`.at(0) !== 2) {
          throw new Error(`NOT-OK HTTP Status: ${apiResponse.status}`);
        }
        return apiResponse.data;
      } catch (e) {
        this.logger.error(
          `Failed to fetch ${endpoint}. Pausing for ${pauseBetweenRetries}. Error: ${
            e.message ? e.message : JSON.stringify(e)
          }`,
        );
        await pauseBetweenRetries.sleep();
      }
    }
    throw new Error(`Failed to fetch from ${endpoint}`);
  }
}
