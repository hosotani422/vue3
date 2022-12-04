<script setup lang='ts'>
import * as Vue from 'vue';
import * as Cordova from '@/script/cordova/cordova';
import * as root from '@/composables/page/root';
Vue.onBeforeMount(() => {
  Cordova.Admob.mountBanner();
  root.action.initPage();
});
Vue.onMounted(() => {
  Cordova.Splash.hideMount();
});
</script>

<template>
<PartLayout class="pageRoot flex column" :class="root.getter.classTop()">
  <PartLayout class="even">
    <router-view />
    <PopupCalendar />
    <PopupClock />
    <PopupDialog />
    <PopupNotice />
  </PartLayout>
  <PartLayout class="foot" :class="root.getter.classFoot()" v-if="root.getter.isApp()" />
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
