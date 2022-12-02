import './registerServiceWorker';
import './style/base/index.scss';
import * as Vue from 'vue';
import PageRoot from '@/view/page/PageRoot.vue';
import router from '@/script/plugin/router';
import directive from '@/script/plugin/directive';
import events from '@/script/plugin/events';
import PartBase from '@/view/part/PartBase.vue';
import PartLayout from '@/view/part/PartLayout.vue';
import PartText from '@/view/part/PartText.vue';
import IconBase from '@/view/icon/IconBase.vue';
import IconClone from '@/view/icon/IconClone.vue';
import IconConf from '@/view/icon/IconConf.vue';
import IconDown from '@/view/icon/IconDown.vue';
import IconDrag from '@/view/icon/IconDrag.vue';
import IconInbox from '@/view/icon/IconInbox.vue';
import IconLeft from '@/view/icon/IconLeft.vue';
import IconList from '@/view/icon/IconList.vue';
import IconMode from '@/view/icon/IconMode.vue';
import IconMove from '@/view/icon/IconMove.vue';
import IconNext from '@/view/icon/IconNext.vue';
import IconPlus from '@/view/icon/IconPlus.vue';
import IconPrev from '@/view/icon/IconPrev.vue';
import IconRight from '@/view/icon/IconRight.vue';
import IconTrash from '@/view/icon/IconTrash.vue';
import InputTextbox from '@/view/input/InputTextbox.vue';
import InputTextarea from '@/view/input/InputTextarea.vue';
import InputCheck from '@/view/input/InputCheck.vue';
import InputRadio from '@/view/input/InputRadio.vue';
import InputRange from '@/view/input/InputRange.vue';
import InputFile from '@/view/input/InputFile.vue';
import InputButton from '@/view/input/InputButton.vue';
import PopupModal from '@/view/popup/PopupModal.vue';
import PopupCalendar from '@/view/popup/PopupCalendar.vue';
import PopupClock from '@/view/popup/PopupClock.vue';
import PopupDialog from '@/view/popup/PopupDialog.vue';
import PopupNotice from '@/view/popup/PopupNotice.vue';

Vue
  .createApp(PageRoot)
  .use(router)
  .use(directive)
  .use(events)
  .component(`PartBase`, PartBase)
  .component(`PartLayout`, PartLayout)
  .component(`PartText`, PartText)
  .component(`IconBase`, IconBase)
  .component(`IconClone`, IconClone)
  .component(`IconConf`, IconConf)
  .component(`IconDown`, IconDown)
  .component(`IconDrag`, IconDrag)
  .component(`IconInbox`, IconInbox)
  .component(`IconLeft`, IconLeft)
  .component(`IconList`, IconList)
  .component(`IconMode`, IconMode)
  .component(`IconMove`, IconMove)
  .component(`IconNext`, IconNext)
  .component(`IconPlus`, IconPlus)
  .component(`IconPrev`, IconPrev)
  .component(`IconRight`, IconRight)
  .component(`IconTrash`, IconTrash)
  .component(`InputTextbox`, InputTextbox)
  .component(`InputTextarea`, InputTextarea)
  .component(`InputCheck`, InputCheck)
  .component(`InputRadio`, InputRadio)
  .component(`InputRange`, InputRange)
  .component(`InputFile`, InputFile)
  .component(`InputButton`, InputButton)
  .component(`PopupModal`, PopupModal)
  .component(`PopupCalendar`, PopupCalendar)
  .component(`PopupClock`, PopupClock)
  .component(`PopupDialog`, PopupDialog)
  .component(`PopupNotice`, PopupNotice)
  .mount(`#app`);
