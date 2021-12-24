<script lang='ts'>
import * as Vue from 'vue';
export default Vue.defineComponent({
  inheritAttrs: false,
});
</script>

<template lang='html'>
<button class="form-button" v-bind="$attrs"><slot></slot></button>
</template>

<style lang='scss' scoped>
.form-button {
  @include box(null, null, 0 1rem, null, 2rem);
  user-select: none;
  font-size: 1rem;
  color: $color-state-fine;
  background: transparent;
  border: 0;
  outline: 0;
}
</style>
