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

it('测试assign3.大于', () => {
  let obj = { value: 10 };
  let assignNumObjs: any[] = []
  for (let i = 0; i < 7; i++) {

    assignNumObjs.push({ value: 1 })

  }
  NumUtil.assign(obj, assignNumObjs, { col: 'value', fee: 100, ifBigNoAssign: true })
  console.log(assignNumObjs);
  expect(NumUtil.isEq(ArrayUtil.sum(assignNumObjs, 'value'), 7)).toEqual(true)

})

it('测试assign4.等于', () => {
  let obj = { value: 10 };
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
  expect(NumUtil.isEq(ArrayUtil.sum(assignNumObjs, 'value'), 10)).toEqual(true)

})

it('测试assign5.多个级别', () => {
  let obj = { aaa: { value: 10 } };
  let assignNumObjs: any[] = []
  for (let i = 0; i < 7; i++) {
    if (i <= 2) {
      assignNumObjs.push({ aaa: { value: 2 } })
    } else {
      assignNumObjs.push({ aaa: { value: 1 } })
    }
  }
  NumUtil.assign(obj, assignNumObjs, { col: 'aaa.value', fee: 100 })
  console.log(assignNumObjs);
  expect(NumUtil.isEq(ArrayUtil.sum(assignNumObjs, 'aaa.value'), 10)).toEqual(true)

})

it('测试assign6.不同列', () => {
  let obj = { aaa: { value: 100 } };
  let assignNumObjs: any[] = []
  for (let i = 0; i < 7; i++) {
    if (i <= 1) {
      assignNumObjs.push({ aaa: { value: 2 } })
    } else {
      assignNumObjs.push({ aaa: { value: 1 } })
    }
  }
  NumUtil.assign(obj, assignNumObjs, { col: 'aaa.value', fee: 100, valueCol: 'aaa.value', assignNumObjCol: 'value' })
  console.log(assignNumObjs);
  expect(NumUtil.isEq(ArrayUtil.sum(assignNumObjs, 'aaa.value'), 9)).toEqual(true)
  expect(NumUtil.isEq(ArrayUtil.sum(assignNumObjs, 'value'), 100)).toEqual(true)
})


function test(assignNumObj: any[], num?: number) {
  console.log('***********************');
  console.log(assignNumObj);
  if (num == null) {
    num = 100;
  }
  let obj = { cnt: num };
  NumUtil.assign(obj, assignNumObj, { col: 'cnt' })
  console.log('assignNumObj', assignNumObj)
  let sum = ArrayUtil.sum(assignNumObj, 'cnt')
  expect(sum).toEqual(num)
}

it('测试分配库存[含0]', () => {
  test([
    { cnt: 0 },
    { cnt: 1 },
    { cnt: 2 },

  ])

  test([
    { cnt: 0 },
    { cnt: 0 },
    { cnt: 0 }
  ])

  test([
    { cnt: 0 }

  ])

  test([
    { cnt: 0 },
    { cnt: 0 },
    { cnt: 0 }

  ], 1)

});

it('库存分配2', () => {
  let stock = { cnt: 1258.12, buyUnitFee: 1, cost: 80.51 };
  let assigns = [
    {
      materialId: '45734',
      theoryCnt: { cnt: 91.52, buyUnitFee: 1, cost: 5.85 },
      cnt: { cnt: 0, buyUnitFee: 1, cost: 0 },
      productId: '2436'
    },
    {
      materialId: '45734',
      theoryCnt: { cnt: 153.6, buyUnitFee: 1, cost: 9.83 },
      cnt: { cnt: 0, buyUnitFee: 1, cost: 0 },
      productId: '2449'
    },
    {
      materialId: '45734',
      theoryCnt: { cnt: 320, buyUnitFee: 1, cost: 20.48 },
      cnt: { cnt: 0, buyUnitFee: 1, cost: 0 },
      productId: '2450'
    },
    {
      materialId: '45734',
      theoryCnt: { cnt: 693, buyUnitFee: 1, cost: 44.35 },
      cnt: { cnt: 0, buyUnitFee: 1, cost: 0 },
      productId: '2451'
    }
  ]
  console.log(ArrayUtil.sum(assigns, 'theoryCnt.cnt'));
  NumUtil.assign(stock, assigns, {
    col: 'cnt',
    valueCol: 'theoryCnt.cnt',
    assignNumObjCol: 'cnt.cnt',
    fee: 100
  })
  for(let assign of assigns){
    expect(assign.theoryCnt.cnt).toEqual(assign.cnt.cnt);
  }
  console.log(assigns)
});