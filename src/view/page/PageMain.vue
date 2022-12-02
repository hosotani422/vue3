<script setup lang='ts'>
import * as Vue from 'vue';
import * as Lang from '@/script/lang/lang';
import * as root from '@/status/page/root';
import * as main from '@/status/page/main';
const lang = Vue.computed(() => Lang[root.state.conf.lang]);
const list = Vue.computed(() => root.state.list.data[root.state.listId]);
</script>

<template lang='html'>
<PartLayout class="pageMain flex column"
  @click="main.action.switchEdit()"
  @touchmove="main.action.dragStart({$event}),main.action.dragMove({$event})"
  @touchend="main.action.dragEnd()">
  <PartLayout class="head auto flex align-center padding-l gap-l">
    <IconList class="auto" @click="root.action.routerList()" />
    <InputTextbox class="even font-l" :placeholder="lang.page.list" v-model="list.title" />
    <IconConf class="auto" @click="root.action.routerConf()" />
    <IconPlus class="auto" @click="main.action.insertItem()" />
  </PartLayout>
  <PartLayout class="even padding-l scrollXY select-none">
    <transition-group appear tag="ul" id="itemMainRoot">
      <PartLayout tag="li"
        class="itemMain flex align-center padding-l gap-l border-bottom-m scale-up"
        :class="[main.getter.classItem.value(mainId)]" :data-id="mainId"
        :key="`list${root.state.listId}main${mainId}`" v-for="mainId of list.sort"
        @click="list.data[mainId].status!==`edit`&&root.action.routerSub({mainId})"
        @lngclick="main.action.switchEdit({mainId}),main.action.dragInit({$event,mainId})"
        @contextmenu.prevent>
        <InputCheck class="auto" :modelValue="list.data[mainId].check"
          @change="main.action.checkItem({$event,mainId})" @click.stop />
        <PartText class="even ellipsis" :class="[main.getter.classText.value(mainId)]">
          {{list.data[mainId].title}}</PartText>
        <PartText class="auto" :class="[main.getter.classText.value(mainId)]">
          {{main.getter.textCount.value(mainId)}}</PartText>
        <PartLayout class="option flex gap-l slide-right" v-show="main.getter.classItem.value(mainId).edit">
          <IconClone class="auto" :class="[main.getter.classText.value(mainId)]"
            @click="main.action.copyItem({$event,mainId})" />
          <IconMove class="auto" :class="[main.getter.classText.value(mainId)]"
            @click="main.action.moveItem({$event,mainId})" />
          <IconTrash class="auto" :class="[main.getter.classText.value(mainId)]"
            @click="main.action.deleteItem({$event,mainId})" />
        </PartLayout>
      </PartLayout>
    </transition-group>
  </PartLayout>
</PartLayout>
</template>

<style lang='scss' scoped>
.pageMain {
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  .light & {
    background: $color-grad-light;
  }
  .dark & {
    background: $color-grad-dark;
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
.itemMain {
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
  &.check {
    opacity: 0.5;
    > .partText {
      text-decoration: solid line-through 0.1rem;
    }
  }
  &.edit, &.drag {
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
