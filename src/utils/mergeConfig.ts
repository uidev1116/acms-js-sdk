/**
 * 設定オブジェクトを深くマージする関数
 * @param defaults - デフォルト設定
 * @param overrides - マージする設定（優先される）
 * @returns マージされた設定
 */
function mergeConfig(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaults: Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overrides: Record<string, any>,
) {
  const result = { ...defaults };

  for (const key in overrides) {
    if (Object.prototype.hasOwnProperty.call(overrides, key)) {
      const overrideValue = overrides[key];
      const defaultValue = defaults[key];

      // undefined の場合はスキップ
      if (overrideValue === undefined) {
        continue;
      }

      // 両方がプレーンオブジェクトの場合は再帰的にマージ
      if (isPlainObject(overrideValue) && isPlainObject(defaultValue)) {
        result[key] = mergeConfig(defaultValue, overrideValue);
      } else {
        // それ以外は上書き（配列や基本型など）
        result[key] = overrideValue;
      }
    }
  }

  return result;
}

export default mergeConfig;

/**
 * プレーンオブジェクトかどうかを判定する
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPlainObject(value: any): value is Record<string, any> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  // 配列やDate、その他の特殊なオブジェクトは除外
  if (
    Array.isArray(value) ||
    value instanceof Date ||
    value instanceof RegExp
  ) {
    return false;
  }

  // プロトタイプがObjectまたはnullの場合のみtrue
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}
