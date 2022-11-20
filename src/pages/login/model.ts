import { reap } from "safe-reaper";
import { Effect } from "umi";
import { Reducer } from "redux";
import { withMixin } from "@/utils/dva";
import { getUsers } from "@/services/login";
import { message } from "antd";
import { AxiosResponse } from "axios";

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
  namespace: "login",
  state: {
    userInfo: {},
  },
  subscriptions: {},
  effects: {
    *getUsers({ payload }: any, { put, call, select }: any) {
      try {
        const res: Promise<AxiosResponse<any, any>> = yield call(
          getUsers,
          payload
        );

        return res;
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
