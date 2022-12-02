import * as VueRouter from 'vue-router';

const Global: {
  route: VueRouter.RouteLocationNormalizedLoaded | null;
  router: VueRouter.Router | null;
  timeoutId: number;
  drag: {
    id?: string;
    y?: number;
    top?: number;
    left?: number;
    width?: number;
    height?: number;
    clone?: HTMLElement;
  };
  swipe: {
    status?: `start` | `move` | `end`;
    target?: HTMLElement;
    x?: number;
    y?: number;
    side?: number;
    listener?: () => void;
  };
} = {
  route: null,
  router: null,
  timeoutId: 0,
  drag: {},
  swipe: {},
};

export default Global;
