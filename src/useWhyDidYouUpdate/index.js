import { useState, useEffect, useRef } from "react";

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

/**
 *
 * Check whether the dependency item is an object. then
 */
const isObject = (t) => {
  return Object.prototype.toString.call(t) === "[object Object]";
};

function getPrintableInfo(dependencyItem) {
  if (isObject(dependencyItem) || Array.isArray(dependencyItem)) {
    let ans;
    try {
      ans = JSON.stringify(dependencyItem, null, 2);
    } catch (error) {
      ans = "CIRCULAR JSON";
    }
    return ans;
  }

  return dependencyItem;
}

export default function useWhyDidYouUpdate(name, props) {
  const previousProps = useRef();

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });

      const changesObj = {};

      allKeys.forEach((key) => {
        if (previousProps.current[key] !== props[key]) {
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });
    }
    previousProps.current = props;
  });
}
