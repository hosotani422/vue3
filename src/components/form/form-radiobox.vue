<script lang='ts'>
import * as Vue from 'vue';
export default Vue.defineComponent({
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Boolean],
    },
  },
  emits: [`update:modelValue`],
});
</script>

<template lang='html'>
<label class="form-radio" :class="$attrs.class">
  <input type="radio" v-bind="$attrs" :checked="modelValue===$attrs.value"
    @change="$emit(`update:modelValue`, $event.target.value)">
  <span><slot></slot></span>
</label>
</template>

<style lang='scss' scoped>
.form-radio {
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
        border-radius: 50%;
      }
    }
    &:checked + span:after {
      content: "";
      @include position(absolute, 2, 0.6rem, auto, auto, 0.6rem - 2.5rem);
      @include box(null, null, null, 0.8rem, 0.8rem);
      background: $color-state-fine;
      border-radius: 50%;
    }
  }
}
</style>
