export const common = {
  cancel: `キャンセル`,
  clear: `クリア`,
  ok: `決定`,
} as const;

export const page = {
  list: `リスト`,
  main: `タスク`,
  sub: `サブタスク`,
  memo: `メモ`,
  date: `日付`,
  time: `時刻`,
  alarm: `アラーム`,
} as const;

export const dialog = {
  selectAll: `全選択`,
  selectNone: `未選択`,
  insert: `新規登録`,
  move: `移動先の選択`,
  delete: `本当に削除しますか`,
  reset: `本当にリセットしますか`,
  backup: `バックアップが完了しました`,
  backupError: `バックアップが失敗しました`,
  fileError: `ファイルの形式が違います`,
  alarm: {
    title: `通知タイミングの選択`,
    sort: [`1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`],
    data: {
      "1": {label: `時刻通り`, value: 0},
      "2": {label: `5分前`, value: 5},
      "3": {label: `10分前`, value: 10},
      "4": {label: `15分前`, value: 15},
      "5": {label: `30分前`, value: 30},
      "6": {label: `1時間前`, value: 60},
      "7": {label: `2時間前`, value: 120},
      "8": {label: `3時間前`, value: 180},
      "9": {label: `6時間前`, value: 360},
      "10": {label: `12時間前`, value: 720},
      "11": {label: `1日前`, value: 1440},
      "12": {label: `2日前`, value: 2880},
    },
  },
} as const;

export const date = {
  week: [`日`, `月`, `火`, `水`, `木`, `金`, `土`],
} as const;

export const notice = {
  message: `削除が完了しました`,
  button: `元に戻す`,
} as const;

export const conf = {
  title: `設定`,
  size: {
    title: `文字サイズ`,
    value: {
      "1": `小`,
      "2": `中`,
      "3": `大`,
    },
  },
  speed: {
    title: `アニメ速度`,
    value: {
      "1": `低`,
      "2": `中`,
      "3": `高`,
    },
  },
  volume: {
    title: `音量`,
    value: {
      "0": `無`,
      "1": `小`,
      "2": `中`,
      "3": `大`,
    },
  },
  vibrate: {
    title: `振動`,
    off: `無`,
    on: `有`,
  },
  theme: {
    title: `テーマ`,
    light: `明`,
    dark: `暗`,
  },
  lang: {
    title: `言語`,
    en: `英語`,
    jp: `日本語`,
  },
  backup: {
    title: `バックアップ`,
    download: `保存`,
    upload: `復元`,
  },
  reset: {
    title: `リセット`,
    conf: `設定`,
    list: `メモ`,
  },
  about: {
    title: `概要`,
  },
} as const;

export const alarm = {
  title: `Memotea アラーム`,
} as const;
