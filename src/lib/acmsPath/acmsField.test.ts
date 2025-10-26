import { describe, it, expect } from 'vitest';
import AcmsFieldList from './acmsField';
import { type AcmsField } from './types';

describe('AcmsFieldList', () => {
  it('should initialize with an empty list', () => {
    const fieldList = new AcmsFieldList();
    expect(fieldList.getFields()).toEqual([]);
  });

  it('should initialize with a given list of fields', () => {
    const fields: AcmsField[] = [
      {
        key: 'title',
        filters: [{ value: 'test', operator: 'eq', connector: 'and' }],
      },
    ];
    const fieldList = new AcmsFieldList(fields);
    expect(fieldList.getFields()).toEqual(fields);
  });

  it('should push a new field to the list', () => {
    const fieldList = new AcmsFieldList();
    const field: AcmsField = {
      key: 'title',
      filters: [{ value: 'test', operator: 'eq', connector: 'and' }],
    };
    fieldList.push(field);
    expect(fieldList.getFields()).toContain(field);
  });

  it('should pop a field from the list', () => {
    const field: AcmsField = {
      key: 'title',
      filters: [{ value: 'test', operator: 'eq', connector: 'and' }],
    };
    const fieldList = new AcmsFieldList([field]);
    const popped = fieldList.pop();
    expect(popped).toEqual(field);
    expect(fieldList.getFields()).toHaveLength(0);
  });

  it('should shift a field from the list', () => {
    const field1: AcmsField = {
      key: 'title',
      filters: [{ value: 'test', operator: 'eq', connector: 'and' }],
    };
    const field2: AcmsField = {
      key: 'description',
      filters: [{ value: 'sample', operator: 'neq', connector: 'or' }],
    };
    const fieldList = new AcmsFieldList([field1, field2]);
    const shifted = fieldList.shift();
    expect(shifted).toEqual(field1);
    expect(fieldList.getFields()).toEqual([field2]);
  });

  it('should unshift a new field to the list', () => {
    const field1: AcmsField = {
      key: 'title',
      filters: [{ value: 'test', operator: 'eq', connector: 'and' }],
    };
    const field2: AcmsField = {
      key: 'description',
      filters: [{ value: 'sample', operator: 'neq', connector: 'or' }],
    };
    const fieldList = new AcmsFieldList([field1]);
    fieldList.unshift(field2);
    expect(fieldList.getFields()).toEqual([field2, field1]);
  });

  it('should serialize fields with simple operators', () => {
    const fields: AcmsField[] = [
      {
        key: 'price',
        filters: [
          { value: '1000', operator: 'gte', connector: 'and' },
          { value: '500', operator: 'lt', connector: 'or' },
        ],
        separator: '_and_',
      },
    ];
    const field = new AcmsFieldList(fields);
    const result = field.toString();
    expect(result).toBe('price/gte/1000/or/lt/500');
  });

  it('should handle multiple fields with separators', () => {
    const fields: AcmsField[] = [
      {
        key: 'price',
        filters: [{ value: '1000', operator: 'gte', connector: 'and' }],
        separator: '_and_',
      },
      {
        key: 'color',
        filters: [{ value: 'red', operator: 'eq', connector: 'and' }],
        separator: '_or_',
      },
    ];

    const field = new AcmsFieldList(fields);
    const result = field.toString();
    expect(result).toBe('price/gte/1000/_or_/color/eq/red');
  });

  it('should serialize fields with empty values for certain operators', () => {
    const fields: AcmsField[] = [
      {
        key: 'status',
        filters: [{ value: '', operator: 'em', connector: 'and' }],
        separator: '_and_',
      },
    ];

    const field = new AcmsFieldList(fields);
    const result = field.toString();
    expect(result).toBe('status/em');
  });

  it('should handle the case where multiple filters with different connectors exist', () => {
    const fields: AcmsField[] = [
      {
        key: 'price',
        filters: [
          { value: '300', operator: 'gte', connector: 'and' },
          { value: '150', operator: 'lte', connector: 'or' },
        ],
        separator: '_and_',
      },
    ];

    const field = new AcmsFieldList(fields);
    const result = field.toString();
    expect(result).toBe('price/gte/300/or/lte/150');
  });

  it('should handle empty fields correctly', () => {
    const fields: AcmsField[] = [];

    const field = new AcmsFieldList(fields);
    const result = field.toString();
    expect(result).toBe('');
  });

  it('should remove unnecessary separators at the beginning', () => {
    const fields: AcmsField[] = [
      {
        key: 'price',
        filters: [{ value: '1000', operator: 'gte', connector: 'and' }],
        separator: '_and_',
      },
    ];

    const field = new AcmsFieldList(fields);
    const result = field.toString();
    expect(result).toBe('price/gte/1000');
  });

  it('should remove unnecessary separators at the end', () => {
    const fields: AcmsField[] = [
      {
        key: 'price',
        filters: [{ value: '1000', operator: 'gte', connector: 'and' }],
        separator: '_and_',
      },
    ];

    const field = new AcmsFieldList(fields);
    const result = field.toString();
    expect(result).toBe('price/gte/1000');
  });

  it('should handle empty values for certain operators', () => {
    const fields: AcmsField[] = [
      {
        key: 'status',
        filters: [{ value: '', operator: 'em', connector: 'and' }],
        separator: '_and_',
      },
    ];

    const field = new AcmsFieldList(fields);
    const result = field.toString();
    expect(result).toBe('status/em');
  });

  it('should handle the case where multiple filters with different connectors exist', () => {
    const fields: AcmsField[] = [
      {
        key: 'price',
        filters: [
          { value: '300', operator: 'gte', connector: 'and' },
          { value: '150', operator: 'lte', connector: 'or' },
        ],
        separator: '_and_',
      },
    ];

    const field = new AcmsFieldList(fields);
    const result = field.toString();
    expect(result).toBe('price/gte/300/or/lte/150');
  });

  it('should handle empty fields correctly', () => {
    const fields: AcmsField[] = [];

    const field = new AcmsFieldList(fields);
    const result = field.toString();
    expect(result).toBe('');
  });

  // マルチバイト文字列のテスト
  it('should handle multi-byte characters', () => {
    const fields: AcmsField[] = [
      {
        key: 'prefecture',
        filters: [{ value: '愛知県', operator: 'eq', connector: 'and' }],
        separator: '_and_',
      },
    ];

    const field = new AcmsFieldList(fields);
    const result = field.toString();
    expect(result).toBe('prefecture/eq/愛知県');
  });

  it('should handle empty fields gracefully', () => {
    const fieldList = new AcmsFieldList();
    expect(fieldList.toString()).toBe('');
  });

  it('should parse single field and value', () => {
    const input = 'price/100';
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            operator: 'eq',
            value: '100',
            connector: 'or',
          },
        ],
        separator: '_and_',
      },
    ];
    expect(AcmsFieldList.fromString(input).getFields()).toEqual(expected);
  });

  it('should parse multiple values for the same field', () => {
    const input = 'price/200/300/';
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            operator: 'eq',
            value: '200',
            connector: 'or',
          },
          {
            operator: 'eq',
            value: '300',
            connector: 'or',
          },
        ],
        separator: '_and_',
      },
    ];
    expect(AcmsFieldList.fromString(input).getFields()).toEqual(expected);
  });

  it('演算子が eq の場合、operator は強制的に or になる', () => {
    const input = 'price/and/eq/200/eq/300/';
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            operator: 'eq',
            value: '200',
            connector: 'or',
          },
          {
            operator: 'eq',
            value: '300',
            connector: 'or',
          },
        ],
        separator: '_and_',
      },
    ];
    expect(AcmsFieldList.fromString(input).getFields()).toEqual(expected);
  });

  it('should parse operators like lte', () => {
    const input = 'price/lte/300/';
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            operator: 'lte',
            value: '300',
            connector: 'and',
          },
        ],
        separator: '_and_',
      },
    ];
    expect(AcmsFieldList.fromString(input).getFields()).toEqual(expected);
  });

  it('should parse multiple operators', () => {
    const input = 'price/gte/300/lte/100/';
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            operator: 'gte',
            value: '300',
            connector: 'and',
          },
          {
            operator: 'lte',
            value: '100',
            connector: 'and',
          },
        ],
        separator: '_and_',
      },
    ];
    expect(AcmsFieldList.fromString(input).getFields()).toEqual(expected);
  });

  it('should parse single operator', () => {
    const input = 'price/neq/200/';
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            operator: 'neq',
            value: '200',
            connector: 'and',
          },
        ],
        separator: '_and_',
      },
    ];
    expect(AcmsFieldList.fromString(input).getFields()).toEqual(expected);
  });

  it('should parse connector', () => {
    const input = 'price/or/gte/300/or/lte/150/';
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            operator: 'gte',
            value: '300',
            connector: 'or',
          },
          {
            operator: 'lte',
            value: '150',
            connector: 'or',
          },
        ],
        separator: '_and_',
      },
    ];
    expect(AcmsFieldList.fromString(input).getFields()).toEqual(expected);
  });

  it('should handle complex expressions', () => {
    const input = 'price/or/lt/100/100/or/nem//or/gt/300/';
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            operator: 'lt',
            value: '100',
            connector: 'or',
          },
          {
            operator: 'eq',
            value: '100',
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
            value: '300',
            connector: 'or',
          },
        ],
        separator: '_and_',
      },
    ];
    expect(AcmsFieldList.fromString(input).getFields()).toEqual(expected);
  });

  it('should parse "_and_" separators', () => {
    const input = 'price/gte/1000/_and_/color/red/_and_/type/stationery';
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            operator: 'gte',
            value: '1000',
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
    expect(AcmsFieldList.fromString(input).getFields()).toEqual(expected);
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
            value: '300',
            connector: 'or',
          },
          {
            operator: 'lte',
            value: '150',
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
    expect(AcmsFieldList.fromString(input).getFields()).toEqual(expected);
  });

  it('should handle complex expressions with different connectors', () => {
    const input = 'price/or/lt/100/or/gt/300/or/nem';
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            operator: 'lt',
            value: '100',
            connector: 'or',
          },
          {
            operator: 'gt',
            value: '300',
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
    expect(AcmsFieldList.fromString(input).getFields()).toEqual(expected);
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
    expect(AcmsFieldList.fromString(input).getFields()).toEqual(expected);
  });

  it('should be empty field array if "field" is not an array', () => {
    const formData = new FormData();
    formData.append('field', 'not-an-array');

    expect(AcmsFieldList.fromFormData(formData).getFields()).toEqual([]);
  });

  it('should be empty field array  if "field" is not an array of strings', () => {
    const formData = new FormData();
    formData.append('+field[]', '1');

    expect(AcmsFieldList.fromFormData(formData).getFields()).toEqual([]);
  });

  it('should parse FormData correctly and create an AcmsFieldList', () => {
    const formData = new FormData();
    formData.append('field[]', 'title');
    formData.append('title@operator[]', 'eq');
    formData.append('title@connector[]', 'and');
    formData.append('title[]', 'test');
    formData.append('title@separator', '_and_');

    const fieldList = AcmsFieldList.fromFormData(formData);
    const expected: AcmsField[] = [
      {
        key: 'title',
        filters: [
          {
            value: 'test',
            operator: 'eq',
            connector: 'and',
          },
        ],
        separator: '_and_',
      },
    ];

    expect(fieldList.getFields()).toEqual(expected);
  });

  it('should handle multiple fields correctly', () => {
    const formData = new FormData();
    formData.append('field[]', 'title');
    formData.append('field[]', 'description');
    formData.append('title@operator[]', 'eq');
    formData.append('title@connector[]', 'and');
    formData.append('title[]', 'test');
    formData.append('title@separator', '_and_');
    formData.append('description@operator[]', 'neq');
    formData.append('description@connector[]', 'or');
    formData.append('description[]', 'sample');
    formData.append('description@separator', '_or_');

    const fieldList = AcmsFieldList.fromFormData(formData);
    const expected: AcmsField[] = [
      {
        key: 'title',
        filters: [
          {
            value: 'test',
            operator: 'eq',
            connector: 'and',
          },
        ],
        separator: '_and_',
      },
      {
        key: 'description',
        filters: [
          {
            value: 'sample',
            operator: 'neq',
            connector: 'or',
          },
        ],
        separator: '_or_',
      },
    ];

    expect(fieldList.getFields()).toEqual(expected);
  });

  it('should handle same field key', () => {
    const formData = new FormData();
    formData.append('field[]', 'price');
    formData.append('field[]', 'price');
    formData.append('price@operator[]', 'gte');
    formData.append('price@connector[]', 'and');
    formData.append('price[]', '1000');
    formData.append('price@operator[]', 'lt');
    formData.append('price@connector[]', 'or');
    formData.append('price[]', '500');
    formData.append('price@separator', '_and_');

    const fieldList = AcmsFieldList.fromFormData(formData);
    const expected: AcmsField[] = [
      {
        key: 'price',
        filters: [
          {
            value: '1000',
            operator: 'gte',
            connector: 'and',
          },
          {
            value: '500',
            operator: 'lt',
            connector: 'or',
          },
        ],
        separator: '_and_',
      },
    ];

    expect(fieldList.getFields()).toEqual(expected);
  });

  it('should handle empty filters correctly', () => {
    const formData = new FormData();
    formData.append('field[]', 'title');

    const fieldList = AcmsFieldList.fromFormData(formData);
    const expected: AcmsField[] = [
      {
        key: 'title',
        filters: [],
      },
    ];

    expect(fieldList.getFields()).toEqual(expected);
  });

  it('should handle empty field correctly', () => {
    const formData = new FormData();
    formData.append('field[]', '');

    const fieldList = AcmsFieldList.fromFormData(formData);
    expect(fieldList.getFields()).toEqual([]);
  });
});
