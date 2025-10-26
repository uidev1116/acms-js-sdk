import { describe, expect, it } from 'vitest';
import mergeConfig from './mergeConfig';

describe('mergeConfig', () => {
  it('基本的なマージ', () => {
    const defaults = { a: 1, b: 2 };
    const options = { b: 3 };
    const result = mergeConfig(defaults, options);
    expect(result).toEqual({ a: 1, b: 3 });
  });

  it('ネストされたオブジェクトのマージ', () => {
    const defaults = {
      segments: {
        bid: 'bid',
        cid: 'cid',
        eid: 'eid',
      },
    };
    const options = {
      segments: {
        bid: 'blog',
      },
    };
    const result = mergeConfig(defaults, options);
    expect(result).toEqual({
      segments: {
        bid: 'blog',
        cid: 'cid',
        eid: 'eid',
      },
    });
  });

  it('undefinedの値はスキップされる', () => {
    const defaults = { a: 1, b: 2 };
    const options = { b: undefined };
    const result = mergeConfig(defaults, options);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('配列は上書きされる', () => {
    const defaults = { tags: ['a', 'b'] };
    const options = { tags: ['c'] };
    const result = mergeConfig(defaults, options);
    expect(result).toEqual({ tags: ['c'] });
  });

  it('Dateオブジェクトは上書きされる', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2024-01-01');
    const defaults = { date: date1 };
    const options = { date: date2 };
    const result = mergeConfig(defaults, options);
    expect(result).toEqual({ date: date2 });
  });

  it('nullは上書きされる', () => {
    const defaults = { value: 'test' };
    const options = { value: null };
    const result = mergeConfig(defaults, options);
    expect(result).toEqual({ value: null });
  });

  it('深くネストされたオブジェクトのマージ', () => {
    const defaults = {
      level1: {
        level2: {
          level3: {
            value: 'default',
            other: 'keep',
          },
        },
      },
    };
    const options = {
      level1: {
        level2: {
          level3: {
            value: 'overridden',
          },
        },
      },
    };
    const result = mergeConfig(defaults, options);
    expect(result).toEqual({
      level1: {
        level2: {
          level3: {
            value: 'overridden',
            other: 'keep',
          },
        },
      },
    });
  });

  it('空のオプションオブジェクトはデフォルトを返す', () => {
    const defaults = { a: 1, b: 2 };
    const options = {};
    const result = mergeConfig(defaults, options);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('新しいプロパティが追加される', () => {
    const defaults = { a: 1 };
    const options = { b: 2 };
    const result = mergeConfig(defaults, options);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('元のオブジェクトは変更されない', () => {
    const defaults = { a: 1, nested: { b: 2 } };
    const options = { nested: { b: 3 } };
    mergeConfig(defaults, options);
    expect(defaults).toEqual({ a: 1, nested: { b: 2 } });
  });

  it('複雑なオプションのマージ（acmsPathの使用例）', () => {
    const defaults = {
      segments: {
        bid: 'bid',
        cid: 'cid',
        eid: 'eid',
        uid: 'uid',
        utid: 'utid',
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
      },
    };
    const options = {
      segments: {
        bid: 'blog',
        eid: 'entry',
      },
    };
    const result = mergeConfig(defaults, options);
    expect(result.segments.bid).toBe('blog');
    expect(result.segments.eid).toBe('entry');
    expect(result.segments.cid).toBe('cid');
    expect(result.segments.page).toBe('page');
  });
});
