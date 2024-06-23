import { acmsPath, type AcmsPathParams } from '../lib/acmsPath';
import { getMessageFromResponse, isString } from '../utils';
import createFetch, { createHeaders } from '../lib/fetch';
import {
  type AcmsClientOptions,
  type AcmsClientConfig,
  type AcmsResponse,
} from '../types';
import { AcmsFetchError } from '.';
import { isAcmsFetchError } from '../lib/typeGuard';

const defaultOptions = {
  responseType: 'json',
  acmsPathOptions: {},
} as const satisfies AcmsClientConfig;

export default class AcmsClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly config: AcmsClientConfig;

  constructor({
    baseUrl,
    apiKey,
    ...options
  }: {
    baseUrl: string;
    apiKey: string;
  } & AcmsClientOptions) {
    if (baseUrl != null && baseUrl === '') {
      throw new Error('baseUrl is required.');
    }
    if (apiKey != null && apiKey === '') {
      throw new Error('apiKey is required.');
    }

    if (!isString(baseUrl)) {
      throw new Error('baseUrl must be string.');
    }

    if (!isString(apiKey)) {
      throw new Error('apiKey must be string.');
    }

    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.config = {
      ...defaultOptions,
      ...options,
    };
  }

  private async request<T = any>(
    acmsPathParamsOrUrl: AcmsPathParams | URL | string,
    options: AcmsClientOptions = {},
  ): Promise<AcmsResponse<T>> {
    const config: AcmsClientConfig = { ...this.config, ...options };
    const { requestInit, responseType, acmsPathOptions } = config;
    const fetch = await createFetch();
    const url = this.createUrl(acmsPathParamsOrUrl, acmsPathOptions);
    const fetchOptions = await this.createFetchOptions(requestInit);

    try {
      const response = await fetch(url, fetchOptions);

      const { ok, status, statusText, headers } = response;
      const data = await response[responseType]();
      const acmsResponse: AcmsResponse<T> = {
        data,
        status,
        statusText,
        headers,
      };

      // If the response fails with any other status code.
      if (!ok) {
        const message = await getMessageFromResponse(response);

        return await Promise.reject(
          new AcmsFetchError<T>(
            `fetch API response status: ${status}${
              message != null ? `\n  message is \`${message}\`` : ''
            }`,
            `${status} ${statusText}`,
            acmsResponse,
          ),
        );
      }

      return acmsResponse;
    } catch (error) {
      if (error instanceof Error) {
        return await Promise.reject(
          new Error(`Network Error.\n  Details: ${error.message}`),
        );
      }
      return await Promise.reject(
        new Error(`Network Error.\n  Details: Unknown Error`),
      );
    }
  }

  private async createFetchOptions(init?: RequestInit) {
    const headers = await createHeaders(init?.headers);

    if (!headers.has('X-API-KEY')) {
      headers.set('X-API-KEY', this.apiKey);
    }

    return { ...init, headers };
  }

  private createUrl(
    acmsPathParamsOrUrl: AcmsPathParams | URL | string,
    options: AcmsClientConfig['acmsPathOptions'] = {},
  ) {
    if (isString(acmsPathParamsOrUrl)) {
      return new URL(acmsPathParamsOrUrl, this.baseUrl);
    }
    if (acmsPathParamsOrUrl instanceof URL) {
      return new URL(acmsPathParamsOrUrl, this.baseUrl);
    }
    return new URL(acmsPath({ ...acmsPathParamsOrUrl }, options), this.baseUrl);
  }

  public async get<T = any>(
    acmsPathParamsOrUrl: AcmsPathParams | URL | string,
    options: AcmsClientOptions = {},
  ): Promise<AcmsResponse<T>> {
    return await this.request<T>(acmsPathParamsOrUrl, {
      ...options,
      requestInit: { ...options.requestInit, method: 'GET' },
    });
  }

  public static isAcmsFetchError(payload: any) {
    return isAcmsFetchError(payload);
  }

  public getConfig() {
    return this.config;
  }
}
