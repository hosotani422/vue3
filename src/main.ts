import * as Vue from 'vue';
import * as VuexRouter from 'vuex-router-sync';
import App from './App.vue';
import router from './router';
import store from './store';
import directive from '@/assets/script/directive';
import './registerServiceWorker';
import './assets/style/base/index.scss';
import '@/assets/script/event';
import FormButton from '@/components/form/form-button.vue';
import FormCheckbox from '@/components/form/form-checkbox.vue';
import FormRadiobox from '@/components/form/form-radiobox.vue';
import FormRange from '@/components/form/form-range.vue';
import FormTextarea from '@/components/form/form-textarea.vue';
import FormTextbox from '@/components/form/form-textbox.vue';

router.beforeEach((_to: any, _from: any, _next: any) => {
  const paramId = _to.params?.listId;
  const stateId = store.state.pages.page.listId;
  _next(paramId && stateId && paramId !== stateId ? (() => {
    const path = _to.path.split(`/`);
    path.splice(1, 1, stateId);
    return path.join(`/`);
  })() : true);
});

VuexRouter.sync(store, router);

Vue
  .createApp(App)
  .use(store)
  .use(router)
  .use(directive)
  .component(`FormButton`, FormButton)
  .component(`FormCheckbox`, FormCheckbox)
  .component(`FormRadiobox`, FormRadiobox)
  .component(`FormRange`, FormRange)
  .component(`FormTextarea`, FormTextarea)
  .component(`FormTextbox`, FormTextbox)
  .mount(`#app`);
