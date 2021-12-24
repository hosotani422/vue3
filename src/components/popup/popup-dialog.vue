<script lang='ts'>
import * as Vue from 'vue';
import * as Lang from '@/assets/script/lang/lang';
import * as page from '@/composition/pages/page';
import * as dialog from '@/composition/popup/dialog';
export default Vue.defineComponent({
  setup: () => ({
    ...dialog,
    lang: Vue.computed(() => Lang[page.state.conf.lang as `jp` | `en`]),
  }),
});
</script>

<template lang='html'>
<transition name="fade">
  <div class="popup-dialog" v-if="state.open">
    <div class="home">
      <h4 class="head" v-if="state.title">{{state.title}}</h4>
      <div class="body">
        <p class="label" v-if="state.message">{{state.message}}</p>
        <FormTextbox class="text" :placeholder="state.text.placeholder"
          v-model="state.text.value" v-focus v-if="state.mode===`text`"></FormTextbox>
        <FormCheckbox class="check" :modelValue="getter.stateCheckAll.value()"
          @change="action.clickCheckAll({checked:$event.target.checked})"
          v-if="state.mode===`check`&&state.check.all">{{lang.dialog.selectAll}}</FormCheckbox>
        <FormCheckbox class="check" v-model="state.check.data[id].check"
          :key="`check${id}`" v-for="id of state.check.sort"
          v-if="state.mode===`check`">{{state.check.data[id].title}}</FormCheckbox>
        <FormRadiobox class="radio" name="radio" value="" v-model="state.radio.select"
          v-if="state.mode===`radio`&&state.radio.none">
          {{lang.state.selectNone}}</FormRadiobox>
        <FormRadiobox class="radio" name="radio" :value="id" v-model="state.radio.select"
          v-if="state.mode===`radio`" :key="`radio${id}`" v-for="id of state.radio.sort">
          {{state.radio.data[id].title}}</FormRadiobox>
      </div>
      <div class="foot">
        <FormButton class="cancel"
          @click="state.cancel.callback()">{{state.cancel.name}}</FormButton>
        <FormButton class="ok" @click="state.ok.callback()"
          v-if="state.mode!==`alert`">{{state.ok.name}}</FormButton>
      </div>
    </div>
  </div>
</transition>
</template>

<style lang='scss' scoped>
.popup-dialog {
  @include flex(flex, row, center);
  @include position(absolute, zindex(dialog), 0, 0, 0, 0);
  @include box(null, null, 2rem 2.5rem);
  @include transition(fade, opacity, 1s) {
    opacity: 0 !important;
  }
  .light & {
    background: $color-mask-light;
  }
  .dark & {
    background: $color-mask-dark;
  }
  > .home {
    @include flex(flex, column);
    @include box(null, null, null, 100%);
    max-height: 100%;
    border-radius: 2px;
    .light & {
      background: $color-back-light;
      box-shadow: $shadow-normal-light;
    }
    .dark & {
      background: $color-back-dark;
      box-shadow: $shadow-normal-dark;
    }
    > .head {
      @include box(null, null, 1rem 1rem 0);
      flex: 0 0 auto;
      line-height: 1.25rem;
      white-space: pre-line;
      .light & {
        color: $color-font-light;
      }
      .dark & {
        color: $color-font-dark;
      }
    }
    > .body {
      @include box(null, null, 0 1rem);
      overflow: auto;
      flex: 1 1 auto;
      > .label {
        @include box(null, null, 1rem 0 0 0);
        white-space: pre-line;
        word-break: break-all;
        .light & {
          color: $color-font-light;
        }
        .dark & {
          color: $color-font-dark;
        }
      }
      > .text {
        @include box(null, 1rem 0 0 0, 0, 100%);
        border-bottom: solid 1px $color-state-fine;
        .light & {
          color: $color-font-light;
        }
        .dark & {
          color: $color-font-dark;
        }
      }
      > .check {
        @include flex();
        @include box(null, 1rem 0 0 0);
        .light & {
          color: $color-font-light;
        }
        .dark & {
          color: $color-font-dark;
        }
      }
      > .radio {
        @include flex();
        @include box(null, 1rem 0 0 0);
        .light & {
          color: $color-font-light;
        }
        .dark & {
          color: $color-font-dark;
        }
      }
    }
    > .foot {
      @include flex(flex, row, center, flex-end);
      flex: 0 0 3.5rem;
      > .cancel {
        flex: 0 0 auto;
      }
      > .ok {
        flex: 0 0 auto;
        color: $color-state-error;
      }
    }
  }
}
</style>
