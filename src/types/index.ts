import { AcmsPathOptions, acmsPath } from '../lib/acmsPath';

export interface AcmsResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export type ResponseType =
  | 'arrayBuffer'
  | 'blob'
  | 'formData'
  | 'json'
  | 'text';

export interface AcmsClientConfig {
  requestInit?: RequestInit;
  responseType: ResponseType;
  acmsPathOptions?: AcmsPathOptions;
}

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<RecursivePartial<U>>
    : T[P] extends object
      ? RecursivePartial<T[P]>
      : T[P];
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AcmsClientOptions extends RecursivePartial<AcmsClientConfig> {}

export type URLComposable = Parameters<typeof acmsPath>[0] | URL | string;
