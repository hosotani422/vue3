<script lang='ts'>
import * as Vue from 'vue';
import * as Vuex from 'vuex';
import * as Const from '@/assets/script/const/const';
import * as Lang from '@/assets/script/lang/lang';
export default Vue.defineComponent({
  computed: {
    ...Vuex.mapState(`pages`, [
      `page`,
    ]),
    Const() {
      return Const;
    },
    lang() {
      return Lang[this.page.conf.lang as `jp` | `en`];
    },
  },
  methods: {
    ...Vuex.mapActions(`pages/page`, [
      `saveConf`,
      `routerBack`,
      `downloadBackupConf`,
      `uploadBackupConf`,
      `resetConfConf`,
      `resetListConf`,
      `swipeInitConf`,
      `swipeStartConf`,
      `swipeMoveConf`,
      `swipeEndConf`,
    ]),
    ...Vuex.mapMutations(`pages/page`, [
      `generic`,
    ]),
  },
});
</script>

<template lang='html'>
<div class="page-conf"
  @touchstart.self="swipeInitConf({target:$event.currentTarget,
    x:$event.changedTouches[0].clientX,y:$event.changedTouches[0].clientY})" @touchmove="
    swipeStartConf({x:$event.changedTouches[0].clientX,y:$event.changedTouches[0].clientY}),
    swipeMoveConf({x:$event.changedTouches[0].clientX,y:$event.changedTouches[0].clientY})"
  @touchend="swipeEndConf({y:$event.changedTouches[0].clientY})">
  <div class="home">
    <div class="head">
      <svg class="down" @click="routerBack()">
        <use href="@/assets/image/icon.svg#down"/>
      </svg>
      <h2 class="title">{{lang.conf.title}}</h2>
      <h3 class="extra">{{Const.Base.title}} {{Const.Base.version}}</h3>
    </div>
    <ul class="body">
      <li class="item">
        <h3 class="title">{{lang.conf.size.title}}</h3>
        <FormRange class="value" min="1" max="3" step="1" :value="page.conf.size"
          @input="generic([`conf`,`size`,$event.target.value]),saveConf()"></FormRange>
        <p class="label">{{lang.conf.size.value[page.conf.size]}}</p>
      </li>
      <li class="item">
        <h3 class="title">{{lang.conf.speed.title}}</h3>
        <FormRange class="value" min="1" max="3" step="1" :value="page.conf.speed"
          @input="generic([`conf`,`speed`,$event.target.value]),saveConf()"></FormRange>
        <p class="label">{{lang.conf.speed.value[page.conf.speed]}}</p>
      </li>
      <li class="item">
        <h3 class="title">{{lang.conf.volume.title}}</h3>
        <FormRange class="value" min="0" max="3" step="1" :value="page.conf.volume"
          @input="generic([`conf`,`volume`,$event.target.value]),saveConf()"></FormRange>
        <p class="label">{{lang.conf.volume.value[page.conf.volume]}}</p>
      </li>
      <li class="item">
        <h3 class="title">{{lang.conf.vibrate.title}}</h3>
        <FormRadiobox class="value" name="vibrate" :checked="!page.conf.vibrate"
          @change="generic([`conf`,`vibrate`,false]),saveConf()">
          {{lang.conf.vibrate.off}}</FormRadiobox>
        <FormRadiobox class="value" name="vibrate" :checked="page.conf.vibrate"
          @change="generic([`conf`,`vibrate`,true]),saveConf()">
          {{lang.conf.vibrate.on}}</FormRadiobox>
      </li>
      <li class="item">
        <h3 class="title">{{lang.conf.theme.title}}</h3>
        <FormRadiobox class="value" name="theme" :checked="page.conf.theme===`light`"
          @change="generic([`conf`,`theme`,`light`]),saveConf()">
          {{lang.conf.theme.light}}</FormRadiobox>
        <FormRadiobox class="value" name="theme" :checked="page.conf.theme===`dark`"
          @change="generic([`conf`,`theme`,`dark`]),saveConf()">
          {{lang.conf.theme.dark}}</FormRadiobox>
      </li>
      <li class="item">
        <h3 class="title">{{lang.conf.lang.title}}</h3>
        <FormRadiobox class="value" name="lang" :checked="page.conf.lang===`en`"
          @change="generic([`conf`,`lang`,`en`]),saveConf()">{{lang.conf.lang.en}}</FormRadiobox>
        <FormRadiobox class="value" name="lang" :checked="page.conf.lang===`jp`"
          @change="generic([`conf`,`lang`,`jp`]),saveConf()">{{lang.conf.lang.jp}}</FormRadiobox>
      </li>
      <li class="item">
        <h3 class="title">{{lang.conf.backup.title}}</h3>
        <a class="value" @click="downloadBackupConf({target:$event.currentTarget})">
          <FormButton>{{lang.conf.backup.download}}</FormButton>
        </a>
        <label class="value">
          <input type="file" @change="uploadBackupConf({file:$event.currentTarget.files[0]})">
          <span class="button warn">{{lang.conf.backup.upload}}</span>
        </label>
      </li>
      <li class="item">
        <h3 class="title">{{lang.conf.reset.title}}</h3>
        <FormButton @click="resetConfConf()">{{lang.conf.reset.conf}}</FormButton>
        <FormButton class="warn" @click="resetListConf()">{{lang.conf.reset.list}}</FormButton>
      </li>
    </ul>
  </div>
