import axios from "axios";
import { message } from "antd";

let reqList: any[] = [];

const stopRepeatRequest = function (
  reqList: any[],
  url: string,
  cancel: Function,
  errorMessage: any
) {
  const errorMsg = errorMessage || "";
  for (let i = 0; i < reqList.length; i++) {
    if (reqList[i] === url) {
      cancel(errorMsg);
      return;
    }
  }
  reqList.push(url);
};

const allowOpenRequest = function (reqList: any[], url: string) {
  for (let i = 0; i < reqList.length; i++) {
    if (reqList[i] === url) {
      reqList.splice(i, 1);
      break;
    }
  }
};

const configHeaders = () => {
  let headers = {};

  return headers;
};

function createAPI(host: string) {
  const API = axios.create({
    baseURL: host,
  });

  API.interceptors.request.use(
    (config: any) => {
      Object.assign(config.headers, configHeaders());

      let cancel: Function = () => {};
      config.cancelToken = new axios.CancelToken(function (c: Function) {
        cancel = c;
      });
      stopRepeatRequest(
        reqList,
        config.url,
        cancel,
        `${config.url} 重复的请求被中断`
      );

      return config;
    },
    (error: any) => {
      message.error(`Axios request:: ${error.message}`);
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  API.interceptors.response.use(
    (response: any) => {
      setTimeout(() => {
        allowOpenRequest(reqList, response.config.url);
      }, 1000);

      const { data } = response;
      const { code } = data;
      if (code !== 200) {
        // TODO: 处理全局错误信息
        // showGlobalErrorMessage(code)
        return data;
      }

      return data;
    },
    (error: any) => {
      if (axios.isCancel(error)) {
        message.error(`Axios response is cancel:: ${error.message}`);
      } else {
        setTimeout(() => {
          allowOpenRequest(reqList, error.config.url);
        }, 1000);
      }

      console.error("Axios response:: ", error.message);
      return Promise.reject(error);
    }
  );

  return API;
}

export default createAPI;
