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
<textarea class="form-textarea" v-bind="$attrs"
  @input="$emit(`update:modelValue`, $event.target.value)">{{modelValue}}</textarea>
</template>

<style lang='scss' scoped>
.form-textarea {
  @include box(null, null, 0.5rem);
  // スクロールバー非表示(IE対応)
  overflow: auto;
  line-height: 1.25rem;
  font-size: 1rem;
  background: transparent;
  border: 0;
  outline: 0;
  // サイズ変更無効化(Chrome対応)
  resize: none;
  &::placeholder {
    color: $color-font-half;
  }
}
</style>
