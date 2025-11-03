export default async function createFetch(): Promise<typeof fetch> {
  return fetch;
}

export async function createHeaders(
  ...args: ConstructorParameters<typeof Headers>
) {
  return new Headers(...args);
}
