export interface FetchConfig<R, P extends any[]> {
  formatResult?: (res: any) => R;

  onSuccess?: (data: R, params: P) => void;
  onError?: (e: Error, params: P) => void;

  loadingDelay?: number; // loading delay

  // 轮询
  pollingInterval?: number; // 轮询的间隔毫秒
  pollingWhenHidden?: boolean; // 屏幕隐藏时，停止轮询

  refreshOnWindowFocus?: boolean;
  focusTimespan: number;

  debounceInterval?: number;
  throttleInterval?: number;

  throwOnError?: boolean;
}
