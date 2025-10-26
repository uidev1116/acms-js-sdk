import type { RecursivePartial } from '../../types';
import type AcmsFieldList from './acmsField';

export interface AcmsPathParams {
  blog?: string | number;
  category?: string | string[] | number;
  entry?: string | number;
  user?: number;
  unit?: string;
  tag?: string[];
  field?: string | AcmsFieldList;
  span?: { start?: string | Date; end?: string | Date };
  date?: { year?: number; month?: number; day?: number };
  page?: number;
  order?: string;
  limit?: number;
  keyword?: string;
  admin?: string;
  tpl?: string;
  api?: string;
  searchParams?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface AcmsContext {
  bid?: number;
  cid?: number;
  eid?: number;
  uid?: number;
  utid?: string;
  tag?: string[];
  field?: AcmsFieldList;
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

export interface AcmsContextWithSearchParams extends AcmsContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams?: Record<string, any> | URLSearchParams;
}

export interface AcmsPathSegments {
  bid: string;
  admin: string;
  cid: string;
  eid: string;
  uid: string;
  utid: string;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSeparator(value: any): value is Separator {
  return typeof value === 'string' && ['_and_', '_or_'].includes(value);
}

export interface AcmsFilter {
  operator: Operator;
  value: string;
  connector: Connector;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isAcmsFilter(value: any): value is AcmsFilter {
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
  filters: AcmsFilter[];
  separator?: Separator;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(value.filters as any[]).every(isAcmsFilter)) {
    return false;
  }
  if (value.separator !== undefined && !isSeparator(value.separator)) {
    return false;
  }
  return true;
}
