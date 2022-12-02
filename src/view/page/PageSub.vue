<script setup lang='ts'>
import * as Vue from 'vue';
import Global from '@/script/base/global';
import * as Lang from '@/script/lang/lang';
import * as root from '@/status/page/root';
import * as sub from '@/status/page/sub';
const lang = Vue.computed(() => Lang[root.state.conf.lang]);
const main = Vue.computed(() => root.state.list.data[root.state.listId].data[Global.route?.params.mainId as string]);
</script>

<template lang='html'>
<PartLayout class="pageSub" @touchstart.capture="sub.action.switchEdit()"
  @touchstart.self="sub.action.swipeInit({$event})"
  @touchmove="sub.action.dragStart({$event}),sub.action.dragMove({$event}),
    sub.action.swipeStart({$event}),sub.action.swipeMove({$event})"
  @touchend="sub.action.dragEnd(),sub.action.swipeEnd({$event})">
  <PartLayout class="home flex column">
    <PartLayout class="head auto flex align-center padding-l gap-l">
      <IconRight class="auto" @click="root.action.routerBack()" />
      <InputTextbox class="even font-l" :placeholder="lang.page.main" v-model="main.title" />
      <IconMode class="auto" @click="sub.action.switchItem()" />
    </PartLayout>
    <PartLayout class="body even padding-l scrollXY">
      <transition mode="out-in">
        <InputTextarea class="input width-full height-full fade-normal"
          :placeholder="lang.page.memo" v-if="!main.task"
          :modelValue="sub.getter.textMemo.value()" @input="sub.action.inputMemo({$event})" />
        <PartLayout class="fade-normal" v-else>
          <transition-group tag="ul" id="itemSubRoot">
            <PartLayout tag="li"
              class="itemSub flex align-start padding-l gap-l border-bottom-m scale-up"
              :class="[sub.getter.classTask.value(subId)]" :data-id="subId"
              :key="`list${root.state.listId}main${Global.route?.params.mainId}sub${subId}`"
              v-for="(subId,index) of main.sort">
              <InputCheck class="auto" :modelValue="main.data[subId].check"
                @change="sub.action.checkItem({$event,subId})" />
              <InputTextarea class="title even padding-none"
                :placeholder="lang.page.sub" :modelValue="main.data[subId].title"
                @click="sub.action.switchEdit({subId})"
                @keydown.backspace="sub.action.backItem({$event,subId,index})"
                @keydown.enter.prevent="sub.action.enterItem({$event,subId})"
                @input="sub.action.inputItem({$event,subId})" v-height />
              <IconDrag @touchstart="sub.action.dragInit({$event,subId})" />
              <IconTrash v-show="main.sort.length>1&&sub.getter.classTask.value(subId).edit"
                class="option slide-right" @touchstart="sub.action.deleteItem({subId})" />
            </PartLayout>
          </transition-group>
        </PartLayout>
      </transition>
    </PartLayout>
    <PartLayout class="foot auto flex align-center padding-l gap-l">
      <InputTextbox class="even width-full" :class="sub.getter.classFoot.value()"
        :placeholder="lang.page.date" :modelValue="main.date" readonly
        @focus="sub.action.openCalendar({date:main.date})" />
      <InputTextbox class="even width-full" :class="sub.getter.classFoot.value()"
        :placeholder="lang.page.time" :modelValue="main.time" readonly
        @focus="sub.action.openClock({time:main.time})" />
      <InputTextbox class="even width-full" :class="sub.getter.classFoot.value()"
        :placeholder="lang.page.alarm" :modelValue="sub.getter.textAlarm.value()" readonly
        @focus="sub.action.openAlarm()" />
    </PartLayout>
  </PartLayout>
</PartLayout>
</template>

<style lang='scss' scoped>
.pageSub {
  position: absolute;
  z-index: zindex(page);
  top: 0;
  right: 0;
  bottom: 0;
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
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 57%;
    width: 43%;
    .light & {
      background: $color-grad-light;
      box-shadow: $shadow-reverse-light;
    }
    .dark & {
      background: $color-grad-dark;
      box-shadow: $shadow-reverse-dark;
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
    > .body {
      > .input {
        .light & {
          background: $color-back-light;
        }
        .dark & {
          background: $color-back-dark;
        }
      }
    }
    > .foot {
      position: relative;
      z-index: 9;
      .light & {
        background: $color-grad-light;
        box-shadow: $shadow-reverse-light;
      }
      .dark & {
        background: $color-grad-dark;
        box-shadow: $shadow-reverse-dark;
      }
    }
  }
}
.itemSub {
  overflow: hidden;
  position: relative;
  .speed1 & {
    transition: height 1s, padding 1s, box-shadow 1s, transform 1s;
  }
  .speed2 & {
    transition: height 0.5s, padding 0.5s, box-shadow 0.5s, transform 0.5s;
  }
  .speed3 & {
    transition: height 0.25s, padding 0.25s, box-shadow 0.25s, transform 0.25s;
  }
  .light & {
    background: $color-back-light;
  }
  .dark & {
    background: $color-back-dark;
  }
  &.check {
    text-decoration: line-through;
    opacity: 0.5;
  }
  &.edit, &.drag {
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
