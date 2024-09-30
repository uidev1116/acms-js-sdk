import { describe, it, expect } from 'vitest';
import stringifyAcmsFieldCollection from './stringifyAcmsFieldCollection';
import { type AcmsField } from './types';

describe('stringifyAcmsFieldCollection', () => {
  it('should serialize fields with simple operators', () => {
    const fields: AcmsField[] = [
      {
        key: 'price',
        filters: [
          { value: 1000, operator: 'gte', connector: 'and' },
          { value: 500, operator: 'lt', connector: 'or' },
        ],
        separator: '_and_',
      },
    ];

    const result = stringifyAcmsFieldCollection(fields);
    expect(result).toBe('price/gte/1000/or/lt/500');
  });

  it('should handle multiple fields with separators', () => {
    const fields: AcmsField[] = [
      {
        key: 'price',
        filters: [{ value: 1000, operator: 'gte', connector: 'and' }],
        separator: '_and_',
      },
      {
        key: 'color',
        filters: [{ value: 'red', operator: 'eq', connector: 'and' }],
        separator: '_or_',
      },
    ];

    const result = stringifyAcmsFieldCollection(fields);
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

    const result = stringifyAcmsFieldCollection(fields);
    expect(result).toBe('status/em');
  });

  it('should handle the case where multiple filters with different connectors exist', () => {
    const fields: AcmsField[] = [
      {
        key: 'price',
        filters: [
          { value: 300, operator: 'gte', connector: 'and' },
          { value: 150, operator: 'lte', connector: 'or' },
        ],
        separator: '_and_',
      },
    ];

    const result = stringifyAcmsFieldCollection(fields);
    expect(result).toBe('price/gte/300/or/lte/150');
  });

  it('should handle empty fields correctly', () => {
    const fields: AcmsField[] = [];

    const result = stringifyAcmsFieldCollection(fields);
    expect(result).toBe('');
  });

  it('should remove unnecessary separators at the beginning', () => {
    const fields: AcmsField[] = [
      {
        key: 'price',
        filters: [{ value: 1000, operator: 'gte', connector: 'and' }],
        separator: '_and_',
      },
    ];

    const result = stringifyAcmsFieldCollection(fields);
    expect(result).toBe('price/gte/1000');
  });

  it('should remove unnecessary separators at the end', () => {
    const fields: AcmsField[] = [
      {
        key: 'price',
        filters: [{ value: 1000, operator: 'gte', connector: 'and' }],
        separator: '_and_',
      },
    ];

    const result = stringifyAcmsFieldCollection(fields);
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

    const result = stringifyAcmsFieldCollection(fields);
    expect(result).toBe('status/em');
  });

  it('should handle the case where multiple filters with different connectors exist', () => {
    const fields: AcmsField[] = [
      {
        key: 'price',
        filters: [
          { value: 300, operator: 'gte', connector: 'and' },
          { value: 150, operator: 'lte', connector: 'or' },
        ],
        separator: '_and_',
      },
    ];

    const result = stringifyAcmsFieldCollection(fields);
    expect(result).toBe('price/gte/300/or/lte/150');
  });

  it('should handle empty fields correctly', () => {
    const fields: AcmsField[] = [];

    const result = stringifyAcmsFieldCollection(fields);
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

    const result = stringifyAcmsFieldCollection(fields);
    expect(result).toBe('prefecture/eq/%E6%84%9B%E7%9F%A5%E7%9C%8C');
  });
});
