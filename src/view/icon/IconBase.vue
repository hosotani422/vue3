<script lang='ts'>
import * as Vue from 'vue';
export default Vue.defineComponent({
  inheritAttrs: false,
  props: {
    tag: {
      type: String,
      default: `i`,
    },
    viewBox: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
});
</script>

<template lang='html'>
<PartText
  class="iconBase"
  :tag="tag"
  v-bind="$attrs"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    :aria-label="name"
    :viewBox="viewBox">
    <title
      :id="name"
      lang="en"
    >
      {{name}} icon
    </title>
    <slot />
  </svg>
</PartText>
</template>

<style lang='scss' scoped>
.iconBase {
  width: 2rem;
}
</style>
