/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { stringify } from 'qs';
import { encodeUri } from '../../utils';
import { isNumber, isString } from '../../utils/typeGuard';
import isDateString from '../../utils/isDateString';
import mergeConfig from '../../utils/mergeConfig';
import { defaultAcmsPathSegments } from './defaults';
import type {
  AcmsContext,
  AcmsContextWithSearchParams,
  AcmsPathConfig,
  AcmsPathOptions,
  AcmsPathParams,
  AcmsPathSegments,
} from './types';
import { formatDate } from './utils';

function isAcmsPathParams(
  params: AcmsPathParams | AcmsContext,
): params is AcmsPathParams {
  if ('blog' in params) {
    return true;
  }

  if ('category' in params) {
    return true;
  }

  if ('entry' in params) {
    return true;
  }

  if ('user' in params) {
    return true;
  }

  if ('unit' in params) {
    return true;
  }

  return false;
}

function toAcmsPathParams(
  context: AcmsContextWithSearchParams,
): AcmsPathParams {
  return {
    blog: context.bid,
    category: context.cid,
    entry: context.eid,
    user: context.uid,
    unit: context.utid,
    tag: context.tag,
    field: context.field,
    span: context.span,
    date: context.date,
    page: context.page,
    order: context.order,
    limit: context.limit,
    keyword: context.keyword,
    admin: context.admin,
    tpl: context.tpl,
    api: context.api,
    searchParams: context.searchParams,
  };
}

function twoDigits(num: number) {
  return num < 10 ? `0${num}` : num;
}

const defaultOptions = {
  segments: defaultAcmsPathSegments,
} as const satisfies AcmsPathConfig;

export default function acmsPath(
  paramsOrCtx: AcmsPathParams | AcmsContextWithSearchParams,
  options: AcmsPathOptions = {},
) {
  const params = isAcmsPathParams(paramsOrCtx)
    ? paramsOrCtx
    : toAcmsPathParams(paramsOrCtx);
  const { segments } = mergeConfig(defaultOptions, options) as AcmsPathConfig;
  let path = [
    'blog',
    'admin',
    'category',
    'entry',
    'user',
    'unit',
    'span',
    'date',
    'keyword',
    'tag',
    'field',
    'page',
    'order',
    'limit',
    'tpl',
    'api',
  ].reduce((path, key) => {
    const param = params[key as keyof AcmsPathParams];
    if (param == null) {
      return path;
    }

    if (key === 'blog') {
      const param = params[key]!;
      if (isNumber(param)) {
        if (isNaN(param) || param === 0) {
          return path;
        }
        return `${path}/${segments.bid}/${param}`;
      }
      if (param === '') {
        return path;
      }
      return `${path}/${param.split('/').map(encodeUri).join('/')}`;
    }

    if (key === 'category') {
      const param = params[key]!;
      if (isNumber(param)) {
        if (isNaN(param) || param === 0) {
          return path;
        }
        return `${path}/${segments.cid}/${param}`;
      }
      if (Array.isArray(param)) {
        return `${path}/${param.map(encodeUri).join('/')}`;
      }
      if (param === '') {
        return path;
      }
      return `${path}/${encodeUri(param)}`;
    }

    if (key === 'entry') {
      const param = params[key]!;
      if (isNumber(param)) {
        if (isNaN(param) || param === 0) {
          return path;
        }
        return `${path}/${segments.eid}/${param}`;
      }
      if (param === '') {
        return path;
      }
      return `${path}/${encodeUri(param)}`;
    }

    if (key === 'user') {
      const param = params[key]!;
      if (isNaN(param) || param === 0) {
        return path;
      }
      return `${path}/${segments.uid}/${param}`;
    }

    if (key === 'unit') {
      const param = params[key]!;
      if (param === '') {
        return path;
      }
      return `${path}/${segments.utid}/${param}`;
    }

    if (key === 'field') {
      const param = params[key]!;
      const slug = typeof param !== 'string' ? param.toString() : param;
      if (slug === '') {
        return path;
      }
      return `${path}/${segments.field}/${slug
        .split('/')
        .map(encodeUri)
        .join('/')}`;
    }

    if (key === 'span') {
      const param = params[key]!;
      const { start, end } = {
        ...{ start: '1000-01-01 00:00:00', end: '9999-12-31 23:59:59' },
        ...param,
      };
      if (isString(start) && !isDateString(start)) {
        throw new Error(`Invalid start date: ${start}`);
      }
      if (isString(end) && !isDateString(end)) {
        throw new Error(`Invalid end date: ${end}`);
      }
      return `${path}/${encodeUri(formatDate(new Date(start)))}/${
        segments.span
      }/${encodeUri(formatDate(new Date(end)))}`;
    }

    if (key === 'date') {
      if (params.span != null) {
        return path;
      }
      const param = params[key]!;
      const { year, month, day } = param;
      return [year, month, day].reduce((path, param) => {
        if (param == null) {
          return path;
        }
        if (isNaN(param)) {
          return path;
        }
        return `${path}/${twoDigits(param)}`;
      }, path);
    }

    if (key === 'page') {
      const param = params[key]!;
      if (isNaN(param) || param === 0) {
        return path;
      }
      return param === 1 ? path : `${path}/${segments.page}/${param}`;
    }

    if (key === 'tpl') {
      const param = params[key]!;
      if (param === '') {
        return path;
      }
      return `${path}/${segments.tpl}/${param
        .split('/')
        .map(encodeUri)
        .join('/')}`;
    }

    if (Array.isArray(param)) {
      return param.length > 0
        ? `${path}/${segments[key as keyof AcmsPathSegments]}/${(
            param as string[]
          )
            .map(encodeUri)
            .join('/')}`
        : path;
    }

    if (param !== '') {
      if (isNumber(param) && isNaN(param)) {
        return path;
      }
      return `${path}/${segments[key as keyof AcmsPathSegments]}/${encodeUri(
        param as string | number,
      )}`;
    }
    return path;
  }, '');

  if (!/\.[^/.]+$/.test(path)) {
    // 拡張子がない場合は末尾にスラッシュを付与する
    path += '/';
  }

  const queryString = stringify(params.searchParams, { format: 'RFC1738' });
  if (queryString.length > 0) {
    path += `?${queryString}`;
  }

  // 相対パスでの指定ができるように先頭のスラッシュを削除する
  // ex: new URL(acmsPath({ blog: 'blog' }), 'https://example.com/hoge/') => https://example.com/hoge/blog
  return path.startsWith('/') ? path.slice(1) : path;
}
