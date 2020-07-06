import request from "umi-request";

import useAsync from "./index";

function useRequest(service: any, option?: any) {
  let promiseService: () => Promise<any>;

  // 处理字符串  对象 还有函数的问题
  if (typeof service === "string") {
    promiseService = () => request(service);
  } else if (typeof service === "object") {
    const { url, ...rest } = service;
    promiseService = () => request(url, rest);
  } else {
    promiseService = (...args) =>
      new Promise((resolve) => {
        const result = service(...args);
        if (typeof result === "string") {
          request(result).then((data) => {
            resolve(data);
          });
        } else if (typeof result === "object") {
          request(result).then((data) => {
            resolve(data);
          });
        }
      });
  }

  return useAsync(promiseService, option);
}

export default useRequest;
