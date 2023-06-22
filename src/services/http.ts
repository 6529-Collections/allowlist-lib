import axios from 'axios';
import { Logger, LoggerFactory } from '../logging/logging-emitter';

export class Http {
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create('Http');
  }

  async get<T>({ endpoint }: { endpoint: string }): Promise<T> {
    try {
      const apiResponse = await axios.get<T>(endpoint);
      if (+`${apiResponse.status}`.at(0) !== 2) {
        throw new Error(`NOT-OK HTTP Status: ${apiResponse.status}`);
      }
      return apiResponse.data;
    } catch (e) {
      this.logger.error(
        `Failed to fetch ${endpoint}: ${
          e.message ? e.message : JSON.stringify(e)
        }`,
      );
      throw new Error(`Failed to fetch from ${endpoint}`);
    }
  }
}
