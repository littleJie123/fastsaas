import { ArrayUtil } from "../../../src/fastsaas";
import NumUtil from "../../../src/util/NumUtil";
it('测试getNumAndUnit', () => {
  expect(NumUtil.getNumAndUnit('23.5瓶')).toEqual([{ num: 23.5, unit: '瓶' }]);
  expect(NumUtil.getNumAndUnit('23.50瓶')).toEqual([{ num: 23.5, unit: '瓶' }]);
  expect(NumUtil.getNumAndUnit('9999999.99瓶')).toEqual([{ num: 9999999.99, unit: '瓶' }]);

  expect(NumUtil.getNumAndUnit('23瓶500ml')).toEqual([{ num: 23, unit: '瓶' }, { num: 500, unit: 'ml' }]);

  expect(NumUtil.getNumAndUnit('1箱23瓶500ml')).toEqual(
    [
      { num: 1, unit: '箱' },
      { num: 23, unit: '瓶' },
      { num: 500, unit: 'ml' }]);
  console.log(NumUtil.getNumAndUnit('1箱23瓶500ml'))

  console.log(NumUtil.getNumAndUnit('23'))
})