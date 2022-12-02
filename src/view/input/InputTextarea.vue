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
<PartText
  class="inputTextarea"
  tag="textarea"
  @input="$emit(`update:modelValue`, $event.target.value)"
  v-bind="$attrs"
>
  {{modelValue}}
</PartText>
</template>

<style lang='scss' scoped>
.inputTextarea {
  resize: none;
  overflow: auto;
  margin: 0;
  padding: 0.5rem;
  line-height: 2rem;
  font-size: 1rem;
  background: transparent;
  border: none;
  outline: none;
  &::placeholder {
    color: $color-font-half;
  }
}
</style>
