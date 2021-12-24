<script lang='ts'>
import * as Vue from 'vue';
export default Vue.defineComponent({
  inheritAttrs: false,
  props: {
    modelValue: {
      type: String,
    },
  },
  emits: [`update:modelValue`],
});
</script>

<template lang='html'>
<input type="range" class="form-range" v-bind="$attrs" :value="modelValue"
  @input="$emit(`update:modelValue`, $event.target.value)"/>
</template>

<style lang='scss' scoped>
.form-range {
  @include box(null, null, null, 100%, 2px);
  appearance: none;
  background: $color-line-light;
  border-radius: 0.25rem;
  &::-webkit-slider-thumb {
    @include box(null, null, null, 1rem, 1rem);
    appearance: none;
    background: $color-state-fine;
    border-radius: 50%;
  }
}
</style>
