/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { isDateString } from '../../utils';
import { defaultAcmsPathSegments } from './defaultOptions';
import type { AcmsContext, AcmsPathSegments } from './types';
import { formatDate } from './utils';

interface ParseAcmsPathConfig {
  segments: AcmsPathSegments;
}

const defaultOptions: ParseAcmsPathConfig = {
  segments: defaultAcmsPathSegments,
};

export default function parseAcmsPath(
  path: string,
  options: Partial<ParseAcmsPathConfig> = {},
): AcmsContext {
  const { segments } = { ...defaultOptions, ...options };
  let unresolvedPath = '/' + path.replace(/^\/+/, '');
  let context: AcmsContext = {};

  context = { ...context, ...extractBlogContext(unresolvedPath, segments.bid) };
  unresolvedPath = context.unresolvedPath!;
  context = { ...context, ...extractTplContext(unresolvedPath, segments.tpl) };
  unresolvedPath = context.unresolvedPath!;
  context = {
    ...context,
    ...extractSpanContext(unresolvedPath, segments.span),
  };
  unresolvedPath = context.unresolvedPath!;
  context = { ...context, ...extractTagContext(unresolvedPath, segments.tag) };
  unresolvedPath = context.unresolvedPath!;
  context = { ...context, ...extractUserContext(unresolvedPath, segments.uid) };
  unresolvedPath = context.unresolvedPath!;
  context = {
    ...context,
    ...extractCategoryContext(unresolvedPath, segments.cid),
  };
  unresolvedPath = context.unresolvedPath!;
  context = {
    ...context,
    ...extractEntryContext(unresolvedPath, segments.eid),
  };
  unresolvedPath = context.unresolvedPath!;
  context = {
    ...context,
    ...extractPageContext(unresolvedPath, segments.page),
  };
  unresolvedPath = context.unresolvedPath!;
  context = {
    ...context,
    ...extractLimitContext(unresolvedPath, segments.limit),
  };
  unresolvedPath = context.unresolvedPath!;
  context = {
    ...context,
    ...extractAdminContext(unresolvedPath, segments.admin),
  };
  unresolvedPath = context.unresolvedPath!;
  context = { ...context, ...extractApiContext(unresolvedPath, segments.api) };
  unresolvedPath = context.unresolvedPath!;
  context = {
    ...context,
    ...extractKeywordContext(unresolvedPath, segments.keyword),
  };
  unresolvedPath = context.unresolvedPath!;
  context = {
    ...context,
    ...extractFieldContext(unresolvedPath, segments.field),
  };
  unresolvedPath = context.unresolvedPath!;
  context = { ...context, ...extractDateContext(unresolvedPath) };

  if (context.page === undefined) {
    context.page = 1;
  }

  if (context.span === undefined) {
    context.span = defaultSpan(context);
  }

  return Object.entries(context).reduce<any>((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});

  function extractBlogContext(path: string, segment: string): AcmsContext {
    const { value: bid, unresolvedPath } = extractNumber(path, segment);
    return {
      bid,
      unresolvedPath,
    };
  }

  function extractUserContext(path: string, segment: string): AcmsContext {
    const { value: uid, unresolvedPath } = extractNumber(path, segment);
    return {
      uid,
      unresolvedPath,
    };
  }

  function extractCategoryContext(path: string, segment: string): AcmsContext {
    const { value: cid, unresolvedPath } = extractNumber(path, segment);
    return {
      cid,
      unresolvedPath,
    };
  }

  function extractEntryContext(path: string, segment: string): AcmsContext {
    const { value: eid, unresolvedPath } = extractNumber(path, segment);
    return {
      eid,
      unresolvedPath,
    };
  }

  function extractPageContext(path: string, segment: string): AcmsContext {
    const { value: page, unresolvedPath } = extractNumber(path, segment);
    return {
      page,
      unresolvedPath,
    };
  }

  function extractLimitContext(path: string, segment: string): AcmsContext {
    const { value: limit, unresolvedPath } = extractNumber(path, segment);
    return {
      limit,
      unresolvedPath,
    };
  }

  function extractAdminContext(path: string, segment: string): AcmsContext {
    const { value: admin, unresolvedPath } = extractString(path, segment);
    return {
      admin,
      unresolvedPath,
    };
  }

  function extractApiContext(path: string, segment: string): AcmsContext {
    const { value: api, unresolvedPath } = extractString(path, segment);
    return {
      api,
      unresolvedPath,
    };
  }

  function extractKeywordContext(path: string, segment: string): AcmsContext {
    const { value: keyword, unresolvedPath } = extractString(path, segment);
    return {
      keyword,
      unresolvedPath,
    };
  }

  function extractTplContext(path: string, segment: string): AcmsContext {
    const { value: tpl, unresolvedPath } = extractString(path, segment);
    return {
      tpl,
      unresolvedPath,
    };
  }

  function extractNumber(
    path: string,
    segment: string,
  ): { value: number | undefined; unresolvedPath: string } {
    const match = path.match(new RegExp(`(?:^|/)${segment}/(\\d+)(?=/|$)`));
    const value = match !== null ? parseInt(match[1], 10) : undefined;
    const unresolvedPath = match !== null ? path.replace(match[0], '') : path;
    return { value, unresolvedPath };
  }

  function extractString(
    path: string,
    segment: string,
  ): { value: string | undefined; unresolvedPath: string } {
    const match = path.match(new RegExp(`(?:^|/)${segment}/([^/?#]+)`));
    const value = match !== null ? match[1] : undefined;
    const unresolvedPath = match !== null ? path.replace(match[0], '') : path;
    return { value, unresolvedPath };
  }

  function extractFieldContext(path: string, segment: string): AcmsContext {
    const regex = new RegExp(
      `(?:^|(?<!\\\\)/)${segment}(?:/(?!$|(?:${Object.values(segments).join(
        '|',
      )})/)(?:\\\\.|[^/])*)+`,
    );
    const match = path.match(regex);
    const field =
      match !== null
        ? match[0].replace(new RegExp(`^/${segment}/`), '').replace(/\\/g, '')
        : undefined;
    const unresolvedPath = match !== null ? path.replace(match[0], '') : path;
    return { field, unresolvedPath };
  }

  function extractSpanContext(path: string, segment: string): AcmsContext {
    const match = path.match(new RegExp(`(?:^|/)([^/]+)/${segment}/([^/]+)`));
    const start =
      match !== null && isDateString(match[1])
        ? formatDate(new Date(match[1]))
        : undefined;
    const end =
      match !== null && isDateString(match[2])
        ? formatDate(new Date(match[2]))
        : undefined;
    const span =
      start !== undefined && end !== undefined ? { start, end } : undefined;
    const unresolvedPath = match !== null ? path.replace(match[0], '') : path;
    return { span, unresolvedPath };
  }

  function extractTagContext(path: string, segment: string): AcmsContext {
    const regex = new RegExp(
      `(?:^|(?<!\\\\)/)${segment}(?:/(?!$|(?:${Object.values(segments).join(
        '|',
      )})/)(?:\\\\.|[^/])*)+`,
    );
    const match = path.match(regex);
    const tag =
      match !== null
        ? match[0]
            .replace(new RegExp(`^/${segment}/`), '')
            .replace(/\\/g, '')
            .split('/')
            .map((tag) => tag.trim())
        : undefined;
    const unresolvedPath = match !== null ? path.replace(match[0], '') : path;
    return { tag, unresolvedPath };
  }

  function extractDateContext(path: string): AcmsContext {
    const match = path.match(
      /(?:^|\/)([1-9]\d{3})(?=\/|$)(?:\/([0][1-9]|[1][0-2])(?=\/|$)(?:\/(0[1-9]|[12]\d|3[01])(?=\/|$))?)?/,
    );
    const date =
      match !== null
        ? {
            year: parseInt(match[1], 10),
            month: match[2] !== '' ? parseInt(match[2], 10) : undefined,
            day: match[3] !== '' ? parseInt(match[3], 10) : undefined,
          }
        : undefined;
    const unresolvedPath = match !== null ? path.replace(match[0], '') : path;
    return { date, unresolvedPath };
  }

  function defaultSpan(context: AcmsContext): Required<AcmsContext>['span'] {
    let start = new Date(1000, 0, 1, 0, 0, 0);
    let end = new Date(9999, 11, 31, 23, 59, 59);
    if (context.date !== undefined) {
      start = new Date(
        context.date.year,
        (context.date.month ?? 1) - 1,
        context.date.day ?? 1,
      );
      end = new Date(
        context.date.year,
        (context.date.month ?? 12) - 1,
        context.date.day ?? 31,
        23,
        59,
        59,
      );
    }
    return { start: formatDate(start), end: formatDate(end) };
  }
}
