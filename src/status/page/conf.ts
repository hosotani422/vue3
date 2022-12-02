import * as Util from '@/script/base/util';
import * as Cordova from '@/script/cordova/cordova';
import Global from '@/script/base/global';
import * as Const from '@/script/const/const';
import * as Lang from '@/script/lang/lang';
import * as dialog from '@/status/popup/dialog';
import * as root from '@/status/page/root';

export const action = {
  downloadBackup: (payload: {$event: Event;}): void => {
    const data = `${localStorage.getItem(`route`) || Const.Init.listId}\n` +
      `${localStorage.getItem(`list`) || JSON.stringify(Const.Init.list)}\n` +
      `${localStorage.getItem(`conf`) || JSON.stringify(Const.Init.conf)}`;
    if (process.env.VUE_APP_MODE !== `app`) {
      (payload.$event.currentTarget as HTMLElement).setAttribute(`download`, Const.Base.backup);
      (payload.$event.currentTarget as HTMLElement).setAttribute(`href`, `data:text/plain,${encodeURIComponent(data)}`);
    } else {
      Cordova.File.write(Const.Base.backup, data,
        (filePath) => {
          dialog.action.open({
            mode: `alert`,
            title: Lang[root.state.conf.lang].dialog.backup,
            message: filePath,
            cancel: {
              name: Lang[root.state.conf.lang].common.ok,
              callback: () => {
                dialog.action.close();
              },
            },
          });
        }, (errorCode) => {
          dialog.action.open({
            mode: `alert`,
            title: Lang[root.state.conf.lang].dialog.backupError,
            message: String(errorCode),
            cancel: {
              name: Lang[root.state.conf.lang].common.ok,
              callback: () => {
                dialog.action.close();
              },
            },
          });
        });
    }
  },
  uploadBackup: (payload: {$event: Event;}): void => {
    const reader = new FileReader();
    reader.onload = (_event: any) => {
      const fileList = _event.target.result.split(`\n`);
      if (fileList.length === 3 && Util.isJson(fileList[1]) && Util.isJson(fileList[2])) {
        root.state.conf = JSON.parse(fileList[2]);
        root.state.list = JSON.parse(fileList[1]);
        root.action.routerMain({listId: fileList[0]});
        root.action.saveConf();
        root.action.saveList();
      } else {
        dialog.action.open({
          mode: `alert`,
          title: Lang[root.state.conf.lang].dialog.fileError,
          message: ``,
          cancel: {
            name: Lang[root.state.conf.lang].common.ok,
            callback: () => {
              dialog.action.close();
            },
          },
        });
      }
    };
    reader.readAsText((payload.$event.target as any).files[0]);
  },
  resetConf: (): void => {
    dialog.action.open({
      mode: `confirm`,
      title: Lang[root.state.conf.lang].dialog.reset,
      message: ``,
      ok: {
        name: Lang[root.state.conf.lang].common.ok,
        callback: () => {
          dialog.action.close();
          root.state.conf = Const.Init.conf;
          root.action.saveConf();
        },
      },
      cancel: {
        name: Lang[root.state.conf.lang].common.cancel,
        callback: () => {
          dialog.action.close();
        },
      },
    });
  },
  resetList: (): void => {
    dialog.action.open({
      mode: `confirm`,
      title: Lang[root.state.conf.lang].dialog.reset,
      message: ``,
      ok: {
        name: Lang[root.state.conf.lang].common.ok,
        callback: () => {
          dialog.action.close();
          root.state.list = Const.Init.list;
          root.action.routerMain({listId: Const.Init.listId});
          root.action.saveList();
        },
      },
      cancel: {
        name: Lang[root.state.conf.lang].common.cancel,
        callback: () => {
          dialog.action.close();
        },
      },
    });
  },
  swipeInit: (payload: {$event: TouchEvent;}): void => {
    const item = (payload.$event.currentTarget as HTMLElement).getBoundingClientRect();
    Global.swipe.status = Global.swipe.status === `end` ? `move` : `start`;
    Global.swipe.target = payload.$event.currentTarget as HTMLElement;
    Global.swipe.x = payload.$event.changedTouches[0].clientX;
    Global.swipe.y = payload.$event.changedTouches[0].clientY;
    Global.swipe.side = item.top + (item.height / 2);
    if (Global.swipe.status === `move`) {
      Global.swipe.target!.removeEventListener(`transitionend`, Global.swipe.listener!);
      Global.swipe.target!.classList.remove(`v-enter-active`);
      Global.swipe.target!.style.transform = `translateY(${Global.swipe.side}px)`;
    }
  },
  swipeStart: (payload: {$event: TouchEvent;}): void => {
    if (Global.swipe.status === `start`) {
      if (Math.abs(payload.$event.changedTouches[0].clientX - Global.swipe.x!) +
        Math.abs(payload.$event.changedTouches[0].clientY - Global.swipe.y!) > 15) {
        Math.abs(payload.$event.changedTouches[0].clientX - Global.swipe.x!) <
        Math.abs(payload.$event.changedTouches[0].clientY - Global.swipe.y!) ?
          (Global.swipe.status = `move`) : (Global.swipe = {});
      }
    }
  },
  swipeMove: (payload: {$event: TouchEvent;}): void => {
    if (Global.swipe.status === `move`) {
      const y = Global.swipe.side! + payload.$event.changedTouches[0].clientY - Global.swipe.y!;
      Global.swipe.target!.style.transform = `translateY(${y > 0 ? y : 0}px)`;
    }
  },
  swipeEnd: (payload: {$event: TouchEvent;}): void => {
    if (Global.swipe.status === `move`) {
      Global.swipe.status = `end`;
      if (Global.swipe.side! + payload.$event.changedTouches[0].clientY - Global.swipe.y! > 100) {
        root.action.routerBack();
        Global.swipe = {};
      } else {
        Global.swipe.target!.style.transform = ``;
        Global.swipe.target!.classList.add(`v-enter-active`);
        Global.swipe.target!.addEventListener(`transitionend`, (Global.swipe.listener = () => {
          Global.swipe.target!.removeEventListener(`transitionend`, Global.swipe.listener!);
          Global.swipe.target!.classList.remove(`v-enter-active`);
          Global.swipe = {};
        }));
      }
    } else {
      Global.swipe = {};
    }
  },
};
