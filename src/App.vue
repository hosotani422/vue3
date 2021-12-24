<script lang='ts'>
import * as Vue from 'vue';
import * as Vuex from 'vuex';
import * as Cordova from '@/assets/script/cordova/cordova';
import PageMain from '@/views/main.vue';
import PopupDate from '@/components/popup/popup-date.vue';
import PopupDialog from '@/components/popup/popup-dialog.vue';
import PopupNotice from '@/components/popup/popup-notice.vue';
import PopupTime from '@/components/popup/popup-time.vue';
export default Vue.defineComponent({
  components: {
    PageMain,
    PopupDate,
    PopupDialog,
    PopupNotice,
    PopupTime,
  },
  computed: {
    mode() {
      return process.env.mode;
    },
    classFoot() {
      if (window.outerHeight <= 400) {
        return `small`;
      } else if (window.outerHeight <= 720) {
        return `middle`;
      }
      return `large`;
    },
    ...Vuex.mapState(`pages`, [
      `page`,
    ]),
  },
  methods: {
    ...Vuex.mapActions(`pages/page`, [
      `init`,
    ]),
  },
  beforeMount() {
    Cordova.Admob.mountBanner();
    this.init();
  },
  mounted() {
    Cordova.Splash.hideMount();
  },
});
</script>

<template lang='html'>
<div class="app" :class="`size${page.conf.size} speed${page.conf.speed} ${page.conf.theme}`">
  <div class="body">
    <router-view name="main"></router-view>
    <router-view name="sub" v-slot="{Component}">
      <transition>
        <component :is="Component"/>
      </transition>
    </router-view>
    <PopupDate></PopupDate>
    <PopupDialog></PopupDialog>
    <PopupNotice></PopupNotice>
    <PopupTime></PopupTime>
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
