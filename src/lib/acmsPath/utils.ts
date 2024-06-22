export function formatDate(date: Date) {
  function twoDigits(num: number) {
    return num < 10 ? '0' + num : num;
  }

  const year = date.getFullYear();
  const month = twoDigits(date.getMonth() + 1); // JavaScriptの月は0から始まるため、1を加える
  const day = twoDigits(date.getDate());
  const hours = twoDigits(date.getHours());
  const minutes = twoDigits(date.getMinutes());
  const seconds = twoDigits(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
