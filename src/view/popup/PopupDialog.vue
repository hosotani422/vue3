<script setup lang='ts'>
import * as Vue from 'vue';
import * as Lang from '@/script/lang/lang';
import * as root from '@/status/page/root';
import * as dialog from '@/status/popup/dialog';
const lang = Vue.computed(() => Lang[root.state.conf.lang]);
</script>

<template lang='html'>
<PopupModal class="popupDialog" :open="dialog.state.open">
  <PartText class="head auto" v-if="dialog.state.title">{{dialog.state.title}}</PartText>
  <PartLayout class="body flex column gap-l scrollXY">
    <PartText class="label" v-if="dialog.state.message">{{dialog.state.message}}</PartText>
    <InputTextbox class="text" :placeholder="dialog.state.text.placeholder"
      v-focus v-model="dialog.state.text.value" v-if="dialog.state.mode===`text`" />
    <InputCheck class="check block" v-if="dialog.state.mode===`check`&&dialog.state.check.all"
      :modelValue="dialog.getter.stateCheckAll.value()"
      @change="dialog.action.clickCheckAll({event:$event})">{{lang.dialog.selectAll}}</InputCheck>
    <InputCheck class="check block" :key="`check${id}`"
      v-for="id of dialog.state.check.sort" v-if="dialog.state.mode===`check`"
      v-model="dialog.state.check.data[id].check">{{dialog.state.check.data[id].title}}</InputCheck>
    <InputRadio class="radio block" name="radio" value="" :label="lang.dialog.selectNone"
      v-if="dialog.state.mode===`radio`&&dialog.state.radio.none">{{dialog.state.radio.select}}</InputRadio>
    <InputRadio class="radio block" name="radio" :value="id" v-if="dialog.state.mode===`radio`"
      :key="`radio${id}`" v-for="id of dialog.state.radio.sort"
      v-model="dialog.state.radio.select">{{dialog.state.radio.data[id].title}}</InputRadio>
  </PartLayout>
  <PartLayout class="flex align-center justify-end gap-2l">
    <InputButton class="auto"
      @click="dialog.state.cancel.callback()">{{dialog.state.cancel.name}}</InputButton>
    <InputButton class="auto error" v-if="dialog.state.mode!==`alert`"
      @click="dialog.state.ok.callback()">{{dialog.state.ok.name}}</InputButton>
  </PartLayout>
</PopupModal>
</template>

<style lang='scss' scoped>
.popupDialog {
  ::v-deep(.head) {
    white-space: pre-line;
  }
  ::v-deep(.body) {
    > .label {
      white-space: pre-line;
      word-break: break-all;
    }
    > .text {
      border-bottom: 0.1rem solid $color-state-fine;
    }
  }
}
</style>
