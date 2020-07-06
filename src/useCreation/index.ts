import { useRef } from "react";

// 保证
export default function useCreation<T>(factory: () => T, deps: any[]) {
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T,
    initialized: false,
  });

  if (!current.initialized || !depAsSame(current.deps, deps)) {
    current.deps = deps;
    current.obj = factory();
    current.initialized = true;
  }

  return current.obj;
}

function depAsSame(oldDeps: any[], newDeps: any[]) {
  if (oldDeps === newDeps) {
    return true;
  }
  for (const i in oldDeps) {
    if (oldDeps[i] !== newDeps[i]) {
      return false;
    }
  }

  return true;
}
