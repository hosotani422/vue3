import './registerServiceWorker';
import './assets/style/base/index.scss';
import * as Vue from 'vue';
import view from '@/views/index.vue';
import router from '@/assets/script/plugin/router';
import directive from '@/assets/script/plugin/directive';
import events from '@/assets/script/plugin/events';
import FormButton from '@/components/form/form-button.vue';
import FormCheckbox from '@/components/form/form-checkbox.vue';
import FormRadiobox from '@/components/form/form-radiobox.vue';
import FormRange from '@/components/form/form-range.vue';
import FormTextarea from '@/components/form/form-textarea.vue';
import FormTextbox from '@/components/form/form-textbox.vue';

const app = Vue
  .createApp(view)
  .use(router)
  .use(directive)
  .use(events)
  .component(`FormButton`, FormButton)
  .component(`FormCheckbox`, FormCheckbox)
  .component(`FormRadiobox`, FormRadiobox)
  .component(`FormRange`, FormRange)
  .component(`FormTextarea`, FormTextarea)
  .component(`FormTextbox`, FormTextbox);
app.mount(`#app`);
export default app;
