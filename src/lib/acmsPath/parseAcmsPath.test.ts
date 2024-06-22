import { describe, it, expect } from 'vitest';
import parseAcmsPath from './parseAcmsPath';
import type { AcmsContext } from './types';
import { formatDate } from './utils';

describe('parseAcmsPath', () => {
  it('should parse blog context correctly', () => {
    const path = '/bid/123';
    const context: AcmsContext = parseAcmsPath(path);
    expect(context.bid).toBe(123);
  });

  it('should parse template context correctly', () => {
    const path = '/tpl/template-path';
    const context: AcmsContext = parseAcmsPath(path);
    expect(context.tpl).toBe('template-path');
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
    expect(context.field).toBe('price/or/lt/100/100/or/nem/or/gt/300');
  });

  it('should parse date context correctly', () => {
    const path = '/2023/05/20';
    const context: AcmsContext = parseAcmsPath(path);
    expect(context.date).toEqual({ year: 2023, month: 5, day: 20 });
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
    const path = '/bid/123/page/2/tpl/template.html';
    const context: AcmsContext = parseAcmsPath(path);

    expect(context).toEqual({
      bid: 123,
      tpl: 'template.html',
      page: 2,
      span: {
        start: '1000-01-01 00:00:00',
        end: '9999-12-31 23:59:59',
      },
      unresolvedPath: '',
    });
  });
});
