import { Effect } from "umi";
import { Reducer } from "redux";
import { withMixin } from "@/utils/dva";
import { getTodos } from "@/services/todo";
import { message } from "antd";
import { AxiosResponse } from "axios";
import { reap } from "safe-reaper";
import { history } from "umi";

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

const login: IModel = {
  namespace: "todo",
  state: {
    list: {},
  },
  subscriptions: {},
  effects: {
    *getTodos({ payload }: any, { put, call, select }: any) {
      try {
        const res: Promise<AxiosResponse<any, any>> = yield call(
          getTodos,
          payload
        );

        yield put({
          type: "updateState",
          payload: {
            list: res,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
  reducers: {
    // 更新状态
    updateState(state: any, { payload }: any) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default login;
