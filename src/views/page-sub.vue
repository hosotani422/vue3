<script lang='ts'>
import * as Vue from 'vue';
import * as VueRouter from 'vue-router';
import * as Lang from '@/assets/script/lang/lang';
import * as page from '@/composition/pages/page';
export default Vue.defineComponent({
  setup: () => {
    const route = VueRouter.useRoute();
    return {
      ...page,
      listId: Vue.computed(() => page.state.listId),
      mainId: Vue.computed(() => route.params.mainId),
      main: Vue.computed(() =>
        page.state.list.data[page.state.listId].data[route.params.mainId as string]),
      lang: Vue.computed(() => Lang[page.state.conf.lang as `jp` | `en`]),
    };
  },
});
</script>

<template lang='html'>
<div class="page-sub"
  @touchstart.self="action.swipeInitSub({target:$event.currentTarget,
    x:$event.changedTouches[0].clientX,y:$event.changedTouches[0].clientY})"
  @touchmove="action.dragStartSub({$event}),
    action.dragMoveSub({y:$event.changedTouches[0].clientY,$event}),
    action.swipeStartSub({x:$event.changedTouches[0].clientX,y:$event.changedTouches[0].clientY}),
    action.swipeMoveSub({x:$event.changedTouches[0].clientX,y:$event.changedTouches[0].clientY})"
  @touchend="action.dragEndSub(),action.swipeEndSub({x:$event.changedTouches[0].clientX})">
  <div class="home">
    <h3 class="head">
      <svg class="right" @click="action.routerBack()">
        <use href="@/assets/image/icon.svg#right"/>
      </svg>
      <FormTextbox class="title" :placeholder="lang.page.main" v-model="main.title"/>
      <svg class="mode" @click="action.switchItemSub()">
        <use href="@/assets/image/icon.svg#mode"/>
      </svg>
    </h3>
    <div class="body">
      <transition name="fade" mode="out-in">
        <FormTextarea class="memo" v-if="!main.task"
          :placeholder="lang.page.memo" :modelValue="getter.textMemoSub.value()"
          @input="action.inputMemoSub({value:$event.target.value})"></FormTextarea>
        <transition-group tag="ul" class="task" name="slide" v-else>
          <li class="item-sub" :class="[getter.classTaskSub.value(subId)]"
            :data-id="subId" :key="`list${listId}main${mainId}sub${subId}`"
            v-for="(subId,index) of main.sort">
            <FormCheckbox class="check" :modelValue="main.data[subId].check"
              @change="action.checkItemSub({subId,checked:$event.target.checked})"></FormCheckbox>
            <FormTextarea class="title" :placeholder="lang.page.sub"
              :modelValue="main.data[subId].title"
              @keydown.backspace="action.backItemSub({
                subId,index,caret:$event.target.selectionStart,$event})"
              @keydown.enter.prevent="action.enterItemSub({
                subId,value:$event.target.value,caret:$event.target.selectionStart})"
              @input="action.inputItemSub({subId,value:$event.target.value})" v-height/>
            <svg class="move"
              @touchstart="action.dragInitSub({subId,y:$event.changedTouches[0].clientY})">
              <use href="@/assets/image/icon.svg#drag"/>
            </svg>
            <svg class="trash" v-if="main.sort.length>1"
              @touchstart="action.deleteItemSub({subId})">
              <use href="@/assets/image/icon.svg#trash"/>
            </svg>
          </li>
        </transition-group>
      </transition>
    </div>
    <div class="foot">
      <FormTextbox class="date" :class="getter.classFootSub.value()"
        :placeholder="lang.page.date" readonly :modelValue="main.date"
        @focus="action.openCalendarSub({date:main.date})"/>
      <FormTextbox class="time" :class="getter.classFootSub.value()"
        :placeholder="lang.page.time" readonly :modelValue="main.time"
        @focus="action.openClockSub({time:main.time})"/>
      <FormTextbox class="alarm" :class="getter.classFootSub.value()"
        :placeholder="lang.page.alarm" readonly :modelValue="getter.textAlarmSub.value()"
        @focus="action.openAlarmSub()"/>
    </div>
  </div>
</div>
</template>