</div>
</template>

<style lang='scss' scoped>
.page-conf {
  @include position(absolute, zindex(page), auto, 0, 0, 0);
  @include box(null, null, null, null, 200%);
  @include transition(v, #{transform, background}, 1s) {
    transform: translateY(50%) !important;
    background: transparent !important;
  }
  .light & {
    background: $color-mask-light;
  }
  .dark & {
    background: $color-mask-dark;
  }
  > .home {
    @include flex(flex, column);
    @include position(absolute, 1, auto, 0, 0, 0);
    @include box(null, null, null, null, 45%);
    .light & {
      background: $color-grad-light;
      box-shadow: $shadow-normal-light;
    }
    .dark & {
      background: $color-grad-dark;
      box-shadow: $shadow-normal-dark;
    }
    > .head {
      @include flex(flex, row, center);
      @include position(relative, 9);
      flex: 0 0 3.5rem;
      .light & {
        background: $color-grad-light;
        box-shadow: $shadow-normal-light;
      }
      .dark & {
        background: $color-grad-dark;
        box-shadow: $shadow-normal-dark;
      }
      > .down {
        @include box(null, null, 0.75rem, null, 3.5rem);
        flex: 0 0 3.5rem;
        .light & {
          color: $color-font-light;
        }
        .dark & {
          color: $color-font-dark;
        }
      }
      > .title {
        overflow: hidden;
        flex: 1 1 0;
        font-size: 1.25rem;
        white-space: nowrap;
        .light & {
          color: $color-font-light;
        }
        .dark & {
          color: $color-font-dark;
        }
      }
      > .extra {
        @include box(null, null, 0.75rem);
        flex: 0 0 auto;
        .light & {
          color: $color-font-light;
        }
        .dark & {
          color: $color-font-dark;
        }
      }
    }
    > .body {
      @include box(null, null, 1rem 0.75rem);
      overflow: auto;
      flex: 1 1 0;
      > .item {
        @include flex(flex, row, center);
        @include position(relative);
        @include box(null, null, null, null, 3.5rem);
        user-select: none;
        .light & {
          background: $color-back-light;
        }
        .dark & {
          background: $color-back-dark;
        }
        .warn {
          color: $color-state-error;
        }
        &:before {
          content: "";
          @include position(absolute, auto, auto, 0, 0, 0);
          height: 1px;
          background: $color-grad-light;
        }
        > .title {
          @include flex(flex, row, center);
          @include box(null, null, 0 0.75rem, null, 100%);
          overflow: hidden;
          flex: 1 1 0;
          white-space: nowrap;
          .light & {
            color: $color-font-light;
          }
          .dark & {
            color: $color-font-dark;
          }
        }
        > .value {
          @include box(null, 0 0.75rem 0 0);
          .light & {
            color: $color-font-light;
          }
          .dark & {
            color: $color-font-dark;
          }
          &[type = "range"] {
            flex: 0 0 50%;
          }
          > .button {
            @include box(null, null, 0 0.25rem);
          }
          > input[type = "file"] {
            display: none;
          }
        }
        > .label {
          @include box(null, 0 0.75rem 0 0);
          flex: 0 0 1rem;
          .light & {
            color: $color-font-light;
          }
          .dark & {
            color: $color-font-dark;
          }
        }
      }
    }
  }
}
</style>
