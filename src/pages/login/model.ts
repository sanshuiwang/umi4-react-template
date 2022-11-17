import { reap } from "safe-reaper";

import { withMixin } from "@/utils/dva";
import { getUsers } from "@/services/login";
import { message } from "antd";

export default withMixin({
  namespace: "loginModel",
  state: {},
  effects: {
    *getUsers({ payload }: any, { put, call, select }: any): Generator<any> {
      debugger;
      try {
        const res: any = yield call(getUsers, payload);
        const code: number = reap(res, "code", 0);
        if (code !== 200) {
          return message.error("失败");
        }

        return res;
      } catch (error) {
        console.error(error);
      }
    },
  },
  reducers: {},
});
