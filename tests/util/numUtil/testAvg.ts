import { NumUtil } from "../../../src/fastsaas";



function test(name: string, actual: any, expected: any) {
  console.log(name);
  console.log(actual);
  console.log(expected);
  const actStr = JSON.stringify(actual);
  const expStr = JSON.stringify(expected);
  expect(actStr).toEqual(expStr);

}

it("NumUtil.avg", () => {
  console.log("Running NumUtil.avg tests...");

  // Case 1: Standard currency distribution
  test("10, 3, fee:100", NumUtil.avg(10.01, 3, { fee: 100 }), [3.34, 3.34, 3.33]);

  // Case 2: Integer distribution (no fee)
  // 10 / 3 = 3 rem 1. First one gets +1 = 4.
  test("10, 3, {}", NumUtil.avg(10, 3, {}), [4, 3, 3]);

  // Case 3: Zero sum
  test("0, 3, {}", NumUtil.avg(0, 3, {}), [0, 0, 0]);

  // Case 4: Fee scaling exact
  // 6 / 3 = 2.
  test("6, 3, fee:1", NumUtil.avg(6, 3, { fee: 1 }), [2, 2, 2]);

  // Case 5: Count 0
  test("10, 0, {}", NumUtil.avg(10, 0, {}), []);

  test("1, 7, fee:100", NumUtil.avg(1, 7, { fee: 100 }), [0.15, 0.15, 0.14, 0.14, 0.14, 0.14, 0.14]);
});