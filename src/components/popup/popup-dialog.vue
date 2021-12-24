<script lang='ts'>
import * as Vue from 'vue';
import * as Vuex from 'vuex';
import * as Lang from '@/assets/script/lang/lang';
export default Vue.defineComponent({
  computed: {
    ...Vuex.mapState(`pages`, [
      `page`,
    ]),
    ...Vuex.mapState(`popup`, [
      `dialog`,
    ]),
    ...Vuex.mapGetters(`popup/dialog`, [
      `stateCheckAll`,
    ]),
    lang() {
      return Lang[this.page.conf.lang as `jp` | `en`];
    },
  },
  methods: {
    ...Vuex.mapActions(`popup/dialog`, [
      `clickCheckAll`,
    ]),
    ...Vuex.mapMutations(`popup/dialog`, [
      `generic`,
    ]),
  },
});
</script>

<template lang='html'>
<transition name="fade">
  <div class="popup-dialog" v-if="dialog.open">
    <div class="home">
      <h4 class="head" v-if="dialog.title">{{dialog.title}}</h4>
      <div class="body">
        <p class="label" v-if="dialog.message">{{dialog.message}}</p>
        <FormTextbox class="text" :placeholder="dialog.text.placeholder"
          :value="dialog.text.value" v-focus v-if="dialog.mode===`text`"
          @input="generic([`text`,`value`,$event.target.value])"></FormTextbox>
        <FormCheckbox class="check" :checked="stateCheckAll()"
          @change="clickCheckAll({checked:$event.target.checked})"
          v-if="dialog.mode===`check`&&dialog.check.all">{{lang.dialog.selectAll}}</FormCheckbox>
        <FormCheckbox class="check" :checked="dialog.check.data[id].check"
          @change="generic([`check`,`data`,id,`check`,$event.target.checked])"
          :key="`check${id}`" v-for="id of dialog.check.sort"
          v-if="dialog.mode===`check`">{{dialog.check.data[id].title}}</FormCheckbox>
        <FormRadiobox class="radio" name="radio" v-if="dialog.mode===`radio`&&dialog.radio.none"
          @change="generic([`radio`,`select`,$event.target.value]),dialog.ok.callback()">
          {{lang.dialog.selectNone}}</FormRadiobox>
        <FormRadiobox class="radio" name="radio" :value="id" :checked="dialog.radio.select===id"
          v-if="dialog.mode===`radio`" :key="`radio${id}`" v-for="id of dialog.radio.sort"
          @change="generic([`radio`,`select`,$event.target.value]),dialog.ok.callback()">
          {{dialog.radio.data[id].title}}</FormRadiobox>
      </div>
      <div class="foot">
        <FormButton class="cancel"
          @click="dialog.cancel.callback()">{{dialog.cancel.name}}</FormButton>
        <FormButton class="ok" @click="dialog.ok.callback()"
          v-if="dialog.mode!==`radio`&&dialog.mode!==`alert`">{{dialog.ok.name}}</FormButton>
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
