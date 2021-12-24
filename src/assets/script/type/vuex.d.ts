interface Getters<S = any, R = any> {
  [K: string]: (state: S, getters: any, rootState: R, rootGetters: any) => any;
}

interface Actions<S = any, R = any> {
  [K: string]: (
    context: {
      state: S;
      getters: any;
      rootState: R;
      rootGetters: any;
      dispatch: (type: string, payload?: any, options?: {root?: boolean;}) => Promise<any>;
      commit: (type: string, payload?: any, options?: {silent?: boolean; root?: boolean;}) => void;
    },
    payload: any,
  ) => any;
}

interface Mutations<S = any> {
  [K: string]: (state: S, payload: any) => void;
}
