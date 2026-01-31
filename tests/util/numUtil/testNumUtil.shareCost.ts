import { ArrayUtil } from "../../../src/fastsaas";
import NumUtil from "../../../src/util/NumUtil";

describe('NumUtil.shareCost', () => {

  it('总和小于等于支出，应全部扣减', () => {
    let cost = 100;
    let shareCosts = [10, 20, 30]; // sum = 60
    let result = NumUtil.shareCost(cost, shareCosts, {});
    expect(result).toEqual([10, 20, 30]);
  });

  it('总和大于支出，按比例分配，能整除', () => {
    let cost = 60;
    let shareCosts = [20, 40, 60]; // sum = 120
    // ratios: 20/120 = 1/6, 40/120 = 1/3, 60/120 = 1/2
    // shares: 60/6=10, 60/3=20, 60/2=30. sum=60.
    let result = NumUtil.shareCost(cost, shareCosts, {});
    expect(result).toEqual([10, 20, 30]);
  });

  it('总和大于支出，按比例分配，有余数，余数依次分配', () => {
    let cost = 10;
    let shareCosts = [10, 10, 10]; // sum = 30
    // ratios: 1/3 each.
    // base share: floor(10*1/3) = 3.
    // total base: 9.
    // remainder: 1.
    // distribute remainder to first: 3+1, 3, 3.
    let result = NumUtil.shareCost(cost, shareCosts);
    expect(result).toEqual([4, 3, 3]);
    expect(ArrayUtil.sum(result)).toBe(cost);
  });

  it('总和大于支出，有余数，循环分配', () => {
    let cost = 5;
    let shareCosts = [10, 10, 10]; // sum=30
    // ratio 1/3
    // base: floor(5/3) = 1. total 3. rem=2.
    // res: 2, 2, 1
    let result = NumUtil.shareCost(cost, shareCosts);
    expect(result).toEqual([2, 2, 1]);
    expect(ArrayUtil.sum(result)).toBe(cost);
  });

  it('使用fee进行精度控制', () => {
    // cost 1元, 3人分. expect 0.34, 0.33, 0.33
    // fee = 100.
    // cost -> 100 type (0.01)
    // shares values.
    // Here shareCosts are balances.
    let cost = 1;
    let shareCosts = [10, 10, 10];
    let result = NumUtil.shareCost(cost, shareCosts, { fee: 100 });
    // internal: cost 100. shares 10,10,10 -> sum 30.
    // Wait, the fee logic in assign implies value is scaled.
    // If balances are just numbers, we might just treat cost as the scaled value or output scaled?
    // Looking at assign: value *= opt.fee. The result is set back divided by fee.

    expect(result[0]).toBeCloseTo(0.34);
    expect(result[1]).toBeCloseTo(0.33);
    expect(result[2]).toBeCloseTo(0.33);
    expect(ArrayUtil.sum(result)).toBeCloseTo(1);
  });

  it('边界情况：余额为0', () => {
    let cost = 100;
    let shareCosts = [0, 0, 0];
    let result = NumUtil.shareCost(cost, shareCosts, {});
    expect(result).toEqual([0, 0, 0]);
  });

  it('边界情况：支出为0', () => {
    let cost = 0;
    let shareCosts = [10, 20];
    let result = NumUtil.shareCost(cost, shareCosts, {});
    expect(result).toEqual([0, 0]);
  });
});
