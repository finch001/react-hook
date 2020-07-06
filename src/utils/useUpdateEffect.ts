import { useEffect, useRef } from "react";

const useUpdateEffect = (effect, dep) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
  }, dep);
};

export default useUpdateEffect;
