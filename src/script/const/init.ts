import * as root from '@/status/page/root';

export const listId = `1`;

export const list: typeof root.state.list = {
  sort: [`1`, `2`],
  data: {
    "1": {
      status: ``,
      title: `Inbox`,
      sort: [],
      data: {},
    },
    "2": {
      status: ``,
      title: `Trash`,
      sort: [],
      data: {},
    },
  },
};

export const conf: typeof root.state.conf = {
  size: 2,
  speed: 2,
  volume: 2,
  vibrate: `on`,
  theme: `light`,
  lang: `jp`,
};
