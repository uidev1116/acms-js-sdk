// To-do: fieldをより簡単に書けるようにする
export interface AcmsPathParams {
  blog?: string | number;
  category?: string | string[] | number;
  entry?: string | number;
  user?: number;
  tag?: string[];
  field?: string | AcmsField[];
  span?: { start?: string | Date; end?: string | Date };
  date?: { year?: number; month?: number; day?: number };
  page?: number;
  order?: string;
  limit?: number;
  keyword?: string;
  admin?: string;
  tpl?: string;
  api?: string;
  searchParams?: ConstructorParameters<typeof URLSearchParams>[0];
}

export interface AcmsContext {
  bid?: number;
  cid?: number;
  eid?: number;
  uid?: number;
  tag?: string[];
  field?: {
    raw: string;
    parsed: AcmsField[];
  };
  span?: { start: string | Date; end: string | Date };
  date?: { year: number; month?: number; day?: number };
  page?: number;
  order?: string;
  limit?: number;
  keyword?: string;
  admin?: string;
  tpl?: string;
  api?: string;
  unresolvedPath?: string;
}

export interface AcmsPathSegments {
  bid: string;
  admin: string;
  cid: string;
  eid: string;
  uid: string;
  tag: string;
  field: string;
  span: string;
  page: string;
  order: string;
  limit: string;
  keyword: string;
  tpl: string;
  api: string;
}

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<RecursivePartial<U>>
    : T[P] extends object
      ? RecursivePartial<T[P]>
      : T[P];
};

export interface AcmsPathConfig {
  segments: AcmsPathSegments;
}

export interface ParseAcmsPathConfig {
  segments: AcmsPathSegments;
}

export interface AcmsPathOptions extends RecursivePartial<AcmsPathConfig> {}

export interface ParseAcmsPathOptions
  extends RecursivePartial<ParseAcmsPathConfig> {}

export type Connector = 'and' | 'or';

export function isConnector(value: any): value is Connector {
  return typeof value === 'string' && ['and', 'or'].includes(value);
}

export type Operator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'lk'
  | 'nlk'
  | 're'
  | 'nre'
  | 'em'
  | 'nem';

export function isOperator(value: any): value is Operator {
  return (
    typeof value === 'string' &&
    [
      'eq',
      'neq',
      'gt',
      'lt',
      'gte',
      'lte',
      'lk',
      'nlk',
      're',
      'nre',
      'em',
      'nem',
    ].includes(value)
  );
}

export type Separator = '_and_' | '_or_';

export function isSeparator(value: any): value is Separator {
  return typeof value === 'string' && ['_and_', '_or_'].includes(value);
}

export interface AcmsFieldFilter {
  operator: Operator;
  value: string | number;
  connector: Connector;
}

export function isAcmsFieldFilter(value: any): value is AcmsFieldFilter {
  return (
    typeof value === 'object' &&
    value !== null &&
    isOperator(value.operator) &&
    (typeof value.value === 'string' || typeof value.value === 'number') &&
    isConnector(value.connector)
  );
}

export interface AcmsField {
  key: string;
  filters: AcmsFieldFilter[];
  separator?: Separator;
}

export function isAcmsField(value: any): value is AcmsField {
  if (typeof value !== 'object') {
    return false;
  }
  if (value == null) {
    return false;
  }
  if (typeof value.key !== 'string') {
    return false;
  }
  if (!Array.isArray(value.filters)) {
    return false;
  }
  if (!(value.filters as any[]).every(isAcmsFieldFilter)) {
    return false;
  }
  if (value.separator !== undefined && !isSeparator(value.separator)) {
    return false;
  }
  return true;
}
