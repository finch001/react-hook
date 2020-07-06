import { useEffect, useRef } from "react";

const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isMounted = useRef(false);

  // 此处包了一层初始化的判断 第一次初始化直接跳过 接下来完整走useEffect的更新流程
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
  }, deps);
};

export default useUpdateEffect;
