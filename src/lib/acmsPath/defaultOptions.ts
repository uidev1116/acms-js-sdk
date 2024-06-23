import { type AcmsPathSegments } from './types';

export const defaultAcmsPathSegments = {
  bid: 'bid',
  cid: 'cid',
  eid: 'eid',
  uid: 'uid',
  tag: 'tag',
  field: 'field',
  span: '-',
  page: 'page',
  order: 'order',
  limit: 'limit',
  keyword: 'keyword',
  admin: 'admin',
  tpl: 'tpl',
  api: 'api',
} as const satisfies AcmsPathSegments;
