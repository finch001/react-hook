const cache: { [key: string]: { data: any; timer: any } } = {};

const setCache = (key: string, cachetTime = 0, data: any) => {
  if (cache[key]) {
    clearTimeout(cache[key].timer);
  }

  // 数据五分钟后 删除
  const timer = setTimeout(() => {
    delete cache[key];
  }, cachetTime);

  cache[key] = {
    data,
    timer,
  };
};

const getCache = (key: string) => {
  return cache[key]?.data;
};

export default { setCache, getCache };
