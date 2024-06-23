/* eslint-disable @typescript-eslint/no-non-null-assertion */

import deepmerge from 'deepmerge';
import { encodeUri, isDateString, isNumber, isString } from '../../utils';
import { defaultAcmsPathSegments } from './defaultOptions';
import type {
  AcmsContext,
  AcmsPathConfig,
  AcmsPathOptions,
  AcmsPathParams,
  AcmsPathSegments,
} from './types';
import { formatDate } from './utils';

const defaultOptions: AcmsPathConfig = {
  segments: defaultAcmsPathSegments,
};

export default function acmsPath(
  paramsOrCtx: AcmsPathParams | AcmsContext,
  options: AcmsPathOptions = {},
) {
  const params = isAcmsPathParams(paramsOrCtx)
    ? paramsOrCtx
    : toAcmsPathParams(paramsOrCtx);
  const { segments } = deepmerge(defaultOptions, options) as AcmsPathConfig;
  let path = [
    'blog',
    'admin',
    'category',
    'entry',
    'user',
    'tag',
    'field',
    'span',
    'date',
    'page',
    'order',
    'limit',
    'keyword',
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
        return `${path}/${segments.bid}/${param}`;
      }
      return `${path}/${param.split('/').map(encodeUri).join('/')}`;
    }

    if (key === 'category') {
      const param = params[key]!;
      if (isNumber(param)) {
        return `${path}/${segments.cid}/${param}`;
      }
      if (Array.isArray(param)) {
        return `${path}/${param.map(encodeUri).join('/')}`;
      }
      return `${path}/${encodeUri(param)}`;
    }

    if (key === 'entry') {
      const param = params[key]!;
      if (isNumber(param)) {
        return `${path}/${segments.eid}/${param}`;
      }
      return `${path}/${encodeUri(param)}`;
    }

    if (key === 'user') {
      const param = params[key]!;
      return `${path}/${segments.uid}/${param}`;
    }

    if (key === 'field') {
      const param = params[key]!;
      return `${path}/${segments.field}/${param
        .split('/')
        .map(encodeUri)
        .join('/')}`;
    }

    if (key === 'span') {
      const { start, end } = {
        ...{ start: '1000-01-01 00:00:00', end: '9999-12-31 23:59:59' },
        ...params[key],
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
      const { year, month, day } = params[key]!;
      return [year, month, day].reduce((path, param) => {
        if (param == null) {
          return path;
        }
        return `${path}/${param}`;
      }, path);
    }

    if (key === 'page') {
      const param = params[key]!;
      return param === 1 ? path : `${path}/${segments.page}/${param}`;
    }

    if (key === 'tpl') {
      const param = params[key]!;
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

    return `${path}/${segments[key as keyof AcmsPathSegments]}/${encodeUri(
      param as string | number,
    )}`;
  }, '');

  if (!/\.[^/.]+$/.test(path)) {
    // 拡張子がない場合は末尾にスラッシュを付与する
    path += '/';
  }

  const searchParams = new URLSearchParams(params.searchParams);
  if (searchParams.size > 0) {
    path += `?${searchParams.toString()}`;
  }

  // 相対パスでの指定ができるように先頭のスラッシュを削除する
  // ex: new URL(acmsPath({ blog: 'blog' }), 'https://example.com/hoge/') => https://example.com/hoge/blog
  return path.startsWith('/') ? path.slice(1) : path;
}

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

  if ('searchParams' in params) {
    return true;
  }
  return false;
}

function toAcmsPathParams(context: AcmsContext): AcmsPathParams {
  return {
    blog: context.bid,
    category: context.cid,
    entry: context.eid,
    user: context.uid,
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
  };
}
