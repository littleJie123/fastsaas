import {ArrayUtil} from '../../src/util/ArrayUtil';
it('testIsDuplication',()=>{
  let isReply = ArrayUtil.isDuplicate([
    {name:'aaa'},
    {name:'bbb'},
    {name:'ccc'}
  ],'name')
  expect(isReply).toEqual(false);

  isReply = ArrayUtil.isDuplicate([
    {name:'aaa'},
    {name:'bbb'},
    {name:'ccc'},
    {name:'aaa'}
  ],'name')
  expect(isReply).toEqual(true);
})