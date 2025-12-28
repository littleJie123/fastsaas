import { ArrayUtil } from "../../../src/fastsaas";
import NumUtil from "../../../src/util/NumUtil";
it('测试getNum', () => {
  expect(NumUtil.getNum('23.5')).toEqual(23.5);
  expect(NumUtil.getNum('$23.5')).toEqual(23.5);
  expect(NumUtil.getNum('￥2,003.5')).toEqual(2003.5);
})
