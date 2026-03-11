import axios, { AxiosRequestConfig } from 'axios';
import { Logger, LoggerFactory } from '../logging/logging-emitter';
import { Time } from '../time';

export interface HttpResponse<T> {
  readonly data: T;
  readonly headers: Record<string, string | string[] | undefined>;
  readonly status: number;
}

type GetParams = {
  endpoint: string;
  headers?: Record<string, string>;
  options?: { maxRetries?: number; pauseBetweenRetries?: Time };
  requestConfig?: AxiosRequestConfig;
};

export class Http {
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create('Http');
  }

  async get<T>(params: GetParams): Promise<T> {
    return (await this.getResponse<T>(params)).data;
  }

  async getResponse<T>({
    endpoint,
    headers,
    options,
    requestConfig,
  }: GetParams): Promise<HttpResponse<T>> {
    const maxRetries = options?.maxRetries ?? 1;
    const pauseBetweenRetries = options?.pauseBetweenRetries ?? Time.zero();
    for (let retry = 1; retry <= maxRetries; retry++) {
      try {
        const apiResponse = await axios.get<T>(endpoint, {
          headers,
          ...requestConfig,
        });
        if (+`${apiResponse.status}`.at(0) !== 2) {
          throw new Error(`NOT-OK HTTP Status: ${apiResponse.status}`);
        }
        return {
          data: apiResponse.data,
          headers: apiResponse.headers as Record<
            string,
            string | string[] | undefined
          >,
          status: apiResponse.status,
        };
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
