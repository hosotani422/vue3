/**
 * querySelectorの省略記法
 * @param selectors セレクター
 * @returns 要素
 */
export const get = (selectors: string): HTMLElement | null =>
  document.querySelector(selectors);

/**
 * querySelectorAllの省略記法
 * @param selectors セレクター
 * @returns 要素リスト
 */
export const gets = (selectors: string): NodeListOf<HTMLElement> =>
  document.querySelectorAll(selectors);

/**
 * 要素を適した大きさにリサイズ
 * @param element 要素
 */
export const resize = (element: HTMLElement): void => {
  element.style.height = `0px`;
  element.style.height = `${element.scrollHeight}px`;
};
