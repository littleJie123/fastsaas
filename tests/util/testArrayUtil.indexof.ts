import { ArrayUtil } from "../../src/util/ArrayUtil";

test('indexOf',()=>{
  let array = [1,2,3,4,5,6,7,8,9,0]
  let array2 = [4,5,6];
  expect(ArrayUtil.indexOf(array,array2)).toEqual(3)
  expect(ArrayUtil.indexOf(array,[4,5,7])).toEqual(-1)
  expect(ArrayUtil.indexOf(array,[8,9])).toEqual(7)
})