<style lang='scss' scoped>
.page-sub {
  @include position(absolute, zindex(page), 0, 0, 0);
  @include box(null, null, null, 200%);
  @include transition(v, #{transform, background}, 1s) {
    transform: translateX(50%) !important;
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
    @include position(absolute, 1, 0, auto, 0, 57%);
    @include box(null, null, null, 43%);
    .light & {
      background: $color-grad-light;
      box-shadow: $shadow-reverse-light;
    }
    .dark & {
      background: $color-grad-dark;
      box-shadow: $shadow-reverse-dark;
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
      > .right {
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
        @include box(null, null, 0, 100%);
        flex: 1 1 0;
        font-size: 1.25rem;
        .light & {
          color: $color-font-light;
        }
        .dark & {
          color: $color-font-dark;
        }
      }
      > .mode {
        @include box(null, null, 0.75rem, null, 3.5rem);
        flex: 0 0 3.5rem;
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
      > .memo {
        @include box(null, null, null, 100%, 100%);
        line-height: 2rem;
        @include transition(fade, opacity, 1s) {
          opacity: 0 !important;
        }
        .light & {
          color: $color-font-light;
          background: $color-back-light;
        }
        .dark & {
          color: $color-font-dark;
          background: $color-back-dark;
        }
      }
      > .task {
        @include transition(fade, opacity, 1s) {
          opacity: 0 !important;
        }
      }
    }
    > .foot {
      @include flex(flex, row, center);
      @include position(relative, 9);
      flex: 0 0 3.5rem;
      .light & {
        background: $color-grad-light;
        box-shadow: $shadow-reverse-light;
      }
      .dark & {
        background: $color-grad-dark;
        box-shadow: $shadow-reverse-dark;
      }
      > .date {
        @include box(null, 0 0.75rem, 0, 100%);
        flex: 1 1 0;
        @include state(color);
        .light & {
          color: $color-font-light;
        }
        .dark & {
          color: $color-font-dark;
        }
      }
      > .time {
        @include box(null, 0, 0, 100%);
        flex: 1 1 0;
        @include state(color);
        .light & {
          color: $color-font-light;
        }
        .dark & {
          color: $color-font-dark;
        }
      }
      > .alarm {
        @include box(null, 0 0.75rem, 0, 100%);
        flex: 1 1 0;
        @include state(color);
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
.item-sub {
  @include flex();
  @include position(relative);
  overflow: hidden;
  @include transition(null, #{box-shadow, transform}, 0.5s);
  @include transition(slide, #{height, opacity}, 0.5s) {
    height: 0 !important;
    opacity: 0 !important;
  }
  .light & {
    background: $color-back-light;
  }
  .dark & {
    background: $color-back-dark;
  }
  &:before {
    content: "";
    @include position(absolute, auto, auto, 0, 0, 0);
    height: 1px;
    background: $color-grad-light;
  }
  &.check {
    text-decoration: line-through;
    opacity: 0.5;
  }
  &.edit, &.drag {
    z-index: 1;
    transform: scale(1.03, 1.03);
    .light & {
      box-shadow: $shadow-normal-light;
    }
    .dark & {
      box-shadow: $shadow-normal-dark;
    }
  }
  &.hide {
    visibility: hidden;
  }
  > .check {
    @include box(null, 0.75rem 0.25rem 0.75rem 0.75rem, null, null, 2rem);
    flex: 0 0 auto;
  }
  > .title {
    @include box(null, 0.75rem 0, 0);
    flex: 1 1 0;
    line-height: 2rem;
    .light & {
      color: $color-font-light;
    }
    .dark & {
      color: $color-font-dark;
    }
  }
  > .move {
    @include box(null, null, 0.75rem, null, calc(3.5rem - 1px));
    flex: 0 0 3.5rem;
    .light & {
      color: $color-font-light;
      background: $color-back-light;
    }
    .dark & {
      color: $color-font-dark;
      background: $color-back-dark;
    }
    > use {
      pointer-events: none;
    }
  }
  > .trash {
    @include position(absolute, -1, auto, 0);
    @include box(null, null, 0.75rem, 3.5rem, calc(3.5rem - 1px));
    opacity: 0;
    @include transition(null, opacity, 0.5s);
    @include replace(".trash", ".title:focus + .move + .trash") {
      z-index: 1;
      opacity: 1;
    }
    .light & {
      color: $color-font-light;
      background: $color-back-light;
    }
    .dark & {
      color: $color-font-dark;
      background: $color-back-dark;
    }
  }
}
</style>
