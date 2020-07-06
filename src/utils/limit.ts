export default function limit(fn: any, timespan: number) {
  // 高阶函数 闭包保存pending状态
  let pending = false;

  return (...args: any[]) => {
    if (pending) return;
    pending = true;
    setTimeout(() => {
      pending = false;
    }, timespan);

    return fn(...args);
  };
}
