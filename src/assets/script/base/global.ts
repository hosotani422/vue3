const Global: {
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
  timeoutId: 0,
  drag: {},
  swipe: {},
};

export default Global;
