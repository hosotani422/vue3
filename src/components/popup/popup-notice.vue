<script lang='ts'>
import * as Vue from 'vue';
import * as notice from '@/composition/popup/notice';
export default Vue.defineComponent({
  setup: () => notice,
});
</script>

<template lang='html'>
<transition name="move">
  <div class="popup-notice" v-if="state.open">
    <p class="message">{{state.message}}</p>
    <FormButton class="button" @click="state.callback()">{{state.button}}</FormButton>
  </div>
</transition>
</template>

<style lang='scss' scoped>
.popup-notice {
  @include flex(flex, row, center);
  @include position(absolute, zindex(notice), auto, 0.75rem, 1rem, 0.75rem);
  border-radius: 2px;
  @include transition(move, transform, 1s) {
    transform: translateY(4rem) !important;
  }
  .light & {
    background: $color-back-light;
    box-shadow: $shadow-normal-light;
  }
  .dark & {
    background: $color-back-dark;
    box-shadow: $shadow-normal-dark;
  }
  > .message {
    @include box(null, null, 1rem);
    flex: 1 1 0;
    font-size: 0.75rem;
    .light & {
      color: $color-font-light;
    }
    .dark & {
      color: $color-font-dark;
    }
  }
  > .button {
    flex: 0 0 auto;
  }
}
</style>
