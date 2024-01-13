import { type AcmsResponse } from '../types';

export default class AcmsFetchError<T = any> extends Error {
  public code: string;
  public response: AcmsResponse<T>;

  constructor(
    message: string,
    code: string,
    response: AcmsResponse<T>,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'AcmsFetchError';
    this.code = code;
    this.response = response;
  }
}
