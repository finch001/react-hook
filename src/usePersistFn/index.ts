import { useCallback, useRef, useEffect } from "react";

export type noop = (...args: any[]) => any;

export default function usePersisFn<T extends noop>(
  fn: T,
  dependencies: any = []
) {
  const ref = useRef<any>(() => {
    throw new Error("Cannot call function while rendering");
  });

  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  const persist = useCallback(
    (...args) => {
      const refFn = ref.current;
      if (refFn) {
        return refFn(...args);
      }
    },
    [ref]
  );

  if (typeof fn === "function") {
    return persist;
  }
  return undefined;
}
