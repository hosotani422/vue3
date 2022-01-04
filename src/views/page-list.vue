<script lang='ts'>
import * as Vue from 'vue';
import * as page from '@/composition/pages/page';
export default Vue.defineComponent({
  setup: () => page,
});
</script>

<template lang='html'>
<div class="page-list" @click="action.switchEditList()"
  @touchstart.self="action.swipeInitList({target:$event.currentTarget,
    x:$event.changedTouches[0].clientX,y:$event.changedTouches[0].clientY})"
  @touchmove="action.dragStartList({$event}),
    action.dragMoveList({y:$event.changedTouches[0].clientY,$event}),
    action.swipeStartList({x:$event.changedTouches[0].clientX,y:$event.changedTouches[0].clientY}),
    action.swipeMoveList({x:$event.changedTouches[0].clientX,y:$event.changedTouches[0].clientY})"
  @touchend="action.dragEndList(),action.swipeEndList({x:$event.changedTouches[0].clientX})">
  <div class="home">
    <div class="head">
      <svg class="plus" @click="action.insertItemList()">
        <use href="@/assets/image/icon.svg#plus"/>
      </svg>
      <h1 class="title">Memotea</h1>
      <svg class="left" @click="action.routerBack()">
        <use href="@/assets/image/icon.svg#left"/>
      </svg>
    </div>
    <div class="body">
      <transition-group class="wrap" tag="ul" name="slide">
        <li class="item-list" :class="[getter.classItemList.value(listId)]"
          :data-id="listId" :key="`list${listId}`" v-for="listId of state.list.sort"
          @lngclick="action.switchEditList({listId}),
          action.dragInitList({listId,y:$event.detail.clientY})"
          @click="state.list.data[listId].status!==`edit`&&action.routerMain({listId})"
          @contextmenu.prevent>
          <svg class="icon">
            <use href="@/assets/image/icon.svg#inbox" v-if="listId===`1`"/>
            <use href="@/assets/image/icon.svg#trash" v-else-if="listId===`2`"/>
            <use href="@/assets/image/icon.svg#list" v-else/>
          </svg>
          <p class="title">{{state.list.data[listId].title}}</p>
          <div class="count">{{getter.textCountList.value(listId)}}</div>
          <svg class="clone" v-if="listId!==`1`&&listId!==`2`"
            @click="action.copyItemList({$event,listId})">
            <use class="clone" href="@/assets/image/icon.svg#clone"/>
          </svg>
          <svg class="trash" v-if="listId!==`1`&&listId!==`2`&&listId!==state.listId"
            @click="action.deleteItemList({$event,listId})">
            <use class="trash" href="@/assets/image/icon.svg#trash"/>
          </svg>
        </li>
      </transition-group>
    </div>
  </div>
</div>
</template>

<style lang='scss' scoped>
.page-list {
  @include position(absolute, zindex(page), 0, auto, 0, 0);
  @include box(null, null, null, 200%);
  @include transition(v, #{transform, background}, 1s) {
    transform: translateX(-50%) !important;
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
    @include position(absolute, 1, 0, auto, 0, 0);
    @include box(null, null, null, 43%);
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
      > .left {
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
}
.item-list {
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
  &.edit {
    z-index: 1;
    transform: scale(1.03, 1.03);
    .light & {
      background: $color-back-light;
      box-shadow: $shadow-normal-light;
    }
    .dark & {
      background: $color-back-dark;
      box-shadow: $shadow-normal-dark;
    }
  }
  &.hide {
    visibility: hidden;
  }
  > .icon {
    @include box(null, null, 0.75rem, null, 3.5rem);
    flex: 0 0 3.5rem;
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
    @include position(absolute, -1, auto, 3.5rem);
    @include box(null, null, 0.75rem, 3.5rem, calc(3.5rem - 1px));
    opacity: 0;
    @include transition(null, opacity, 0.5s);
    @include replace(".item-list", ".item-list.edit") {
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
    @include replace(".item-list", ".item-list.edit") {
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
