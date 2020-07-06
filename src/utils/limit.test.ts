import Limit from "./limit";

jest.useFakeTimers();

describe("limit function", () => {
  it("limit function ", () => {
    const limitFn = Limit(() => true, 200);
    expect(limitFn()).toBeTruthy();
    expect(limitFn()).toBeFalsy();
    jest.runAllTimers();
    expect(limitFn()).toBeTruthy();
  });
});
