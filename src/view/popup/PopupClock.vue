<script setup lang='ts'>
import * as clock from '@/status/popup/clock';
</script>

<template lang='html'>
<PopupModal class="popupClock" :open="clock.state.open">
  <PartLayout class="even flex column align-center gap-l">
    <PartLayout tag="canvas" id="itemHour" class="even"
      @touchstart="clock.action.inputHour({event:$event})"
      @touchmove="clock.action.inputHour({event:$event})" />
    <PartLayout tag="canvas" id="itemMinute" class="even"
      @touchstart="clock.action.inputMinute({event:$event})"
      @touchmove="clock.action.inputMinute({event:$event})" />
  </PartLayout>
  <PartLayout class="auto flex align-center justify-end gap-2l">
    <InputButton class="auto" @click="clock.action.close()">{{clock.state.cancel}}</InputButton>
    <InputButton class="auto error" @click="clock.state.callback()">{{clock.state.clear}}</InputButton>
    <InputButton class="auto error"
      @click="clock.state.callback(clock.state.hour,clock.state.minute)">{{clock.state.ok}}</InputButton>
  </PartLayout>
</PopupModal>
</template>

<style lang='scss' scoped>
.popupClock {
  ::v-deep(.home) {
    height: 80%;
  }
}
</style>
