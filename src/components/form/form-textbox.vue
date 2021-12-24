<script lang='ts'>
import * as Vue from 'vue';
export default Vue.defineComponent({
  inheritAttrs: false,
  props: {
    modelValue: {
      type: String,
      default: ``,
    },
  },
  emits: [`update:modelValue`],
});
</script>

<template lang='html'>
<input type="text" class="form-text" v-bind="$attrs" :value="modelValue"
  @input="$emit(`update:modelValue`, $event.target.value)"/>
</template>

<style lang='scss' scoped>
.form-text {
  @include box(null, null, 0 0.5rem, null, 2rem);
  font-size: 1rem;
  background: transparent;
  border: 0;
  outline: 0;
  &::placeholder {
    color: $color-font-half;
  }
  // ×削除(IE/Edge対応)
  &::-ms-clear {
    visibility: hidden;
  }
}
</style>
