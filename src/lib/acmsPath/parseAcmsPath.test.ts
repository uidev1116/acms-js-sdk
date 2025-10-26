import { describe, it, expect } from 'vitest';
import parseAcmsPath from './parseAcmsPath';
import type { AcmsContext, ParseAcmsPathOptions } from './types';
import { formatDate } from './utils';

describe('parseAcmsPath', () => {
  it('should parse blog context correctly', () => {
    const path = '/bid/123';
    const context: AcmsContext = parseAcmsPath(path);
    expect(context.bid).toBe(123);
  });

  it('should parse template context correctly', () => {
    const path = '/tpl/include/ajax/data.json';
    const context: AcmsContext = parseAcmsPath(path);
    expect(context.tpl).toBe('include/ajax/data.json');
  });

  it('should parse span context correctly', () => {
    const path = '/2021-01-01/-/2021-12-31';
    const result: AcmsContext = parseAcmsPath(path, {});
    expect(result.span).toEqual({
      start: formatDate(new Date('2021-01-01')),
      end: formatDate(new Date('2021-12-31')),
    });
  });

  it('should parse tag context correctly', () => {
    const path = '/tag/tag1/tag2';
    const context: AcmsContext = parseAcmsPath(path);
    expect(context.tag).toEqual(['tag1', 'tag2']);
  });

  it('should parse user context correctly', () => {
    const path = '/uid/456';
    const context: AcmsContext = parseAcmsPath(path);
    expect(context.uid).toBe(456);
  });

  it('should parse category context correctly', () => {
    const path = '/cid/789';
    const context: AcmsContext = parseAcmsPath(path);
    expect(context.cid).toBe(789);
  });

  it('should parse entry context correctly', () => {
    const path = '/eid/101112';
    const context: AcmsContext = parseAcmsPath(path);
    expect(context.eid).toBe(101112);
  });

  it('should parse unit context correctly', () => {
    const path = '/utid/123e4567-e89b-12d3-a456-426614174000';
    const context: AcmsContext = parseAcmsPath(path);
    expect(context.utid).toBe('123e4567-e89b-12d3-a456-426614174000');
  });

  it('should parse page context correctly', () => {
    const path = '/page/3';
    const context: AcmsContext = parseAcmsPath(path);
    expect(context.page).toBe(3);
  });

  it('should parse limit context correctly', () => {
    const path = '/limit/50';
    const context: AcmsContext = parseAcmsPath(path);
    expect(context.limit).toBe(50);
  });

  it('should parse admin context correctly', () => {
    const path = '/admin/entry_index';
    const context: AcmsContext = parseAcmsPath(path);
    expect(context.admin).toBe('entry_index');
  });

  it('should parse API context correctly', () => {
    const path = '/api/module_id';
    const context: AcmsContext = parseAcmsPath(path);
    expect(context.api).toBe('module_id');
  });

  it('should parse keyword context correctly', () => {
    const path = '/keyword/search-term';
    const context: AcmsContext = parseAcmsPath(path);
    expect(context.keyword).toBe('search-term');
  });

  it('should parse field context correctly', () => {
    const path = '/field/price/or/lt/100/100/or/nem/or/gt/300/';
    const context: AcmsContext = parseAcmsPath(path);
    expect(context.field?.toString()).toBe(
      'price/or/lt/100/100/or/nem/or/gt/300',
    );
    expect(context.field?.getFields()).toStrictEqual([
      {
        key: 'price',
        filters: [
          { operator: 'lt', value: '100', connector: 'or' },
          { operator: 'eq', value: '100', connector: 'or' },
          { operator: 'nem', value: '', connector: 'or' },
          { operator: 'gt', value: '300', connector: 'or' },
        ],
        separator: '_and_',
      },
    ]);
  });

  it('should parse date context correctly', () => {
    const path = '/2023/05/20';
    const context: AcmsContext = parseAcmsPath(path);
    expect(context.date).toEqual({ year: 2023, month: 5, day: 20 });
  });

  it('should parse date context with only year', () => {
    const path = '/2023';
    const context: AcmsContext = parseAcmsPath(path);
    expect(context.date).toEqual({ year: 2023 });
  });

  it('should parse date context with year and month', () => {
    const path = '/2023/05';
    const context: AcmsContext = parseAcmsPath(path);
    expect(context.date).toEqual({ year: 2023, month: 5 });
  });

  it('should default page to 1 if not present', () => {
    const path = '/';
    const context: AcmsContext = parseAcmsPath(path);
    expect(context.page).toBe(1);
  });

  it('should default span context if not present', () => {
    const path = '/';
    const context: AcmsContext = parseAcmsPath(path);
    expect(context.span).toEqual({
      start: '1000-01-01 00:00:00',
      end: '9999-12-31 23:59:59',
    });
  });

  it('should parse complex paths correctly', () => {
    const path = '/bid/123/2024/06/23/page/2/tpl/include/search.html';
    const context: AcmsContext = parseAcmsPath(path);

    expect(context).toEqual({
      bid: 123,
      date: {
        year: 2024,
        month: 6,
        day: 23,
      },
      tpl: 'include/search.html',
      page: 2,
      span: {
        start: '2024-06-23 00:00:00',
        end: '2024-06-23 23:59:59',
      },
      unresolvedPath: '',
    });
  });

  it('should extract unresolved path correctly', () => {
    const path =
      '/blog/category/entry.html/2021-01-01/-/2021-12-31/tag/tag1/tag2';
    const context: AcmsContext = parseAcmsPath(path, {});
    expect(context.unresolvedPath).toBe('blog/category/entry.html');
  });

  it('should override segments with custom options', () => {
    const options: ParseAcmsPathOptions = {
      segments: {
        bid: 'custom-bid',
        cid: 'custom-cid',
        eid: 'custom-eid',
        uid: 'custom-uid',
        page: 'custom-page',
      },
    };

    const path =
      '/custom-bid/123/custom-uid/456/custom-cid/789/custom-eid/101112/custom-page/3';
    const context: AcmsContext = parseAcmsPath(path, options);

    expect(context.bid).toBe(123);
    expect(context.uid).toBe(456);
    expect(context.cid).toBe(789);
    expect(context.eid).toBe(101112);
  });

  it('should retain default segments when custom options are partially provided', () => {
    const options = {
      segments: {
        tpl: 'custom-tpl',
      },
    };

    const path = '/bid/123/custom-tpl/custom-template';
    const context: AcmsContext = parseAcmsPath(path, options);

    expect(context.bid).toBe(123);
    expect(context.tpl).toBe('custom-template');
  });

  it('should handle default and custom segments together', () => {
    const options = {
      segments: {
        tpl: 'custom-tpl',
        field: 'custom-field',
      },
    };

    const path = '/bid/123/custom-field/color/red/custom-tpl/sample.html';
    const context: AcmsContext = parseAcmsPath(path, options);

    expect(context.bid).toBe(123);
    expect(context.field?.getFields()).toStrictEqual([
      {
        key: 'color',
        filters: [{ operator: 'eq', value: 'red', connector: 'or' }],
        separator: '_and_',
      },
    ]);
    expect(context.tpl).toBe('sample.html');
  });

  it('should parse unresolved path correctly with custom segments', () => {
    const options = {
      segments: {
        bid: 'custom-bid',
        tpl: 'custom-tpl',
        span: 'custom-span',
      },
    };

    const path =
      '/custom/path/structure/custom-bid/123/2021-01-01/custom-span/2021-12-31';
    const context: AcmsContext = parseAcmsPath(path, options);

    expect(context.bid).toBe(123);
    expect(context.span).toEqual({
      start: formatDate(new Date('2021-01-01')),
      end: formatDate(new Date('2021-12-31')),
    });
    expect(context.unresolvedPath).toBe('custom/path/structure');
  });
});
