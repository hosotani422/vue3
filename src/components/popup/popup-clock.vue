<script lang='ts'>
import * as Vue from 'vue';
import * as clock from '@/composition/popup/clock';
export default Vue.defineComponent({
  setup: () => clock,
});
</script>

<template lang='html'>
<transition name="fade">
  <div class="popup-clock" v-if="state.open">
    <div class="home">
      <div class="body">
        <canvas class="item-hour"
          @touchstart="action.inputHour({target:$event.target,
            x:$event.touches[0].pageX,y:$event.touches[0].pageY})"
          @touchmove="action.inputHour({target:$event.target,
            x:$event.touches[0].pageX,y:$event.touches[0].pageY})"></canvas>
        <canvas class="item-minute"
          @touchstart="action.inputMinute({target:$event.target,
            x:$event.touches[0].pageX,y:$event.touches[0].pageY})"
          @touchmove="action.inputMinute({target:$event.target,
            x:$event.touches[0].pageX,y:$event.touches[0].pageY})"></canvas>
      </div>
      <div class="foot">
        <FormButton class="cancel" @click="action.close()">{{state.cancel}}</FormButton>
        <FormButton class="clear" @click="state.callback(``,``)">{{state.clear}}</FormButton>
        <FormButton class="ok" @click="state.callback(state.hour,state.minute)">
          {{state.ok}}</FormButton>
      </div>
    </div>
  </div>
</transition>
</template>

<style lang='scss' scoped>
.popup-clock {
  @include flex(flex, row, center, center);
  @include position(absolute, zindex(picker), 0, 0, 0, 0);
  @include box(null, null, 2rem 2.5rem);
  @include transition(fade, opacity, 1s) {
    opacity: 0 !important;
  }
  .light & {
    background: $color-mask-light;
  }
  .dark & {
    background: $color-mask-dark;
  }
  > .home {
    @include flex(flex, column);
    @include box(null, null, null, 100%, 100%);
    border-radius: 2px;
    .light & {
      background: $color-back-light;
      box-shadow: $shadow-normal-light;
    }
    .dark & {
      background: $color-grad-dark;
      box-shadow: $shadow-normal-dark;
    }
    > .body {
      @include flex(flex, column, center);
      flex: 1 1 0;
      > .item-hour {
        @include box(null, 1rem 1rem 0);
        flex: 1 1 0;
      }
      > .item-minute {
        @include box(null, 1rem 1rem 0);
        flex: 1 1 0;
      }
    }
    > .foot {
      @include flex(flex, row, center, flex-end);
      flex: 0 0 3.5rem;
      > .cancel {
        flex: 0 0 auto;
      }
      > .clear {
        flex: 0 0 auto;
        color: $color-state-error;
      }
      > .ok {
        flex: 0 0 auto;
        color: $color-state-error;
      }
    }
  }
}
</style>
