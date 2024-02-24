export default async function createFetch(): Promise<typeof fetch> {
  if (typeof fetch === 'undefined') {
    const { default: fetch } = await import('cross-fetch');
    return fetch;
  }
  return fetch;
}

export async function createHeaders(
  ...args: ConstructorParameters<typeof Headers>
) {
  if (typeof Headers === 'undefined') {
    const { Headers } = await import('cross-fetch');
    return new Headers(...args);
  }
  return new Headers(...args);
}
