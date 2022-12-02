<script setup lang='ts'>
import * as root from '@/status/page/root';
import * as list from '@/status/page/list';
</script>

<template lang='html'>
<PartLayout class="pageList"
  @click="list.action.switchEdit()"
  @touchstart.self="list.action.swipeInit({$event})"
  @touchmove="list.action.dragStart({$event}),list.action.dragMove({$event}),
    list.action.swipeStart({$event}),list.action.swipeMove({$event})"
  @touchend="list.action.dragEnd(),list.action.swipeEnd({$event})">
  <PartLayout class="home flex column">
    <PartLayout class="head auto flex align-center padding-l gap-l">
      <IconPlus class="auto" @click="list.action.insertItem()" />
      <PartText class="even font-l ellipsis">Memotea</PartText>
      <IconLeft class="auto" @click="root.action.routerBack()" />
    </PartLayout>
    <PartLayout class="even padding-l scrollXY select-none">
      <transition-group tag="ul" id="itemListRoot">
        <PartLayout tag="li"
          class="itemList flex align-center padding-l gap-l border-bottom-m scale-up"
          :class="[list.getter.classItem.value(listId)]" :data-id="listId"
          :key="`list${listId}`" v-for="listId of root.state.list.sort"
          @lngclick="list.action.switchEdit({listId}),list.action.dragInit({$event,listId})"
          @click="root.state.list.data[listId].status!==`edit`&&root.action.routerMain({listId})"
          @contextmenu.prevent>
          <IconInbox v-if="listId===`1`" />
          <IconTrash v-else-if="listId===`2`" />
          <IconList v-else />
          <PartText class="even ellipsis" :class="[list.getter.classText.value(listId)]">
            {{root.state.list.data[listId].title}}</PartText>
          <PartText class="auto" :class="[list.getter.classText.value(listId)]">
            {{list.getter.textCount.value(listId)}}</PartText>
          <PartLayout class="option flex gap-l slide-right" v-show="list.getter.classItem.value(listId).edit">
            <IconClone v-if="listId!==`1`&&listId!==`2`"
              :class="[list.getter.classText.value(listId)]" @click="list.action.copyItem({$event,listId})" />
            <IconTrash v-if="listId!==root.state.listId&&listId!==`1`&&listId!==`2`"
              :class="[list.getter.classText.value(listId)]" @click="list.action.deleteItem({$event,listId})" />
          </PartLayout>
        </PartLayout>
      </transition-group>
    </PartLayout>
  </PartLayout>
</PartLayout>
</template>

<style lang='scss' scoped>
.pageList {
  position: absolute;
  z-index: zindex(page);
  top: 0;
  bottom: 0;
  left: 0;
  width: 200%;
  &.v-enter-active, &.v-leave-active {
    .speed1 & {
      transition: transform 1s, background 1s;
    }
    .speed2 & {
      transition: transform 0.5s, background 0.5s;
    }
    .speed3 & {
      transition: transform 0.25s, background 0.25s;
    }
  }
  &.v-enter-from, &.v-leave-to {
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
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    width: 43%;
    .light & {
      background: $color-grad-light;
      box-shadow: $shadow-normal-light;
    }
    .dark & {
      background: $color-grad-dark;
      box-shadow: $shadow-normal-dark;
    }
    > .head {
      position: relative;
      z-index: 9;
      .light & {
        background: $color-grad-light;
        box-shadow: $shadow-normal-light;
      }
      .dark & {
        background: $color-grad-dark;
        box-shadow: $shadow-normal-dark;
      }
    }
  }
}
.itemList {
  overflow: hidden;
  position: relative;
  height: 4rem;
  .speed1 & {
    transition: box-shadow 1s, transform 1s;
  }
  .speed2 & {
    transition: box-shadow 0.5s, transform 0.5s;
  }
  .speed3 & {
    transition: box-shadow 0.25s, transform 0.25s;
  }
  .light & {
    background: $color-back-light;
  }
  .dark & {
    background: $color-back-dark;
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
    position: relative;
    z-index: 1;
    transform: scale(1.03, 1.03);
    .light & {
      box-shadow: $shadow-outer-light;
    }
    .dark & {
      box-shadow: $shadow-outer-dark;
    }
  }
  > .option {
    position: absolute;
    right: 0.75rem;
    .light & {
      background: $color-back-light;
    }
    .dark & {
      background: $color-back-dark;
    }
  }
}
</style>
