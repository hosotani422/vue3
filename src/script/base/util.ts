/**
 * ディープコピー
 * @param item コピー元
 * @returns コピー先
 */
export const copy = <T>(item: T): T => JSON.parse(JSON.stringify(item));

/**
 * JSON判定
 * @param item 判定対象
 * @returns 判定結果
 */
export const isJson = (item: string): boolean => {
  try {
    JSON.parse(item);
  } catch {
    return false;
  }
  return true;
};

/**
 * タプル型生成
 * @param param パラメータ
 * @returns タプル値
 */
export const tuple = <T extends unknown[]>(...param: T): T => param;

/**
 * エラー補足
 */
// window.addEventListener(`error`, (_event: ErrorEvent) => {
//   alert(`${_event.error.toString()}\n${_event.error.stack}`);
// });
