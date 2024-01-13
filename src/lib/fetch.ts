import crossFetch, * as polyfill from 'cross-fetch';

export default function createFetch(): typeof fetch {
  if (typeof fetch === 'undefined') {
    return crossFetch;
  }
  return fetch;
}

export function createHeaders(...args: ConstructorParameters<typeof Headers>) {
  if (typeof Headers === 'undefined') {
    return new polyfill.Headers(...args);
  }
  return new Headers(...args);
}
