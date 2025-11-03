import { parseFormData, unique } from '../../utils';
import {
  isSeparator,
  type AcmsField,
  type AcmsFilter,
  type Connector,
  type Operator,
  type Separator,
  isConnector,
  isOperator,
  isAcmsFilter,
} from './types';
import { splitPath } from './utils';

export default class AcmsFieldList {
  private readonly fields: AcmsField[] = [];

  public constructor(fields: AcmsField[] = []) {
    this.fields = fields;
  }

  public push(field: AcmsField) {
    this.fields.push(field);
  }

  public pop(): AcmsField | undefined {
    return this.fields.pop();
  }

  public shift(): AcmsField | undefined {
    return this.fields.shift();
  }

  public unshift(field: AcmsField) {
    this.fields.unshift(field);
  }

  public getFields(): AcmsField[] {
    return this.fields;
  }

  public toString(): string {
    const queries: string[] = [];

    this.fields.forEach((field) => {
      const { key, filters, separator } = field;

      const values = filters.map((filter) => filter.value);
      const operators = filters.map((filter) => filter.operator);
      const connectors = filters.map((filter) => filter.connector);

      const count = Math.max(
        values.length,
        operators.length,
        connectors.length,
      );
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
    return queries.join('/');
  }

  public static fromString(input: string): AcmsFieldList {
    const tokens = splitPath(input);

    let filter: Partial<AcmsFilter> = {};
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
          default:
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
            value,
          };
        }

        if (isConnector(connector)) {
          filter = {
            ...filter,
            connector,
          };
        }

        const current = fields.find((field) => field.key === key);
        if (current !== undefined && isAcmsFilter(filter)) {
          current.filters = [...current.filters, filter];
        }
      }

      // 次のトークンの処理のためにリセット
      connector = null;
      operator = null;
      value = null;
    }

    return new AcmsFieldList(fields);
  }

  public static fromFormData(formData: FormData): AcmsFieldList {
    const data = parseFormData(formData);
    if (!Array.isArray(data.field)) {
      return new AcmsFieldList();
    }

    if (!data.field.every((f) => typeof f === 'string')) {
      return new AcmsFieldList();
    }

    const fieldNames = unique(
      data.field.filter((fieldName) => fieldName !== ''),
    );
    const fields: AcmsField[] = fieldNames.map((fieldName) => {
      const operatorKey = `${fieldName}@operator`;
      const connectorKey = `${fieldName}@connector`;
      const separatorKey = `${fieldName}@separator`;
      const valueKey = fieldName;

      const operators = Array.isArray(data[operatorKey])
        ? data[operatorKey]
        : [];
      const connectors = Array.isArray(data[connectorKey])
        ? data[connectorKey]
        : [];
      const values = Array.isArray(data[valueKey]) ? data[valueKey] : [];
      const separator = isSeparator(data[separatorKey])
        ? data[separatorKey]
        : '_and_';

      const count = Math.max(
        operators.length,
        connectors.length,
        values.length,
      );
      if (count === 0) {
        return { key: fieldName, filters: [] };
      }

      let defaultConnector: Connector = 'and';
      let defaultOperator: Operator = 'eq';

      if (connectors.length === 0 && operators.length === 0) {
        defaultConnector = 'or';
      }
      if (connectors.length > 0 && isConnector(connectors[0])) {
        defaultConnector = connectors[0];
      }

      if (operators.length > 0 && isOperator(operators[0])) {
        defaultOperator = operators[0];
      }

      const filters: AcmsFilter[] = [];
      for (let i = 0; i < count; i++) {
        const value = values[i] as string;
        const operator: Operator = isOperator(operators[i])
          ? (operators[i] as Operator)
          : defaultOperator;
        const connector: Connector = isConnector(connectors[i])
          ? (connectors[i] as Connector)
          : defaultConnector;

        filters.push({
          value,
          operator,
          connector,
        });
      }

      return {
        key: fieldName,
        filters,
        separator,
      };
    });

    return new AcmsFieldList(fields);
  }
}
