<script setup lang='ts'>
import * as Vue from 'vue';
import * as Const from '@/script/const/const';
import * as Lang from '@/script/lang/lang';
import * as root from '@/status/page/root';
import * as conf from '@/status/page/conf';
const lang = Vue.computed(() => Lang[root.state.conf.lang]);
</script>

<template lang='html'>
<PartLayout class="pageConf select-none"
  @touchstart.self="conf.action.swipeInit({$event})"
  @touchmove="conf.action.swipeStart({$event}),conf.action.swipeMove({$event})"
  @touchend="conf.action.swipeEnd({$event})">
  <PartLayout class="home flex column">
    <PartLayout class="head auto flex align-center padding-l gap-l">
      <IconDown class="auto" @click="root.action.routerBack()" />
      <PartText class="even font-l">{{lang.conf.title}}</PartText>
      <PartText class="auto">{{Const.Base.title}} {{Const.Base.version}}</PartText>
    </PartLayout>
    <PartLayout tag="ul" class="body even padding-l scrollXY">
      <PartLayout class="item flex align-center padding-l gap-l border-bottom-m">
        <PartText class="even">{{lang.conf.size.title}}</PartText>
        <InputRange class="even" min="1" max="3" step="1" v-model="root.state.conf.size" />
        <PartText class="auto">{{lang.conf.size.value[root.state.conf.size]}}</PartText>
      </PartLayout>
      <PartLayout class="item flex align-center padding-l gap-l border-bottom-m">
        <PartText class="even">{{lang.conf.speed.title}}</PartText>
        <InputRange class="even" min="1" max="3" step="1" v-model="root.state.conf.speed" />
        <PartText class="auto">{{lang.conf.speed.value[root.state.conf.speed]}}</PartText>
      </PartLayout>
      <PartLayout class="item flex align-center padding-l gap-l border-bottom-m">
        <PartText class="even">{{lang.conf.volume.title}}</PartText>
        <InputRange class="even" min="0" max="3" step="1" v-model="root.state.conf.volume" />
        <PartText class="auto">{{lang.conf.volume.value[root.state.conf.volume]}}</PartText>
      </PartLayout>
      <PartLayout class="item flex align-center padding-l gap-l border-bottom-m">
        <PartText class="even">{{lang.conf.vibrate.title}}</PartText>
        <InputRadio class="auto" name="vibrate" value="off"
          v-model="root.state.conf.vibrate">{{lang.conf.vibrate.off}}</InputRadio>
        <InputRadio class="auto" name="vibrate" value="on"
          v-model="root.state.conf.vibrate">{{lang.conf.vibrate.on}}</InputRadio>
      </PartLayout>
      <PartLayout class="item flex align-center padding-l gap-l border-bottom-m">
        <PartText class="even">{{lang.conf.theme.title}}</PartText>
        <InputRadio class="auto" name="theme" value="light"
          v-model="root.state.conf.theme">{{lang.conf.theme.light}}</InputRadio>
        <InputRadio class="auto" name="theme" value="dark"
          v-model="root.state.conf.theme">{{lang.conf.theme.dark}}</InputRadio>
      </PartLayout>
      <PartLayout class="item flex align-center padding-l gap-l border-bottom-m">
        <PartText class="even">{{lang.conf.lang.title}}</PartText>
        <InputRadio class="auto" name="lang" value="en"
          v-model="root.state.conf.lang">{{lang.conf.lang.en}}</InputRadio>
        <InputRadio class="auto" name="lang" value="jp"
          v-model="root.state.conf.lang">{{lang.conf.lang.jp}}</InputRadio>
      </PartLayout>
      <PartLayout class="item flex align-center padding-l gap-2l border-bottom-m">
        <PartText class="even">{{lang.conf.backup.title}}</PartText>
        <PartBase tag="a" class="auto" @click="conf.action.downloadBackup({$event})">
          <InputButton>{{lang.conf.backup.download}}</InputButton>
        </PartBase>
        <InputFile class="auto error" @change="conf.action.uploadBackup({$event})">
          {{lang.conf.backup.upload}}</InputFile>
      </PartLayout>
      <PartLayout class="item flex align-center padding-l gap-2l border-bottom-m">
        <PartText class="even">{{lang.conf.reset.title}}</PartText>
        <InputButton class="auto" @click="conf.action.resetConf()">{{lang.conf.reset.conf}}</InputButton>
        <InputButton class="auto error" @click="conf.action.resetList()">{{lang.conf.reset.list}}</InputButton>
      </PartLayout>
    </PartLayout>
  </PartLayout>
</PartLayout>
</template>

<style lang='scss' scoped>
.pageConf {
  position: absolute;
  z-index: zindex(page);
  right: 0;
  bottom: 0;
  left: 0;
  height: 200%;
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
    position: absolute;
    z-index: 1;
    right: 0;
    bottom: 0;
    left: 0;
    height: 45%;
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
        box-shadow: $shadow-normal-light;
      }
      .dark & {
        box-shadow: $shadow-normal-dark;
      }
    }
    > .body {
      > .item {
        height: 4rem;
        .light & {
          background: $color-back-light;
        }
        .dark & {
          background: $color-back-dark;
        }
      }
    }
  }
}
</style>
