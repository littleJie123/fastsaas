import {BeanUtil} from '../../src/util/BeanUtil';
it('测试parseJson',()=>{
  let testObj = {
    aa:'${aaa}',
    bbb:'${bb.cc}',
    ccc:[
      '${dd}',
      '${ee.ff}'
    ]

  }
  let parseObj = {
    aaa:123,
    bb:{
      cc:'tttt'
    },
    dd:'hhhh',
    ee:{
      ff:'jjjj'
    }
  }
  let param = BeanUtil.parseJsonFromParam(testObj,parseObj)
  console.log('param',param);
  expect(param).toEqual({ aa: 123, bbb: 'tttt', ccc: [ 'hhhh', 'jjjj' ] })
  console.log(BeanUtil.parseJsonFromParam(null,parseObj))
})