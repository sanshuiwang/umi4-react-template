import { Effect } from 'umi';
import { Reducer } from 'redux';
import { getUsers } from '@/services/login';
import { AxiosResponse } from 'axios';
interface IModel {
  namespace?: string;
  state: {
    [propName: string]: any;
  };
  subscriptions: {
    [propName: string]: () => any;
  };
  effects: {
    [propName: string]: Effect;
  };
  reducers: {
    [propName: string]: Reducer;
  };
}

const login: IModel = {
  namespace: 'login',
  state: {
    userInfo: {},
  },
  subscriptions: {},
  effects: {
    *getUsers({ payload }: any, { put, call }: any) {
      try {
        const res: Promise<AxiosResponse<any, any>> = yield call(getUsers, payload);

        yield put({
          type: 'updateState',
          payload: {
            userInfo: res,
          },
        });

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
