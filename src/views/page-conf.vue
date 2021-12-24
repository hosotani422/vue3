<script lang='ts'>
import * as Vue from 'vue';
import * as Util from '@/assets/script/base/util';
import * as Const from '@/assets/script/const/const';
import * as Lang from '@/assets/script/lang/lang';
import * as page from '@/composition/pages/page';
export default Vue.defineComponent({
  setup: () => {
    Vue.watch(
      () => Util.copy(page.state.conf),
      () => {
        page.action.saveConf();
      },
    );
    return {
      ...page,
      Const,
      lang: Vue.computed(() => Lang[page.state.conf.lang as `jp` | `en`]),
    };
  },
});
</script>

<template lang='html'>
<div class="page-conf"
  @touchstart.self="action.swipeInitConf({target:$event.currentTarget,
    x:$event.changedTouches[0].clientX,y:$event.changedTouches[0].clientY})" @touchmove="
    action.swipeStartConf({x:$event.changedTouches[0].clientX,y:$event.changedTouches[0].clientY}),
    action.swipeMoveConf({x:$event.changedTouches[0].clientX,y:$event.changedTouches[0].clientY})"
  @touchend="action.swipeEndConf({y:$event.changedTouches[0].clientY})">
  <div class="home">
    <div class="head">
      <svg class="down" @click="action.routerBack()">
        <use href="@/assets/image/icon.svg#down"/>
      </svg>
      <h2 class="title">{{lang.conf.title}}</h2>
      <h3 class="extra">{{Const.Base.title}} {{Const.Base.version}}</h3>
    </div>
    <ul class="body">
      <li class="item">
        <h3 class="title">{{lang.conf.size.title}}</h3>
        <FormRange class="value" min="1" max="3" step="1" v-model="state.conf.size"></FormRange>
        <p class="label">{{lang.conf.size.value[state.conf.size]}}</p>
      </li>
      <li class="item">
        <h3 class="title">{{lang.conf.speed.title}}</h3>
        <FormRange class="value" min="1" max="3" step="1" v-model="state.conf.speed"></FormRange>
        <p class="label">{{lang.conf.speed.value[state.conf.speed]}}</p>
      </li>
      <li class="item">
        <h3 class="title">{{lang.conf.volume.title}}</h3>
        <FormRange class="value" min="0" max="3" step="1" v-model="state.conf.volume"></FormRange>
        <p class="label">{{lang.conf.volume.value[state.conf.volume]}}</p>
      </li>
      <li class="item">
        <h3 class="title">{{lang.conf.vibrate.title}}</h3>
        <FormRadiobox class="value" name="vibrate" value="false" v-model="state.conf.vibrate">
          {{lang.conf.vibrate.off}}</FormRadiobox>
        <FormRadiobox class="value" name="vibrate" value="true" v-model="state.conf.vibrate">
          {{lang.conf.vibrate.on}}</FormRadiobox>
      </li>
      <li class="item">
        <h3 class="title">{{lang.conf.theme.title}}</h3>
        <FormRadiobox class="value" name="theme" value="light" v-model="state.conf.theme">
          {{lang.conf.theme.light}}</FormRadiobox>
        <FormRadiobox class="value" name="theme" value="dark" v-model="state.conf.theme">
          {{lang.conf.theme.dark}}</FormRadiobox>
      </li>
      <li class="item">
        <h3 class="title">{{lang.conf.lang.title}}</h3>
        <FormRadiobox class="value" name="lang" value="en" v-model="state.conf.lang">
          {{lang.conf.lang.en}}</FormRadiobox>
        <FormRadiobox class="value" name="lang" value="jp" v-model="state.conf.lang">
          {{lang.conf.lang.jp}}</FormRadiobox>
      </li>
      <li class="item">
        <h3 class="title">{{lang.conf.backup.title}}</h3>
        <a class="value" @click="action.downloadBackupConf({target:$event.currentTarget})">
          <FormButton>{{lang.conf.backup.download}}</FormButton>
        </a>
        <label class="value">
          <input type="file"
            @change="action.uploadBackupConf({file:$event.currentTarget.files[0]})">
          <span class="button warn">{{lang.conf.backup.upload}}</span>
        </label>
      </li>
      <li class="item">
        <h3 class="title">{{lang.conf.reset.title}}</h3>
        <FormButton @click="action.resetConfConf()">{{lang.conf.reset.conf}}</FormButton>
        <FormButton class="warn"
          @click="action.resetListConf()">{{lang.conf.reset.list}}</FormButton>
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
