<script setup lang='ts'>
import * as Vue from 'vue';
import * as Cordova from '@/script/cordova/cordova';
import * as root from '@/status/page/root';
Vue.onBeforeMount(() => {
  Cordova.Admob.mountBanner();
  root.action.initPage();
});
Vue.onMounted(() => {
  Cordova.Splash.hideMount();
});
</script>

<template lang='html'>
<PartLayout class="pageRoot flex column"
  :class="`speed${root.state.conf.speed} ${root.state.conf.theme}`">
  <PartLayout class="even">
    <router-view name="main" />
    <router-view name="sub" v-slot="{Component}">
      <transition>
        <component :is="Component" />
      </transition>
    </router-view>
    <PopupCalendar />
    <PopupClock />
    <PopupDialog />
    <PopupNotice />
  </PartLayout>
  <PartLayout class="foot" :class="root.getter.classFoot.value" v-if="root.getter.mode.value===`app`" />
</PartLayout>
</template>

<style lang='scss' scoped>
.pageRoot {
  position: fixed;
  z-index: 1;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  > .foot {
    background: $color-back-dark;
    &.small {
      flex: 0 0 32px;
    }
    &.middle {
      flex: 0 0 50px;
    }
    &.large {
      flex: 0 0 90px;
    }
  }
}
</style>
