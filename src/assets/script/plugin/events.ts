// ロングタップイベント登録
export default {
  install: (): void => {
    let timer = 0;
    document.addEventListener(`touchstart`, (_event: TouchEvent) => {
      timer = window.setTimeout(() => {
        _event.target!.dispatchEvent(new CustomEvent(`lngclick`,
          {bubbles: true, detail: {clientY: _event.changedTouches[0].clientY}}));
        clearTimeout(timer);
      }, 500);
    });
    document.addEventListener(`touchend`, (_event: TouchEvent) => {
      clearTimeout(timer);
    });
    document.addEventListener(`touchmove`, (_event: TouchEvent) => {
      clearTimeout(timer);
    });
  },
};
