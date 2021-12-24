import * as page from '@/composition/pages/page';

export const listId = `1`;

export const list: typeof page.state.list = {
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

export const conf: typeof page.state.conf = {
  size: `2`,
  speed: `2`,
  volume: `2`,
  vibrate: true,
  theme: `light`,
  lang: `jp`,
};
