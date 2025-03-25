import NumUtil from '../../src/util/NumUtil';

it('最大公约数和最小公倍数', () => {
  expect(NumUtil.gcd(12, 18)).toBe(6);
  expect(NumUtil.lcm(12, 18)).toBe(36);

  expect(NumUtil.gcd(56,28)).toBe(28);
  expect(NumUtil.lcm(56,28)).toBe(56);
});