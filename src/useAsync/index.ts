import { useState, useCallback, useEffect, useRef } from "react";
import usePersistFn from "../usePersistFn";
import useUpdateEffect from "../useUpdateEffect";
import { FetchConfig } from "./type";

const DEFAULT_KEY = "USE_API_DEFAULT_KEY";

type noop<T> = (...args: any[]) => Promise<T>;

class Fetch<R, P extends any[]> {
  config: any;

  service: any;
  // 请求时序
  count = 0;
  // 是否卸载
  unmountedFlag = false;

  subscribe: any;

  unsubscribe: any;

  that: any = this;

  state = {
    loading: false,
    params: [] as any,
    data: undefined,
    error: undefined,
    run: this.run.bind(this.that),
    mutate: this.mutate.bind(this.that),
    refresh: this.refresh.bind(this.that),
    cancel: this.cancel.bind(this.that),
    unmount: this.unmount.bind(this.that),
  };

  constructor(
    service: any,
    config: any,
    subscribe: any,
    initState?: { data?: any; error?: any; params?: any; loading?: any }
  ) {
    this.service = service;
    this.config = config;
    this.subscribe = subscribe;

    if (initState) {
      this.state = {
        ...this.state,
        ...initState,
      };
    }
  }

  setState(s = {}) {
    this.state = {
      ...this.state,
      ...s,
    };
    // 对接外部的useState
    this.subscribe(this.state);
  }

  // 内部实际调用
  _run(...args: any[]) {
    this.count += 1;

    const currentCount = this.count;

    this.setState({
      loading: false,
      params: args,
    });

    return this.service(...args)
      .then((res: any) => {
        // TODO 1. 配置中可以做网络请求的数据格式化处理
        // TODO 2. 因为可以做状态的变化事件的监听
        // TODO 3. 判断 是否卸载与count匹配
        if (!this.unmountedFlag && currentCount === this.count) {
          const formattedResult = this.config.for;

          this.setState({
            data: formattedResult,
            error: undefined,
            loading: false,
          });

          if (this.config.onSuccess) {
            this.config.onSuccess(res, args);
          }

          return formattedResult;
        }
      })
      .catch((err: any) => {
        this.setState({
          data: undefined,
          error: err,
          loading: false,
        });

        if (this.config.onError) {
          this.config.onError(err, args);
        }

        console.error(err);
      })
      .finally(() => {
        // 做一些条件的轮训请求
      });
  }

  run(...args: P) {
    // 此处可以根据配置做防抖与节流操作
    return this._run(...args);
  }

  cancel() {
    // TODO 判断是否有节流与防抖函数
    // TODO 判断是否有轮训函数

    this.count += 1;
    this.setState({
      loading: false,
    });
  }

  mutate(data: any) {
    if (typeof data === "function") {
      this.setState({
        data: data(this.state.data) || {},
      });
    } else {
      this.setState({
        data,
      });
    }
  }

  refresh() {
    return this.run(...this.state.params);
  }

  unmount() {
    this.unmountedFlag = true;
    this.cancel();
    this.unsubscribe.forEach((s: any) => {
      s();
    });
  }
}

const useAsync = (service: any, options?: any) => {
  const _options = options || {};
  const {
    refreshDeps = [],
    manual = false,
    onSuccess = () => {},
    onError = () => {},

    defaultLoading = false,
    defaultParams = [],
    fetchKey,
    cacheKey,
    initialData,
  } = _options;

  // 持久化一些函数
  const servicePersist = usePersistFn(service);

  const onSuccessPersist = usePersistFn(onSuccess);

  const onErrorPersist = usePersistFn(onError);
  // 用于生成唯一key标识
  const fetchKeyPersist = usePersistFn(fetchKey);

  const config = {
    onSuccess: onSuccessPersist,
    onError: onErrorPersist,
  };

  const newstFetchKey = useRef(DEFAULT_KEY);
  newstFetchKey.current = DEFAULT_KEY;

  const [fetches, setFetches] = useState<any>(() => {
    return {};
  });

  const subscribe = usePersistFn((key: string, data: any) => {
    setFetches((s) => {
      // eslint-disable-next-line no-param-reassign
      s[key] = data;
      return { ...s };
    });
  }) as any;

  const fetchesRef = useRef(fetches);
  fetchesRef.current = fetches;

  const run = useCallback((...args) => {
    // 生成key
    if (fetchKeyPersist) {
      const key = fetchKeyPersist(...args);
      newstFetchKey.current = key === undefined ? DEFAULT_KEY : key;
    }
    const currentFetchKey = newstFetchKey.current as any;

    let currentFetch = fetchesRef.current[currentFetchKey] as any;

    if (!currentFetch) {
      const newFetch = new Fetch(
        servicePersist,
        config,
        subscribe.bind(null, currentFetchKey),
        { data: initialData }
      );

      currentFetch = newFetch.state;

      setFetches((s: any) => {
        s[currentFetchKey] = currentFetch;
        return { ...s };
      });
    }

    return currentFetch.run(...args);
  }, []);

  // 缓存处理
  useEffect(() => {}, []);

  // 第一次默认执行
  useEffect(() => {
    if (!manual) {
      if (Object.keys(fetches).length > 0) {
        // 重新执行所有的`
        Object.values(fetches).forEach((f) => {
          // f.refresh();
        });
      } else {
        run(...(defaultParams as any));
      }
    }
  }, []);

  const reset = useCallback(() => {
    Object.values(fetchesRef.current).forEach((f) => {
      // f.unmount();
    });

    newstFetchKey.current = DEFAULT_KEY;
    // 执行新的顺序
    setFetches({});
    // 保障数据同步
    fetchesRef.current = {};
  }, [setFetches]);

  useUpdateEffect(() => {
    if (!manual) {
      Object.values(fetchesRef.current).forEach((f) => {
        // f.refresh();
      });
    }
  }, [...refreshDeps]);

  useEffect(() => {
    Object.values(fetchesRef.current).forEach((f) => {
      // f.unmount();
    });
  }, []);

  const noReady = useCallback((name: string) => {
    throw new Error(`Cannot call ${name} when service not executed once.`);
  }, []);

  return {
    loading: !manual || defaultLoading,
    data: initialData,
    error: undefined,
    params: [],
    // cancel: noReady("cancel"),
    // refresh: noReady("refresh"),
    // mutate: noReady("mutate"),
    ...(fetches[newstFetchKey.current] || {}),
    run,
    fetches,
    reset,
  };
};

export default useAsync;
