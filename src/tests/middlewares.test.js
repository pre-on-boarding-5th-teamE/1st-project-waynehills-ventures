const Request = require("../middlewares/container");
const errorConstructor = require("../middlewares/errorConstructor");
const extendError = require("../middlewares/extendError");

describe("Request test", () => {
  test("Request.data: req", () => {
    const req = { body: "hi" };
    const result = new Request(req);
    expect(result.data.body).toBe("hi");
  });
});

describe("errorConstructor test", () => {
  test("errorConstructor: toBe", () => {
    const error = new errorConstructor("this is error", 999);

    expect(error.message).toBe("this is error");
    expect(error.status).toBe(999);
  });
});

describe("extendError test", () => {
  test("extendError: 빈 값일때", () => {
    const value = "";
    const resultFn = () => extendError.findKeyError(value);
    expect(resultFn).toThrow();
  });

  test("extendError: 빈 값의 속성이 있을때", () => {
    const value = {
      a: "abcd",
      b: "",
    };
    const resultFn = () => extendError.findKeyError(value);
    expect(resultFn).toThrow();
  });

  test("extendError: 빈 값의 속성이 없을때", () => {
    const value = {
      a: "abcd",
      b: "이제 자야지",
    };
    const resultFn = () => extendError.findKeyError(value);
    expect(resultFn).not.toThrow();
  });
});
