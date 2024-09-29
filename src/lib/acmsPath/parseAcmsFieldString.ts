import {
  isOperator,
  type AcmsFieldFilter,
  type AcmsField,
  isConnector,
  isSeparator,
  type Separator,
  type Operator,
  type Connector,
  isAcmsFieldFilter,
} from './types';

export default function parseAcmsFieldString(input: string): AcmsField[] {
  // 末尾の不要な '/' を削除
  const tokens = input.replace(/\/$/, '').split(/(?<!\\)\//);

  let filter: Partial<AcmsFieldFilter> = {};
  let key: string | null = null;
  let connector: Connector | null = null;
  let operator: Operator | null = null;
  let value: string | null = null;
  let separator: Separator | null = null;
  let tmpSeparator: Separator | null = null;

  const fields: AcmsField[] = [];

  while (tokens.length > 0) {
    const token = tokens.shift();

    if (token === undefined) {
      continue;
    }

    // ① keyの判定処理
    // keyが未定義の場合、このトークンをフィールド名として扱う
    if (key === null) {
      key = token;

      if (tmpSeparator != null && isSeparator(tmpSeparator)) {
        separator = tmpSeparator;
      } else {
        separator = '_and_';
      }

      // 新しいフィールドのエントリを作成し、結果配列に追加
      fields.push({
        key,
        filters: [],
        separator,
      });

      tmpSeparator = null; // 一時セパレーターをリセット
      separator = null; // セパレーターをリセット
      continue;
    }

    // トークンが空の場合、operatorが未定義ならデフォルト値を設定
    if (token === '') {
      if (connector === null) {
        connector = null;
        operator = null;
      } else if (operator === null) {
        operator = 'eq';
      }
    }

    // ② operator（演算子）の判定処理
    // operatorが未定義の場合、次のトークンをoperatorとして処理
    if (operator === null) {
      switch (token) {
        case 'eq':
          operator = token;
          connector = 'or'; // eqの場合、connectorは強制的にor
          break;
        case 'neq':
        case 'lt':
        case 'lte':
        case 'gt':
        case 'gte':
        case 'lk':
        case 'nlk':
        case 're':
        case 'nre':
          operator = token;
          break;
        case 'em':
        case 'nem':
          operator = token;
          value = ''; // em, nemの場合、値は空文字列
          break;
      }

      // operatorが見つかった場合、connectorが未定義ならデフォルト値を設定
      if (operator !== null) {
        if (connector === null) {
          connector = 'and';
        }
        if (value === null) {
          continue; // 次のトークンを処理するためcontinue
        }
      }
    }

    // ③ connector(and/or)の判定処理
    if (connector === null) {
      if (isConnector(token)) {
        // 'or'が見つかった場合、それをconnectorとして設定
        connector = token;
        continue;
      } else {
        // 'or'が見つからなかった場合
        connector = 'or';
        if (operator === null) {
          // phpとの変更点
          operator = 'eq';
        }
        value = token; // 値としてトークンを設定
      }
    }

    // 値が未定義の場合、デフォルトのoperator 'eq'を設定して値を設定
    if (value === null) {
      if (operator === null) {
        // 値及び演算子がない場合は eq として扱う
        operator = 'eq';
      }
      value = token;
    } else if (['and', '_and_', '_or_'].includes(token)) {
      // セパレーターが見つかった場合、一時的なセパレーターとして設定
      tmpSeparator = token === 'and' ? '_and_' : (token as Separator);

      // 次のフィールドの処理のためにリセット
      key = null;
      connector = null;
      operator = null;
      value = null;

      continue;
    }

    if (key !== '') {
      if (isOperator(operator)) {
        filter = {
          ...filter,
          operator,
        };
      }
      if (value !== null) {
        filter = {
          ...filter,
          value: isNaN(parseInt(value, 10)) ? value : parseInt(value, 10),
        };
      }

      if (isConnector(connector)) {
        filter = {
          ...filter,
          connector,
        };
      }
      const current = fields.find((field) => field.key === key);
      if (current !== undefined && isAcmsFieldFilter(filter)) {
        current.filters = [...current.filters, filter];
      }
    }

    // 次のトークンの処理のためにリセット
    connector = null;
    operator = null;
    value = null;
  }

  return fields;
}
