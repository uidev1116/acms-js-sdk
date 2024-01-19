/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { encodeUri, isDateString, isNumber, isString } from '../../utils';
import { type AcmsContext } from './types';

export default function acmsPath(acmsContext: AcmsContext = {}) {
  let path = [
    'blog',
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
    const segment = acmsContext[key as keyof AcmsContext];
    if (segment == null) {
      return path;
    }

    if (key === 'blog') {
      const segment = acmsContext[key]!;
      if (isNumber(segment)) {
        return `${path}/bid/${segment}`;
      }
      return `${path}/${segment.split('/').map(encodeUri).join('/')}`;
    }

    if (key === 'category') {
      const segment = acmsContext[key]!;
      if (isNumber(segment)) {
        return `${path}/cid/${segment}`;
      }
      if (Array.isArray(segment)) {
        return `${path}/${segment.map(encodeUri).join('/')}`;
      }
      return `${path}/${encodeUri(segment)}`;
    }

    if (key === 'entry') {
      const segment = acmsContext[key]!;
      if (isNumber(segment)) {
        return `${path}/eid/${segment}`;
      }
      return `${path}/${encodeUri(segment)}`;
    }

    if (key === 'user') {
      const segment = acmsContext[key]!;
      return `${path}/uid/${segment}`;
    }

    if (key === 'field') {
      const segment = acmsContext[key]!;
      return `${path}/field/${segment.split('/').map(encodeUri).join('/')}`;
    }

    if (key === 'span') {
      const { start, end } = {
        ...{ start: '1000-01-01 00:00:00', end: '9999-12-31 23:59:59' },
        ...acmsContext[key],
      };
      if (isString(start) && !isDateString(start)) {
        throw new Error(`Invalid start date: ${start}`);
      }
      if (isString(end) && !isDateString(end)) {
        throw new Error(`Invalid end date: ${end}`);
      }
      return `${path}/${encodeUri(formatDate(new Date(start)))}/-/${encodeUri(
        formatDate(new Date(end)),
      )}`;
    }

    if (key === 'date') {
      if (acmsContext.span != null) {
        return path;
      }
      const { year, month, day } = acmsContext[key]!;
      return [year, month, day].reduce((path, segment) => {
        if (segment == null) {
          return path;
        }
        return `${path}/${segment}`;
      }, path);
    }

    if (key === 'page') {
      const segment = acmsContext[key]!;
      return segment === 1 ? path : `${path}/page/${segment}`;
    }

    if (key === 'tpl') {
      const segment = acmsContext[key]!;
      return `${path}/tpl/${segment.split('/').map(encodeUri).join('/')}`;
    }

    if (Array.isArray(segment)) {
      return segment.length > 0
        ? `${path}/${key}/${(segment as string[]).map(encodeUri).join('/')}`
        : path;
    }

    return `${path}/${key}/${encodeUri(segment as string | number)}`;
  }, '');

  if (!/\.[^/.]+$/.test(path)) {
    // 拡張子がない場合は末尾にスラッシュを付与する
    path += '/';
  }

  const searchParams = new URLSearchParams(acmsContext.searchParams);
  if (searchParams.size > 0) {
    path += `?${searchParams.toString()}`;
  }

  // 相対パスでの指定ができるように先頭のスラッシュを削除する
  // ex: new URL(acmsPath({ blog: 'blog' }), 'https://example.com/hoge/') => https://example.com/hoge/blog
  return path.startsWith('/') ? path.slice(1) : path;
}

function formatDate(date: Date) {
  function twoDigits(num: number) {
    return num < 10 ? '0' + num : num;
  }

  const year = date.getFullYear();
  const month = twoDigits(date.getMonth() + 1); // JavaScriptの月は0から始まるため、1を加える
  const day = twoDigits(date.getDate());
  const hours = twoDigits(date.getHours());
  const minutes = twoDigits(date.getMinutes());
  const seconds = twoDigits(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export type { AcmsContext };
