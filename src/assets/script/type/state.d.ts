import {state as PageState} from '@/store/pages/page';
import {state as DialogState} from '@/store/popup/dialog';
import {state as DateState} from '@/store/popup/date';
import {state as TimeState} from '@/store/popup/time';
import {state as NoticeState} from '@/store/popup/notice';

declare global {
  interface RootState {
    route: any;
    pages: {
      page: ReturnType<typeof PageState>;
    };
    popup: {
      dialog: ReturnType<typeof DialogState>;
      date: ReturnType<typeof DateState>;
      time: ReturnType<typeof TimeState>;
      notice: ReturnType<typeof NoticeState>;
    };
  }
}
