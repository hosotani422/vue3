<script lang='ts'>
import * as Vue from 'vue';
import * as Vuex from 'vuex';
import * as Lang from '@/assets/script/lang/lang';
export default Vue.defineComponent({
  computed: {
    ...Vuex.mapState([
      `route`,
    ]),
    ...Vuex.mapState(`pages`, [
      `page`,
    ]),
    ...Vuex.mapGetters(`pages/page`, [
      `classTaskSub`,
      `classFootSub`,
      `textMemoSub`,
      `textAlarmSub`,
    ]),
    listId() {
      return this.page.listId;
    },
    mainId() {
      return this.route.params.mainId;
    },
    main() {
      return this.page.list.data[this.listId].data[this.mainId];
    },
    lang() {
      return Lang[this.page.conf.lang as `jp` | `en`];
    },
  },
  methods: {
    ...Vuex.mapActions(`pages/page`, [
      `saveList`,
      `routerBack`,
      `inputItemSub`,
      `checkItemSub`,
      `enterItemSub`,
      `backItemSub`,
      `deleteItemSub`,
      `inputMemoSub`,
      `switchItemSub`,
      `dragInitSub`,
      `dragStartSub`,
      `dragMoveSub`,
      `dragEndSub`,
      `swipeInitSub`,
      `swipeStartSub`,
      `swipeMoveSub`,
      `swipeEndSub`,
      `openDateSub`,
      `openTimeSub`,
      `openAlarmSub`,
    ]),
    ...Vuex.mapMutations(`pages/page`, [
      `generic`,
    ]),
  },
});
</script>

<template lang='html'>
<div class="page-sub"
  @touchstart.self="swipeInitSub({target:$event.currentTarget,
    x:$event.changedTouches[0].clientX,y:$event.changedTouches[0].clientY})"
  @touchmove="dragStartSub({$event}),
    dragMoveSub({y:$event.changedTouches[0].clientY,$event}),
    swipeStartSub({x:$event.changedTouches[0].clientX,y:$event.changedTouches[0].clientY}),
    swipeMoveSub({x:$event.changedTouches[0].clientX,y:$event.changedTouches[0].clientY})"
  @touchend="dragEndSub(),swipeEndSub({x:$event.changedTouches[0].clientX})">
  <div class="home">
    <h3 class="head">
      <svg class="right" @click="routerBack()">
        <use href="@/assets/image/icon.svg#right"/>
      </svg>
      <FormTextbox class="title" :placeholder="lang.page.main" :value="main.title"
        @input="generic([`list`,`data`,listId,`data`,mainId,`title`,
        $event.target.value]),saveList()"/>
      <svg class="mode" @click="switchItemSub()">
        <use href="@/assets/image/icon.svg#mode"/>
      </svg>
    </h3>
    <div class="body">
      <transition name="fade" mode="out-in">
        <FormTextarea class="memo" v-if="!main.task"
          :placeholder="lang.page.memo" :value="textMemoSub()"
          @input="inputMemoSub({value:$event.target.value})"></FormTextarea>
        <transition-group tag="ul" class="task" name="slide" v-else>
          <li class="item-sub" :class="[classTaskSub(subId)]"
            :data-id="subId" :key="`list${listId}main${mainId}sub${subId}`"
            v-for="(subId,index) of main.sort">
            <FormCheckbox class="check" :checked="main.data[subId].check"
              @change="checkItemSub({subId,checked:$event.target.checked})"></FormCheckbox>
            <FormTextarea class="title" :placeholder="lang.page.sub"
              :value="main.data[subId].title"
              @keydown.backspace="backItemSub({
                subId,index,caret:$event.target.selectionStart,$event})"
              @keydown.enter.prevent="enterItemSub({
                subId,value:$event.target.value,caret:$event.target.selectionStart})"
              @input="inputItemSub({subId,value:$event.target.value})" v-height/>
            <svg class="move" @touchstart="dragInitSub({subId,y:$event.changedTouches[0].clientY})">
              <use href="@/assets/image/icon.svg#drag"/>
            </svg>
            <svg class="trash" @touchstart="deleteItemSub({subId})" v-if="main.sort.length>1">
              <use href="@/assets/image/icon.svg#trash"/>
            </svg>
          </li>
        </transition-group>
      </transition>
    </div>
    <div class="foot">
      <FormTextbox class="date" :class="classFootSub()" :placeholder="lang.page.date" readonly
        :value="main.date" @focus="openDateSub({date:main.date})"/>
      <FormTextbox class="time" :class="classFootSub()" :placeholder="lang.page.time" readonly
        :value="main.time" @focus="openTimeSub({time:main.time})"/>
      <FormTextbox class="alarm" :class="classFootSub()" :placeholder="lang.page.alarm" readonly
        :value="textAlarmSub()" @focus="openAlarmSub()"/>
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
