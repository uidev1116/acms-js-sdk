import { describe, it, expect } from 'vitest';
import parseAcmsFieldString from './parseAcmsFieldString';
import { type AcmsField } from './types';

describe('parseAcmsFieldString', () => {
  it('should parse single field and value', () => {
    const input = 'price/100';
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            operator: 'eq',
            value: 100,
            connector: 'or',
          },
        ],
        separator: '_and_',
      },
    ];
    expect(parseAcmsFieldString(input)).toEqual(expected);
  });

  it('should parse multiple values for the same field', () => {
    const input = 'price/200/300/';
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            operator: 'eq',
            value: 200,
            connector: 'or',
          },
          {
            operator: 'eq',
            value: 300,
            connector: 'or',
          },
        ],
        separator: '_and_',
      },
    ];
    expect(parseAcmsFieldString(input)).toEqual(expected);
  });

  it('演算子が eq の場合、operator は強制的に or になる', () => {
    const input = 'price/and/eq/200/eq/300/';
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            operator: 'eq',
            value: 200,
            connector: 'or',
          },
          {
            operator: 'eq',
            value: 300,
            connector: 'or',
          },
        ],
        separator: '_and_',
      },
    ];
    expect(parseAcmsFieldString(input)).toEqual(expected);
  });

  it('should parse operators like lte', () => {
    const input = 'price/lte/300/';
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            operator: 'lte',
            value: 300,
            connector: 'and',
          },
        ],
        separator: '_and_',
      },
    ];
    expect(parseAcmsFieldString(input)).toEqual(expected);
  });

  it('should parse multiple operators', () => {
    const input = 'price/gte/300/lte/100/';
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            operator: 'gte',
            value: 300,
            connector: 'and',
          },
          {
            operator: 'lte',
            value: 100,
            connector: 'and',
          },
        ],
        separator: '_and_',
      },
    ];
    expect(parseAcmsFieldString(input)).toEqual(expected);
  });

  it('should parse single operator', () => {
    const input = 'price/neq/200/';
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            operator: 'neq',
            value: 200,
            connector: 'and',
          },
        ],
        separator: '_and_',
      },
    ];
    expect(parseAcmsFieldString(input)).toEqual(expected);
  });

  it('should parse connector', () => {
    const input = 'price/or/gte/300/or/lte/150/';
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            operator: 'gte',
            value: 300,
            connector: 'or',
          },
          {
            operator: 'lte',
            value: 150,
            connector: 'or',
          },
        ],
        separator: '_and_',
      },
    ];
    expect(parseAcmsFieldString(input)).toEqual(expected);
  });

  it('should handle complex expressions', () => {
    const input = 'price/or/lt/100/100/or/nem//or/gt/300/';
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            operator: 'lt',
            value: 100,
            connector: 'or',
          },
          {
            operator: 'eq',
            value: 100,
            connector: 'or',
          },
          {
            operator: 'nem',
            value: '',
            connector: 'or',
          },
          {
            operator: 'eq',
            value: '',
            connector: 'or',
          },
          {
            operator: 'gt',
            value: 300,
            connector: 'or',
          },
        ],
        separator: '_and_',
      },
    ];
    expect(parseAcmsFieldString(input)).toEqual(expected);
  });

  it('should parse "_and_" separators', () => {
    const input = 'price/gte/1000/_and_/color/red/_and_/type/stationery';
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            operator: 'gte',
            value: 1000,
            connector: 'and',
          },
        ],
        separator: '_and_',
      },
      {
        key: 'color',
        filters: [
          {
            operator: 'eq',
            value: 'red',
            connector: 'or',
          },
        ],
        separator: '_and_',
      },
      {
        key: 'type',
        filters: [
          {
            operator: 'eq',
            value: 'stationery',
            connector: 'or',
          },
        ],
        separator: '_and_',
      },
    ];
    expect(parseAcmsFieldString(input)).toEqual(expected);
  });

  it('should parse "_or_" separators', () => {
    const input =
      'price/or/gte/300/or/lte/150/_or_/color/and/lk/red/and/lk/blue/_or_/type/stationery';
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            operator: 'gte',
            value: 300,
            connector: 'or',
          },
          {
            operator: 'lte',
            value: 150,
            connector: 'or',
          },
        ],
        separator: '_and_', // 1つ目のフィールドは _and_ で固定（separaterは２つ目以上のフィールドがあって初めて機能するため）
      },
      {
        key: 'color',
        filters: [
          {
            operator: 'lk',
            value: 'red',
            connector: 'and',
          },
          {
            operator: 'lk',
            value: 'blue',
            connector: 'and',
          },
        ],
        separator: '_or_',
      },
      {
        key: 'type',
        filters: [
          {
            operator: 'eq',
            value: 'stationery',
            connector: 'or',
          },
        ],
        separator: '_or_',
      },
    ];
    expect(parseAcmsFieldString(input)).toEqual(expected);
  });

  it('should handle complex expressions with different connectors', () => {
    const input = 'price/or/lt/100/or/gt/300/or/nem';
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            operator: 'lt',
            value: 100,
            connector: 'or',
          },
          {
            operator: 'gt',
            value: 300,
            connector: 'or',
          },
          {
            operator: 'nem',
            value: '',
            connector: 'or',
          },
        ],
        separator: '_and_',
      },
    ];
    expect(parseAcmsFieldString(input)).toEqual(expected);
  });

  it('should handle escaped value', () => {
    const input = 'kataban/eq/PDW-850\\/1 SYM';
    const expected: AcmsField[] = [
      {
        key: 'kataban',
        filters: [
          {
            operator: 'eq',
            value: 'PDW-850\\/1 SYM',
            connector: 'or',
          },
        ],
        separator: '_and_',
      },
    ];
    expect(parseAcmsFieldString(input)).toEqual(expected);
  });
});
