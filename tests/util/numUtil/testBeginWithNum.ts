import { NumUtil } from "../../../src/fastsaas";

it('testBeginWithNum', () => {
  expect(NumUtil.beginWithNum('斤')).toBe(false)
  expect(NumUtil.beginWithNum('1斤')).toBe(true)
  expect(NumUtil.beginWithNum('1.2斤')).toBe(true)
  expect(NumUtil.beginWithNum('1斤2两')).toBe(true)

  expect(NumUtil.beginWithNum('')).toBe(false)
  expect(NumUtil.beginWithNum(null as any)).toBe(false)
})