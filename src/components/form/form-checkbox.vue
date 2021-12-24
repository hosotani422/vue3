<script lang='ts'>
import * as Vue from 'vue';
export default Vue.defineComponent({
  inheritAttrs: false,
});
</script>

<template lang='html'>
<label class="form-checkbox" :class="$attrs.class">
  <input type="checkbox" v-bind="$attrs"/>
  <span><slot></slot></span>
</label>
</template>

<style lang='scss' scoped>
.form-checkbox {
  user-select: none;
  > input {
    @include position(absolute);
    opacity: 0;
    + span {
      @include position(relative);
      @include box(inline-block, 0 0 0 2.5rem);
      min-height: 2rem;
      line-height: 2rem;
      &:before {
        content: "";
        @include position(absolute, 1, 0, auto, auto, -2.5rem);
        @include box(null, null, null, 2rem, 2rem);
        background: transparent;
        border: solid 1px $color-line-light;
      }
    }
    &:checked + span:after {
      content: "";
      @include position(absolute, 2, 0.32rem, auto, auto, 0.64rem - 2.5rem);
      @include box(null, null, null, 0.7rem, 1.1rem);
      border-right: solid 2px $color-state-fine;
      border-bottom: solid 2px $color-state-fine;
      transform: rotate(45deg);
    }
  }
}
</style>
