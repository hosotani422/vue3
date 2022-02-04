<script lang='ts'>
import * as Vue from 'vue';
import * as Cordova from '@/assets/script/cordova/cordova';
import PopupCalendar from '@/components/popup/popup-calendar.vue';
import PopupDialog from '@/components/popup/popup-dialog.vue';
import PopupNotice from '@/components/popup/popup-notice.vue';
import PopupClock from '@/components/popup/popup-clock.vue';
import * as page from '@/composition/pages/page';
export default Vue.defineComponent({
  setup: () => page,
  components: {
    PopupCalendar,
    PopupDialog,
    PopupNotice,
    PopupClock,
  },
  computed: {
    mode() {
      return process.env.VUE_APP_MODE;
    },
    classFoot() {
      if (window.outerHeight <= 400) {
        return `small`;
      } else if (window.outerHeight <= 720) {
        return `middle`;
      }
      return `large`;
    },
  },
  beforeMount() {
    Cordova.Admob.mountBanner();
    page.action.init();
  },
  mounted() {
    Cordova.Splash.hideMount();
  },
});
</script>

<template lang='html'>
<div class="app" :class="`size${state.conf.size} speed${state.conf.speed} ${state.conf.theme}`">
  <div class="body">
    <router-view name="main"></router-view>
    <router-view name="sub" v-slot="{Component}">
      <transition>
        <component :is="Component"/>
      </transition>
    </router-view>
    <PopupCalendar></PopupCalendar>
    <PopupDialog></PopupDialog>
    <PopupNotice></PopupNotice>
    <PopupClock></PopupClock>
  </div>
  <div class="foot" :class="classFoot" v-if="mode===`app`"></div>
</div>
</template>

<style lang='scss' scoped>
.size1 {
  font-size: 14px;
}
.size2 {
  font-size: 16px;
}
.size3 {
  font-size: 18px;
}
.app {
  @include flex(flex, column);
  @include position(fixed, 1, 0, 0, 0, 0);
  > .body {
    @include position(relative);
    flex: 1 1 auto;
  }
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
