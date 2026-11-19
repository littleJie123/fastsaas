import FeatureCodeUtil from '../../src/util/FeatureCodeUtil'

let opt = {
  pkCol: 'materialId',
  cols: ['cnt', 'price']
}

it('没有行时明文为空，特征码是空明文的 md5', () => {
  expect(FeatureCodeUtil.buildPlain(null, opt)).toBe('')
  expect(FeatureCodeUtil.buildPlain([], opt)).toBe('')
  expect(FeatureCodeUtil.encrypt('')).toBe('d41d8cd98f00b204e9800998ecf8427e')
  expect(FeatureCodeUtil.buildCode(null, opt)).toBe(FeatureCodeUtil.encrypt(''))
  expect(FeatureCodeUtil.buildCode([], opt)).toBe(FeatureCodeUtil.encrypt(''))
})

it('按主键排序，顺序不同得到同一个明文和密文', () => {
  let a = [
    { materialId: 2, cnt: 1, price: 3 },
    { materialId: 1, cnt: 2, price: 4 }
  ]
  let b = [
    { materialId: 1, cnt: 2, price: 4 },
    { materialId: 2, cnt: 1, price: 3 }
  ]
  expect(FeatureCodeUtil.buildPlain(a, opt)).toBe(FeatureCodeUtil.buildPlain(b, opt))
  expect(FeatureCodeUtil.buildCode(a, opt)).toBe(FeatureCodeUtil.buildCode(b, opt))
  expect(a[0].materialId).toBe(2)
})

it('浮点噪声和整值得到同一个明文，密文不超过 45 位', () => {
  let noise = [
    { materialId: 1, cnt: 0.1 + 0.2, price: 3.9999999999 }
  ]
  let plainRows = [
    { materialId: 1, cnt: 0.3, price: 4 }
  ]
  let text = '1.000000,0.300000,4.000000'
  expect(FeatureCodeUtil.buildPlain(noise, opt)).toBe(text)
  expect(FeatureCodeUtil.buildPlain(plainRows, opt)).toBe(text)
  let code = FeatureCodeUtil.encrypt(text)
  expect(code.length).toBeLessThanOrEqual(45)
  expect(code.length).toBe(32)
  expect(FeatureCodeUtil.buildCode(noise, opt)).toBe(code)
  expect(FeatureCodeUtil.buildCode(plainRows, opt)).toBe(code)
})

it('差一位有效小数的数量不是同一个码', () => {
  let third = FeatureCodeUtil.buildPlain([
    { materialId: 1, cnt: 1 / 3, price: 4 }
  ], opt)
  let twoDigit = FeatureCodeUtil.buildPlain([
    { materialId: 1, cnt: 0.33, price: 4 }
  ], opt)
  expect(third).not.toBe(twoDigit)
  expect(FeatureCodeUtil.encrypt(third)).not.toBe(FeatureCodeUtil.encrypt(twoDigit))
})

it('单价不同则特征码不同', () => {
  let left = FeatureCodeUtil.buildCode([
    { materialId: 1, cnt: 1, price: 4 }
  ], opt)
  let right = FeatureCodeUtil.buildCode([
    { materialId: 1, cnt: 1, price: 5 }
  ], opt)
  expect(left).not.toBe(right)
  expect(left.length).toBe(32)
})
