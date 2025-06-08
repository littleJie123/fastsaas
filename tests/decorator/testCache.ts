import Cache from "../../src/decorator/Cache"
import Sch from "../../src/decorator/Sch"
import TestCache from '../../src/decorator/test/TestCache'
it('testCache', async () => {
  let t1 = new TestCache(2)
  console.log('last:',await t1.cal(4))

  let t2 = new TestCache(4)
  console.log('last:',await t2.cal(6))
})