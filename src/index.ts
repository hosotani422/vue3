import '@/style/base/index.scss';
import * as Vue from 'vue';
import PageRoot from '@/components/page/PageRoot.vue';
import PartBase from '@/components/part/PartBase.vue';
import PartLayout from '@/components/part/PartLayout.vue';
import PartText from '@/components/part/PartText.vue';
import IconBase from '@/components/icon/IconBase.vue';
import IconClone from '@/components/icon/IconClone.vue';
import IconConf from '@/components/icon/IconConf.vue';
import IconDown from '@/components/icon/IconDown.vue';
import IconDrag from '@/components/icon/IconDrag.vue';
import IconInbox from '@/components/icon/IconInbox.vue';
import IconLeft from '@/components/icon/IconLeft.vue';
import IconList from '@/components/icon/IconList.vue';
import IconMode from '@/components/icon/IconMode.vue';
import IconMove from '@/components/icon/IconMove.vue';
import IconNext from '@/components/icon/IconNext.vue';
import IconPlus from '@/components/icon/IconPlus.vue';
import IconPrev from '@/components/icon/IconPrev.vue';
import IconRight from '@/components/icon/IconRight.vue';
import IconTrash from '@/components/icon/IconTrash.vue';
import InputTextbox from '@/components/input/InputTextbox.vue';
import InputTextarea from '@/components/input/InputTextarea.vue';
import InputCheck from '@/components/input/InputCheck.vue';
import InputRadio from '@/components/input/InputRadio.vue';
import InputRange from '@/components/input/InputRange.vue';
import InputFile from '@/components/input/InputFile.vue';
import InputButton from '@/components/input/InputButton.vue';
import PopupModal from '@/components/popup/PopupModal.vue';
import PopupCalendar from '@/components/popup/PopupCalendar.vue';
import PopupClock from '@/components/popup/PopupClock.vue';
import PopupDialog from '@/components/popup/PopupDialog.vue';
import PopupNotice from '@/components/popup/PopupNotice.vue';
import router from '@/script/plugin/router';
import directive from '@/script/plugin/directive';
import events from '@/script/plugin/events';

export const vm = Vue
  .createApp(PageRoot)
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
  .use(router)
  .use(directive)
  .use(events)
  .mount(`#app`);
