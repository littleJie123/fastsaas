import { ArrayUtil } from "../../../src/fastsaas";
import NumUtil from "../../../src/util/NumUtil";
it('测试assign', () => {
  let obj = { value: 1 };
  let assignNumObjs: any[] = []
  for (let i = 0; i < 7; i++) {
    assignNumObjs.push({ value: 1 })
  }
  NumUtil.assign(obj, assignNumObjs, { col: 'value', fee: 100 })
  expect(ArrayUtil.sum(assignNumObjs, 'value')).toEqual(1)
  console.log(assignNumObjs);
})

it('测试assign2.不相等', () => {
  let obj = { value: 1 };
  let assignNumObjs: any[] = []
  for (let i = 0; i < 7; i++) {
    if (i <= 2) {
      assignNumObjs.push({ value: 2 })
    } else {
      assignNumObjs.push({ value: 1 })
    }
  }
  NumUtil.assign(obj, assignNumObjs, { col: 'value', fee: 100 })
  console.log(assignNumObjs);
  expect(NumUtil.isEq(ArrayUtil.sum(assignNumObjs, 'value'), 1)).toEqual(true)

})

it.only('测试assign3.大于', () => {
  let obj = { value: 10 };
  let assignNumObjs: any[] = []
  for (let i = 0; i < 7; i++) {

    assignNumObjs.push({ value: 1 })

  }
  NumUtil.assign(obj, assignNumObjs, { col: 'value', fee: 100 })
  console.log(assignNumObjs);
  expect(NumUtil.isEq(ArrayUtil.sum(assignNumObjs, 'value'), 7)).toEqual(true)

})