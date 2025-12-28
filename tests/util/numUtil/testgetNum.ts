
import NumUtil from "../../../src/util/NumUtil";

describe('NumUtil.getNum', () => {
  it('should extract numbers from strings with currency symbols', () => {
    expect(NumUtil.getNum('￥54.90')).toBe(54.9);
    expect(NumUtil.getNum('$10')).toBe(10);
    expect(NumUtil.getNum('10.01')).toBe(10.01);
  });

  it('should handle strings with commas', () => {
    expect(NumUtil.getNum('1,234.56')).toBe(1234.56);
    expect(NumUtil.getNum('$1,000')).toBe(1000);
  });

  it('should handle negative numbers', () => {
    expect(NumUtil.getNum('-50.5')).toBe(-50.5);
    expect(NumUtil.getNum('$-10')).toBe(-10);
  });

  it('should return 0 for non-numeric strings or null', () => {
    expect(NumUtil.getNum('abc')).toBe(0);
    // @ts-ignore
    expect(NumUtil.getNum(null)).toBe(0);
    expect(NumUtil.getNum('')).toBe(0);
  });

  it('should extract the first number found', () => {
    expect(NumUtil.getNum('Price: 50.5')).toBe(50.5);
    expect(NumUtil.getNum('item 5 cost 10')).toBe(5);
  });
});
