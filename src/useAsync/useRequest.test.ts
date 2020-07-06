import createTestServer from "create-test-server";
import { extend } from "umi-request";
import { renderHook } from "@testing-library/react-hooks";
import useRequest from "./useRequest";

const request = extend({
  errorHandler(e) {
    throw e;
  },
});

describe("request library", () => {
  let server;

  beforeAll(async () => {
    server = await createTestServer();
  });

  afterAll(() => {
    server.close();
  });

  const prefix = (api) => `${server.url}${api}`;

  test("success with url", async () => {
    const rawData = "bar1";
    server.get("/test/success", (req, res) => {
      res.send(rawData);
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      useRequest(prefix("/test/success"))
    );
    // @ts-ignore
    await waitForNextUpdate(() => result.current.data);
    expect(result.current.data).toEqual(rawData);
  });
});
