import { encodeUri } from '../../utils';
import { type AcmsField } from './types';

export default function stringifyAcmsFieldCollection(
  fields: AcmsField[],
): string {
  const queries: string[] = [];

  fields.forEach((field) => {
    const { key, filters, separator } = field;

    const values = filters.map((filter) => filter.value);
    const operators = filters.map((filter) => filter.operator);
    const connectors = filters.map((filter) => filter.connector);

    const count = Math.max(values.length, operators.length, connectors.length);
    if (count === 0) {
      return; // フィルタが空の場合はスキップ
    }

    let empty = 0;
    const buf: string[] = [];

    for (let i = 0; i < count; i++) {
      const value = values[i] ?? '';
      const operator = operators[i] ?? '';
      const connector = connectors[i] ?? '';

      switch (operator) {
        case 'eq':
        case 'neq':
        case 'lt':
        case 'lte':
        case 'gt':
        case 'gte':
        case 'lk':
        case 'nlk':
        case 're':
        case 'nre':
          if (value !== '') {
            // 空のトークンがあれば埋める
            for (let j = 0; j < empty; j++) {
              buf.push('');
            }
            empty = 0;

            if (connector === 'or') {
              if (operator !== 'eq') {
                buf.push('or');
                buf.push(operator);
              }
              buf.push(String(value));
            } else {
              buf.push(operator);
              buf.push(String(value));
            }
          } else {
            empty++;
          }
          break;
        case 'em':
        case 'nem':
          // 空のトークンがあれば埋める
          for (let j = 0; j < empty; j++) {
            buf.push('');
          }
          empty = 0;

          if (connector === 'or') {
            buf.push('or');
          }
          buf.push(operator);
          break;
        default:
          buf.push('');
      }
    }

    const aryTmp: string[] = [];
    if (buf.length > 0) {
      // セパレーターが 'or' であれば _or_、それ以外は _and_ とする
      aryTmp.push(separator ?? '_and_');
      aryTmp.push(key);

      // バッファに貯めたトークンを追加
      buf.forEach((token) => {
        aryTmp.push(token);
      });

      // 結果に追加
      queries.push(...aryTmp);
    }
  });

  // 不要な '_or_' や '_and_' を取り除く
  if (queries.length > 0 && ['_or_', '_and_', 'and'].includes(queries[0])) {
    queries.shift();
  }

  // スラッシュで結合して文字列を返す
  return queries.map(encodeUri).join('/');
}
