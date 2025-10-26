import isDateString from '../../utils/isDateString';
import mergeConfig from '../../utils/mergeConfig';
import { defaultAcmsPathSegments } from './defaults';
import type {
  AcmsContext,
  AcmsPathSegments,
  ParseAcmsPathConfig,
  ParseAcmsPathOptions,
} from './types';
import { formatDate, splitPath } from './utils';
import AcmsFieldList from './acmsField';

function collectSlugs(
  slugs: string[],
  startIndex: number,
  segmentSlugs: string[],
): string {
  const collected = [];
  for (let i = startIndex; i < slugs.length; i++) {
    if (segmentSlugs.includes(slugs[i])) break;
    collected.push(slugs[i]);
  }
  return collected.join('/');
}

function extractSpanSlugs(
  start: string,
  end: string,
): [string | undefined, string | undefined] {
  const formattedStart = isDateString(start)
    ? formatDate(new Date(start))
    : undefined;
  const formattedEnd = isDateString(end)
    ? formatDate(new Date(end))
    : undefined;
  return [formattedStart, formattedEnd];
}

function isYearSlug(slug: string): boolean {
  const year = parseInt(slug, 10);
  return year >= 1000 && year <= 9999;
}

function isMonthSlug(slug: string): boolean {
  const month = parseInt(slug, 10);
  return month >= 1 && month <= 12;
}

function isDaySlug(slug: string): boolean {
  const day = parseInt(slug, 10);
  return day >= 1 && day <= 31;
}

function getDefaultSpan(context: AcmsContext): Required<AcmsContext>['span'] {
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

const defaultOptions = {
  segments: defaultAcmsPathSegments,
} as const satisfies ParseAcmsPathConfig;

export default function parseAcmsPath(
  path: string,
  options: ParseAcmsPathOptions = {},
): AcmsContext {
  const { segments } = mergeConfig(
    defaultOptions,
    options,
  ) as ParseAcmsPathConfig;

  const slugs = splitPath(path).filter((slug) => slug);
  const context: AcmsContext = {};
  const unresolvedSlugs = [];
  const segmentKeys = Object.keys(segments);
  const segmentSlugs = Object.values(segments) as string[];

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];

    if (segmentSlugs.includes(slug)) {
      const segmentKey = segmentKeys.find(
        (k) => segments[k as keyof AcmsPathSegments] === slug,
      );
      if (segmentKey !== undefined) {
        const value = slugs[i + 1];
        if (value !== undefined) {
          switch (segmentKey) {
            case 'bid':
            case 'uid':
            case 'cid':
            case 'eid':
            case 'page':
            case 'limit':
              context[segmentKey] = parseInt(value, 10);
              i++;
              break;
            case 'utid':
            case 'admin':
            case 'api':
            case 'keyword':
            case 'order':
              context[segmentKey] = value;
              i++;
              break;
            case 'tpl':
              context.tpl = collectSlugs(slugs, i + 1, segmentSlugs);
              i += context.tpl.split('/').length; // 次のセグメントまでスキップ
              break;
            case 'field': {
              const string = collectSlugs(slugs, i + 1, segmentSlugs);
              context.field = AcmsFieldList.fromString(string);
              i += string.split('/').length; // 次のセグメントまでスキップ
              break;
            }
            case 'tag':
              context.tag = collectSlugs(slugs, i + 1, segmentSlugs)
                .split('/')
                .map((tag) => tag.trim());
              i += context.tag.length; // 次のセグメントまでスキップ
              break;
            case 'span': {
              const [start, end] = extractSpanSlugs(slugs[i - 1], value);
              if (start !== undefined && end !== undefined) {
                context.span = { start, end };
                unresolvedSlugs.pop(); // spanのスラッグを削除
                i++;
              }
              break;
            }
            default:
              break;
          }
        }
      }
    } else {
      unresolvedSlugs.push(slug);
    }
  }

  for (let i = 0; i < unresolvedSlugs.length; i++) {
    const slug = unresolvedSlugs[i];
    if (isYearSlug(slug)) {
      const year = slug;
      const month = unresolvedSlugs[i + 1];
      if (month !== undefined && isMonthSlug(month)) {
        const day = unresolvedSlugs[i + 2];
        if (day !== undefined && isDaySlug(day)) {
          context.date = {
            year: parseInt(year, 10),
            month: parseInt(month, 10),
            day: parseInt(day, 10),
          };
          unresolvedSlugs.splice(i, 3);
          continue;
        }
        context.date = {
          year: parseInt(year, 10),
          month: parseInt(month, 10),
        };
        unresolvedSlugs.splice(i, 2);
        continue;
      }
      context.date = { year: parseInt(year, 10) };
      unresolvedSlugs.splice(i, 1);
      continue;
    }
  }

  if (context.page === undefined) {
    context.page = 1;
  }
  if (context.span === undefined) {
    context.span = getDefaultSpan(context);
  }

  context.unresolvedPath = unresolvedSlugs.join('/');

  return context;
}
