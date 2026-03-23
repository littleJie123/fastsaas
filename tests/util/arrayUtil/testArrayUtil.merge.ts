import { ArrayUtil } from "../../../src/util/ArrayUtil";

it('testMerge',()=>{
  let array = [
    {date:'aaa',cnt:10},
    {date:'aaa',cnt:12},
    {date:'bbb',cnt:1},
    {date:'bbb',cnt:2},
    {date:'bbb',cnt:3},
    {date:'aaa',cnt:4},
    {date:'aaa',cnt:5},
  ]

  let list = ArrayUtil.merge(array,{
    init(obj1){
      return {
        ... obj1,
        inited:true
      }
    },
    isHit(obj1,obj2){
      return obj1.date==obj2.date;
    },
    addObj(obj1,obj2){
      return {
        inited:obj1.inited,
        date:obj1.date,
        cnt:obj1.cnt+obj2.cnt
      }
    }
  })
  console.log(list)
  
})