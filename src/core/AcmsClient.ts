import { acmsPath, type AcmsPathParams } from '../lib/acmsPath';
import { getMessageFromResponse, isString } from '../utils';
import createFetch, { createHeaders } from '../lib/fetch';
import { type AcmsClientConfig, type AcmsResponse } from '../types';
import { AcmsFetchError } from '.';
import { isAcmsFetchError } from '../lib/typeGuard';

const defaultOptions: AcmsClientConfig = {
  responseType: 'json',
};

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
  } & Partial<AcmsClientConfig>) {
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
    options: Partial<AcmsClientConfig> = {},
  ): Promise<AcmsResponse<T>> {
    const config = { ...this.config, ...options };
    const { requestInit, responseType } = config;
    const fetch = await createFetch();
    const url = this.createUrl(acmsPathParamsOrUrl);
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

  private createUrl(acmsPathParamsOrUrl: AcmsPathParams | URL | string) {
    if (isString(acmsPathParamsOrUrl)) {
      return new URL(acmsPathParamsOrUrl, this.baseUrl);
    }
    if (acmsPathParamsOrUrl instanceof URL) {
      return new URL(acmsPathParamsOrUrl, this.baseUrl);
    }
    return new URL(acmsPath({ ...acmsPathParamsOrUrl }), this.baseUrl);
  }

  public async get<T = any>(
    acmsPathParamsOrUrl: AcmsPathParams | URL | string,
    options: Partial<AcmsClientConfig> = {},
  ): Promise<AcmsResponse<T>> {
    return await this.request<T>(acmsPathParamsOrUrl, {
      ...options,
      requestInit: { ...options.requestInit, method: 'GET' },
    });
  }

  public static isAcmsFetchError(payload: any) {
    return isAcmsFetchError(payload);
  }
}
