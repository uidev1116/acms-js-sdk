import { describe, expect, test } from 'vitest';
import acmsPath from './acmsPath';

describe('acmsPath', () => {
  test('work with blog context', () => {
    expect(acmsPath({ blog: 'blog' })).toBe('blog/');
    expect(acmsPath({ blog: 1 })).toBe('bid/1/');
  });

  test('work with admin context', () => {
    expect(acmsPath({ admin: 'entry_index' })).toBe('admin/entry_index/');
    expect(acmsPath({ blog: 1, category: 1, admin: 'entry_edit' })).toBe(
      'bid/1/admin/entry_edit/cid/1/',
    );
  });

  test('work with category context', () => {
    expect(acmsPath({ category: 'category' })).toBe('category/');
    expect(acmsPath({ category: ['hoge', 'fuga'] })).toBe('hoge/fuga/');
    expect(acmsPath({ blog: 1, category: 2 })).toBe('bid/1/cid/2/');
  });

  test('work with entry context', () => {
    expect(acmsPath({ entry: 'entry-1.html' })).toBe('entry-1.html');
    expect(acmsPath({ entry: 3 })).toBe('eid/3/');
  });

  test('work with user context', () => {
    expect(acmsPath({ user: 1 })).toBe('uid/1/');
  });

  test('work with keyword context', () => {
    expect(
      acmsPath({ blog: 'blog', category: 'category', keyword: 'keyword' }),
    ).toBe('blog/category/keyword/keyword/');
  });

  test('work with tag context', () => {
    expect(
      acmsPath({ blog: 'blog', category: 'category', tag: ['apple', 'grape'] }),
    ).toBe('blog/category/tag/apple/grape/');
  });

  test('work with span context', () => {
    expect(
      acmsPath({
        blog: 'blog',
        category: 'category',
        span: { start: '2014-01-01 00:00:00', end: '2015-12-31 23:59:59' },
      }),
    ).toBe(
      'blog/category/2014-01-01%2000%3A00%3A00/-/2015-12-31%2023%3A59%3A59/',
    );
    expect(
      acmsPath({
        blog: 'blog',
        category: 'category',
        span: { start: '2014-01-01 00:00:00' },
      }),
    ).toBe(
      'blog/category/2014-01-01%2000%3A00%3A00/-/9999-12-31%2023%3A59%3A59/',
    );
    expect(
      acmsPath({
        blog: 'blog',
        category: 'category',
        span: { end: '2015-12-31 23:59:59' },
      }),
    ).toBe(
      'blog/category/1000-01-01%2000%3A00%3A00/-/2015-12-31%2023%3A59%3A59/',
    );
  });

  test('throw error with invalid span context', () => {
    expect(() =>
      acmsPath({
        blog: 'blog',
        category: 'category',
        span: { start: 'invalid date' },
      }),
    ).toThrow('Invalid start date: invalid date');
    expect(() =>
      acmsPath({
        blog: 'blog',
        category: 'category',
        span: { end: 'invalid date' },
      }),
    ).toThrow('Invalid end date: invalid date');
  });

  test('work with date context', () => {
    expect(
      acmsPath({ blog: 'blog', category: 'category', date: { year: 2015 } }),
    ).toBe('blog/category/2015/');
    expect(
      acmsPath({
        blog: 'blog',
        category: 'category',
        date: { year: 2015, month: 12 },
      }),
    ).toBe('blog/category/2015/12/');
    expect(
      acmsPath({
        blog: 'blog',
        category: 'category',
        date: { year: 2015, month: 12, day: 19 },
      }),
    ).toBe('blog/category/2015/12/19/');
  });

  test('work with field context', () => {
    expect(
      acmsPath({
        blog: 'blog',
        category: 'category',
        field: 'price/gte/1000/_and_/color/red',
      }),
    ).toBe('blog/category/field/price/gte/1000/_and_/color/red/');
  });

  test('work with order context', () => {
    expect(acmsPath({ blog: 'blog', order: 'id-asc' })).toBe(
      'blog/order/id-asc/',
    );
  });

  test('work with page context', () => {
    expect(acmsPath({ blog: 'blog', category: 'category', page: 1 })).toBe(
      'blog/category/',
    );
    expect(acmsPath({ blog: 'blog', category: 'category', page: 2 })).toBe(
      'blog/category/page/2/',
    );
  });

  test('work with limit context', () => {
    expect(acmsPath({ blog: 'blog', category: 'category', limit: 100 })).toBe(
      'blog/category/limit/100/',
    );
  });

  test('work with tpl context', () => {
    expect(
      acmsPath({
        blog: 'blog',
        category: 'category',
        tpl: 'include/sample.json',
      }),
    ).toBe('blog/category/tpl/include/sample.json');
  });

  test('work with api context', () => {
    expect(acmsPath({ blog: 'blog', api: 'summary_index' })).toBe(
      'blog/api/summary_index/',
    );
  });

  test('work with searchParams context', () => {
    expect(
      acmsPath({
        searchParams: new URLSearchParams({ keyword: 'a-blog cms' }),
      }),
    ).toBe('?keyword=a-blog+cms');
    expect(acmsPath({ searchParams: { foo: '1', bar: '2' } })).toBe(
      '?foo=1&bar=2',
    );
    expect(
      acmsPath({
        searchParams: [
          ['foo', '1'],
          ['bar', '2'],
        ],
      }),
    ).toBe('?foo=1&bar=2');
  });

  test('work with custom segments', () => {
    const params = {
      bid: 1,
      cid: 2,
      eid: 123,
      tag: ['apple', 'grape'],
      page: 2,
      order: 'id-asc',
    };
    const segments = {
      bid: 'custom-bid',
      cid: 'custom-cid',
      eid: 'custom-eid',
      uid: 'custom-uid',
      page: 'custom-page',
    };
    const path = acmsPath(params, { segments });
    expect(path).toContain('custom-bid/1/');
    expect(path).toContain('custom-cid/2/');
    expect(path).toContain('custom-eid/123/');
    expect(path).toContain('custom-page/2/');
    // Ensures default segments are used for those not overridden
    expect(path).toContain('/tag/apple/grape');
    expect(path).toContain('/order/id-asc');
  });
});
