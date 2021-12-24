<script lang='ts'>
import * as Vue from 'vue';
import * as Util from '@/assets/script/base/util';
import * as Lang from '@/assets/script/lang/lang';
import * as page from '@/composition/pages/page';
export default Vue.defineComponent({
  setup: () => {
    Vue.watch(
      () => Util.copy(page.state.list),
      () => {
        page.action.saveList();
      },
    );
    return {
      ...page,
      listId: Vue.computed(() => page.state.listId),
      list: Vue.computed(() => page.state.list.data[page.state.listId]),
      lang: Vue.computed(() => Lang[page.state.conf.lang as `jp` | `en`]),
    };
  },
});
</script>

<template lang='html'>
<div class="page-main" @touchmove="action.dragStartMain({$event}),
  action.dragMoveMain({y:$event.changedTouches[0].clientY,$event})"
  @touchend="action.dragEndMain()" @click="action.switchEditMain()">
  <h2 class="head">
    <svg class="list" @click="action.routerList()">
      <use href="@/assets/image/icon.svg#list"/>
    </svg>
    <FormTextbox class="title" :placeholder="lang.page.list" v-model="list.title"/>
    <svg class="conf" @click="action.routerConf()">
      <use href="@/assets/image/icon.svg#conf"/>
    </svg>
    <svg class="plus" @click="action.insertItemMain()">
      <use href="@/assets/image/icon.svg#plus"/>
    </svg>
  </h2>
  <div class="body">
    <transition-group appear class="wrap" tag="ul" name="slide">
      <li class="item-main" :class="[getter.classItemMain.value(mainId)]" :data-id="mainId"
        :key="`list${listId}main${mainId}`" v-for="mainId of list.sort" @contextmenu.prevent
        @lngclick="action.switchEditMain({mainId}),
        action.dragInitMain({mainId,y:$event.detail.clientY})">
        <FormCheckbox class="check" :modelValue="list.data[mainId].check"
          @change="action.checkItemMain({mainId,checked:$event.target.checked})"></FormCheckbox>
        <p class="title" @click="list.data[mainId].status!==`edit`&&action.routerSub({mainId})">
          {{list.data[mainId].title}}
        </p>
        <div class="count" @click="list.data[mainId].status!==`edit`&&action.routerSub({mainId})">
          {{getter.textCountMain.value(mainId)}}
        </div>
        <svg class="clone" @click="action.copyItemMain({$event,mainId})">
          <use class="clone" href="@/assets/image/icon.svg#clone"/>
        </svg>
        <svg class="move" @click="action.moveItemMain({$event,mainId})">
          <use class="move" href="@/assets/image/icon.svg#move"/>
        </svg>
        <svg class="trash" @click="action.deleteItemMain({$event,mainId})">
          <use class="trash" href="@/assets/image/icon.svg#trash"/>
        </svg>
      </li>
    </transition-group>
  </div>
</div>
</template>

<style lang='scss' scoped>
.page-main {
  @include flex(flex, column);
  @include position(absolute, 1, 0, 0, 0, 0);
  .light & {
    background: $color-grad-light;
  }
  .dark & {
    background: $color-grad-dark;
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
    > .list {
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
    > .conf {
      @include box(null, null, 0.75rem, null, 3.5rem);
      flex: 0 0 3.5rem;
      .light & {
        color: $color-font-light;
      }
      .dark & {
        color: $color-font-dark;
      }
    }
    > .plus {
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
  }
}
.item-main {
  @include flex(flex, row, center);
  @include position(relative);
  @include box(null, null, null, null, 3.5rem);
  user-select: none;
  overflow: hidden;
  @include state(color);
  @include transition(null, #{box-shadow, transform}, 0.5s);
  @include transition(slide, #{height, opacity}, 0.5s) {
    height: 0 !important;
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
  &:before {
    content: "";
    @include position(absolute, auto, auto, 0, 0, 0);
    height: 1px;
    background: $color-grad-light;
  }
  &.select {
    .light & {
      box-shadow: $shadow-inner-light;
    }
    .dark & {
      box-shadow: $shadow-inner-dark;
    }
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
    @include ellipsis();
    flex: 1 1 0;
  }
  > .count {
    @include box(null, null, 0 0.75rem);
    flex: 0 0 auto;
  }
  > .clone {
    @include position(absolute, -1, auto, 7rem);
    @include box(null, null, 0.75rem, 3.5rem, calc(3.5rem - 1px));
    opacity: 0;
    @include transition(null, opacity, 0.5s);
    @include replace(".item-main", ".item-main.edit") {
      z-index: 1;
      opacity: 1;
    }
    .light & {
      background: $color-back-light;
    }
    .dark & {
      background: $color-back-dark;
    }
  }
  > .move {
    @include position(absolute, -1, auto, 3.5rem);
    @include box(null, null, 0.75rem, 3.5rem, calc(3.5rem - 1px));
    opacity: 0;
    @include transition(null, opacity, 0.5s);
    @include replace(".item-main", ".item-main.edit") {
      z-index: 1;
      opacity: 1;
    }
    .light & {
      background: $color-back-light;
    }
    .dark & {
      background: $color-back-dark;
    }
  }
  > .trash {
    @include position(absolute, -1, auto, 0);
    @include box(null, null, 0.75rem, 3.5rem, calc(3.5rem - 1px));
    opacity: 0;
    @include transition(null, opacity, 0.5s);
    @include replace(".item-main", ".item-main.edit") {
      z-index: 1;
      opacity: 1;
    }
    .light & {
      background: $color-back-light;
    }
    .dark & {
      background: $color-back-dark;
    }
  }
}
</style>
