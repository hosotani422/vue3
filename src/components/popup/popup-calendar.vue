<script lang='ts'>
import * as Vue from 'vue';
import * as calendar from '@/composition/popup/calendar';
export default Vue.defineComponent({
  setup: () => calendar,
});
</script>

<template lang='html'>
<transition name="fade">
  <div class="popup-calendar" v-if="state.open"
    @touchmove="action.swipeStart({
      x:$event.changedTouches[0].clientX,y:$event.changedTouches[0].clientY}),
      action.swipeMove({x:$event.changedTouches[0].clientX,y:$event.changedTouches[0].clientY})"
    @touchend="action.swipeEnd({
      x:$event.changedTouches[0].clientX,y:$event.changedTouches[0].clientY})">
    <div class="home">
      <div class="head">
        <div class="month">
          <svg class="prev" @click="action.pageMove({prev:true})">
            <use href="@/assets/image/icon.svg#prev"/>
          </svg>
          <h4 class="title">{{state.current}}</h4>
          <svg class="next" @click="action.pageMove({prev:false})">
            <use href="@/assets/image/icon.svg#next"/>
          </svg>
        </div>
        <ul class="week">
          <li class="item" :key="`week${week}`"
            v-for="week of getter.labelWeek.value()">{{week}}</li>
        </ul>
      </div>
      <div class="body">
        <div class="area" @touchstart="action.swipeInit({target:$event.currentTarget,
          x:$event.changedTouches[0].clientX,y:$event.changedTouches[0].clientY})">
          <ul class="month" :key="`month${month.id}`" v-for="month of getter.labelDay.value()">
            <li class="day" :class="{select:day.select,today:day.today,hide:day.hide}"
              :key="`day${month.id}${day.id}`" v-for="day of month.day"
              @click="state.callback(day.id)">{{day.text}}</li>
          </ul>
        </div>
      </div>
      <div class="foot">
        <FormButton class="cancel" @click="action.close()">{{state.cancel}}</FormButton>
        <FormButton class="clear" @click="state.callback(``)">{{state.clear}}</FormButton>
      </div>
    </div>
  </div>
</transition>
</template>

<style lang='scss' scoped>
.popup-calendar {
  @include flex(flex, row, center);
  @include position(absolute, zindex(picker), 0, 0, 0, 0);
  @include box(null, null, 2rem 2.5rem);
  @include transition(fade, opacity, 1s) {
    opacity: 0 !important;
  }
  .light & {
    background: $color-mask-light;
  }
  .dark & {
    background: $color-mask-dark;
  }
  > .home {
    @include flex(flex, column);
    @include box(null, null, null, 100%);
    max-height: 100%;
    border-radius: 2px;
    .light & {
      background: $color-back-light;
      box-shadow: $shadow-normal-light;
    }
    .dark & {
      background: $color-back-dark;
      box-shadow: $shadow-normal-dark;
    }
    > .head {
      @include box(null, null, 1rem 1rem 0);
      > .month {
        @include flex(flex, row, center, center);
        @include box(null, null, null, null, 3rem);
        > .prev {
          @include position(relative, auto, auto, auto, auto, -0.35rem);
          @include box(null, null, 0.75rem, null, 3.5rem);
          flex: 0 0 3.5rem;
          .light & {
            color: $color-font-light;
          }
          .dark & {
            color: $color-font-dark;
          }
        }
        > .title {
          flex: 1 1 auto;
          text-align: center;
          .light & {
            color: $color-font-light;
          }
          .dark & {
            color: $color-font-dark;
          }
        }
        > .next {
          @include position(relative, auto, auto, auto, auto, 0.35rem);
          @include box(null, null, 0.75rem, null, 3.5rem);
          flex: 0 0 3.5rem;
          .light & {
            color: $color-font-light;
          }
          .dark & {
            color: $color-font-dark;
          }
        }
      }
      > .week {
        @include flex();
        > .item {
          @include flex(flex, row, center, center);
          @include box(null, null, null, null, 2.5rem);
          flex: 1 1 0;
          font-size: 0.75rem;
          .light & {
            color: $color-font-light;
          }
          .dark & {
            color: $color-font-dark;
          }
        }
      }
    }
    > .body {
      @include position(relative);
      overflow: hidden;
      flex: 1 1 auto;
      > .area {
        @include flex();
        @include position(relative, 1);
        @include box(null, null, null, 300%, 15rem);
        transform: translateX(-100% * calc(1 / 3));
        transition-property: none;
        &.prev, &.next, &.back {
          @include transition(null, transform, 0.5s);
        }
        &.prev {
          transform: translateX(0%);
        }
        &.next {
          transform: translateX(-100% * calc(2 / 3));
        }
        &.back {
          transform: translateX(-100% * calc(1 / 3));
        }
        > .month {
          @include flex(flex, row, stretch, flex-start, null, wrap);
          @include box(null, null, 0 1rem);
          flex: 1 1 0;
          > .day {
            @include flex(flex, row, center, center);
            @include box(null, null, null, null, 2.2rem);
            flex: 0 0 calc(100% / 7);
            font-size: 0.75rem;
            border: solid 1px transparent;
            .light & {
              color: $color-font-light;
            }
            .dark & {
              color: $color-font-dark;
            }
            &.select {
              color: $color-font-dark;
              background: $color-state-fine;
            }
            &.today {
              border: solid 1px $color-state-fine;
              .light & {
                box-shadow: 0 0 0 1px $color-back-light inset;
              }
              .dark & {
                box-shadow: 0 0 0 1px $color-back-dark inset;
              }
            }
            &.hide {
              visibility: hidden;
            }
          }
        }
      }
    }
    > .foot {
      @include flex(flex, row, center, flex-end);
      flex: 0 0 3.5rem;
      > .cancel {
        flex: 0 0 auto;
      }
      > .clear {
        flex: 0 0 auto;
        color: $color-state-error;
      }
    }
  }
}
</style>
