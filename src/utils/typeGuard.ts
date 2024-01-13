export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}
