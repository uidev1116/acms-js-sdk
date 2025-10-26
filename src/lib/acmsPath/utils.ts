export function formatDate(date: Date) {
  function twoDigits(num: number) {
    return num < 10 ? `0${num}` : num;
  }

  const year = date.getFullYear();
  const month = twoDigits(date.getMonth() + 1); // JavaScriptの月は0から始まるため、1を加える
  const day = twoDigits(date.getDate());
  const hours = twoDigits(date.getHours());
  const minutes = twoDigits(date.getMinutes());
  const seconds = twoDigits(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function splitPath(path: string): string[] {
  if (path.startsWith('/')) {
    path = path.substring(1);
  }
  const result: string[] = [];
  let buffer: string = '';
  let isEscaped: boolean = false;
  for (let i = 0; i < path.length; i++) {
    const char = path[i];
    if (char === '\\' && !isEscaped) {
      // バックスラッシュを見つけたらエスケープ状態にする
      isEscaped = true;
      buffer += char; // バックスラッシュもバッファに追加
    } else if (char === '/' && !isEscaped) {
      // エスケープされていないスラッシュで分割
      result.push(buffer);
      buffer = '';
    } else {
      // 通常の文字をバッファに追加
      buffer += char;
      isEscaped = false; // 1文字進んだらエスケープ状態を解除
    }
  }
  // 最後の部分を追加
  if (buffer.length > 0) {
    result.push(buffer);
  }
  return result;
}
