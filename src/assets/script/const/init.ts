export const listId = `1` as const;

export const list = {
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
} as const;

export const conf = {
  size: `2`,
  speed: `2`,
  volume: `2`,
  vibrate: true,
  theme: `light`,
  lang: `jp`,
} as const;
