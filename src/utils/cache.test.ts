import Cache from "./cache";

jest.useFakeTimers();

describe("cache utils", () => {
  it("cache and delete ", () => {
    Cache.setCache("key", 200, "finch");
    const cacheData = Cache.getCache("key");
    expect(cacheData).toBe("finch");
    jest.runAllTimers();
    const outDate = Cache.getCache("key");
    expect(outDate).toBeFalsy();
  });
});
