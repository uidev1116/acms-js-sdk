// To-do: fieldをより簡単に書けるようにする
export interface AcmsPathParams {
  blog?: string | number;
  category?: string | string[] | number;
  entry?: string | number;
  user?: number;
  tag?: string[];
  field?: string;
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
  field?: string;
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
