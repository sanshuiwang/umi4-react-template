import { Effect } from "umi";
import { Reducer } from "redux";

interface IModel {
  namespace?: string;
  state: {
    [propName: string]: any;
  };
  subscriptions: {
    [propName: string]: Function;
  };
  effects: {
    [propName: string]: Effect;
  };
  reducers: {
    [propName: string]: Reducer;
  };
}

export function withMixin(model: IModel) {
  if (!model) {
    throw new Error("model cannot be empty");
  }

  let mixed: IModel = {
    state: {},
    subscriptions: {},
    effects: {},
    reducers: {},
  };

  if (model.namespace) {
    mixed.namespace = model.namespace;
  }
  mixed.state = model.state;
  mixed.subscriptions = model.subscriptions;
  mixed.effects = model.effects;
  mixed.reducers = Object.assign(
    {
      // 更新状态
      updateState(state: any, { payload }: any) {
        return {
          ...state,
          ...payload,
        };
      },
    },
    model.reducers
  );

  return mixed;
}
