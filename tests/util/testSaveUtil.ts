import SaveUtil from '../../src/util/SaveUtil'

let opt = {
  pkCol: 'supplierMaterialId'
}

it('没有老数据时只返回新增', () => {
  let adds = [
    { supplierMaterialId: null, materialId: 1, price: 12, isDef: 1 }
  ]
  expect(SaveUtil.save(null, { adds, updates: [], dels: [] }, opt)).toEqual(adds)
  expect(SaveUtil.save([], { adds, updates: null, dels: null }, opt)).toEqual(adds)
  expect(SaveUtil.save(null, null, opt)).toEqual([])
})

it('按主键修改，没写到的字段保留，后面的修改覆盖前面的', () => {
  let datas = [
    { supplierMaterialId: 1, materialId: 8, price: 10, isDef: 0, supplierId: 3 }
  ]
  let updates = [
    { supplierMaterialId: 1, price: 12, isDef: 1 },
    { supplierMaterialId: 1, price: 15 }
  ]
  let ret = SaveUtil.save(datas, { adds: [], updates, dels: [] }, opt)
  expect(ret).toEqual([
    { supplierMaterialId: 1, materialId: 8, price: 15, isDef: 1, supplierId: 3 }
  ])
  expect(datas[0].price).toBe(10)
  expect(datas[0].isDef).toBe(0)
})

it('主键对不上的修改跳过', () => {
  let datas = [
    { supplierMaterialId: 1, materialId: 8, price: 10 }
  ]
  let ret = SaveUtil.save(datas, {
    adds: [],
    updates: [
      { supplierMaterialId: 9, price: 99 },
      { supplierMaterialId: null, price: 1 }
    ],
    dels: []
  }, opt)
  expect(ret).toEqual(datas)
  expect(ret[0]).not.toBe(datas[0])
})

it('按主键删除，主键为空的老数据保留，对不上的删除跳过', () => {
  let datas = [
    { supplierMaterialId: 1, materialId: 8 },
    { supplierMaterialId: 2, materialId: 9 },
    { supplierMaterialId: null, materialId: 10 }
  ]
  let ret = SaveUtil.save(datas, {
    adds: [],
    updates: [],
    dels: [
      { supplierMaterialId: 1, materialId: 8 },
      { supplierMaterialId: 7, materialId: 1 }
    ]
  }, opt)
  expect(ret).toEqual([
    { supplierMaterialId: 2, materialId: 9 },
    { supplierMaterialId: null, materialId: 10 }
  ])
  expect(datas.length).toBe(3)
})

it('同一主键又改又删时，结果里没有这条', () => {
  let datas = [
    { supplierMaterialId: 1, materialId: 8, price: 10, isDef: 1 },
    { supplierMaterialId: 2, materialId: 8, price: 8, isDef: 0 }
  ]
  let ret = SaveUtil.save(datas, {
    adds: [],
    updates: [{ supplierMaterialId: 1, isDef: 0 }],
    dels: [{ supplierMaterialId: 1, materialId: 8 }]
  }, opt)
  expect(ret).toEqual([
    { supplierMaterialId: 2, materialId: 8, price: 8, isDef: 0 }
  ])
})

it('新增原样接在末尾，老数据的修改不改入参', () => {
  let datas = [
    { supplierMaterialId: 1, materialId: 8, price: 10, isDef: 1 }
  ]
  let add = { materialId: 9, supplierId: 4, price: 6, isDef: 0 }
  let ret = SaveUtil.save(datas, {
    adds: [add],
    updates: [{ supplierMaterialId: 1, price: 11 }],
    dels: []
  }, opt)
  expect(ret).toEqual([
    { supplierMaterialId: 1, materialId: 8, price: 11, isDef: 1 },
    { materialId: 9, supplierId: 4, price: 6, isDef: 0 }
  ])
  expect(ret[1]).toBe(add)
  expect(datas[0].price).toBe(10)
})
