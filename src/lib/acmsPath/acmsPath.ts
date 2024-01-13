import { encodeUri, isDateString, isNumber, isString } from '../../utils';
import { type AcmsContext } from './types';

export default function acmsPath(acmsContext: AcmsContext = {}) {
  let path =
    [
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
      const value = acmsContext[key as keyof AcmsContext];
      if (value === undefined || value === null) {
        return path;
      }

      if (key === 'blog') {
        if (isNumber(value)) {
          return `${path}/bid/${value}`;
        }
        return `${path}/${(value as string)
          .split('/')
          .map(encodeUri)
          .join('/')}`;
      }

      if (key === 'category') {
        if (isNumber(value)) {
          return `${path}/cid/${value}`;
        }
        if (Array.isArray(value)) {
          return `${path}/${(value as string[]).map(encodeUri).join('/')}`;
        }
        return `${path}/${encodeUri(value as string)}`;
      }

      if (key === 'entry') {
        if (isNumber(value)) {
          return `${path}/eid/${value}`;
        }
        return `${path}/${encodeUri(value as string)}`;
      }

      if (key === 'user') {
        return `${path}/uid/${value as number}`;
      }

      if (key === 'field') {
        return `${path}/field/${(value as string)
          .split('/')
          .map(encodeUri)
          .join('/')}`;
      }

      if (key === 'span') {
        const { start, end } = {
          ...{ start: '1000-01-01 00:00:00', end: '9999-12-31 23:59:59' },
          ...(value as AcmsContext['span']),
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
        const { year, month, day } = value as Required<AcmsContext>['date'];
        return [year, month, day].reduce((path, value) => {
          if (value == null) {
            return path;
          }
          return `${path}/${value}`;
        }, path);
      }

      if (key === 'page') {
        return value === 1 ? path : `${path}/page/${value as number}`;
      }

      if (Array.isArray(value)) {
        return value.length > 0
          ? `${path}/${key}/${(value as string[]).map(encodeUri).join('/')}`
          : path;
      }

      return `${path}/${key}/${encodeUri(value as string | number)}`;
    }, '') + '/';

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
