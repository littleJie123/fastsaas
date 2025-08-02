import { ArrayUtil } from "../../../src/util/ArrayUtil";

test('indexOf',async ()=>{
  let grades = [
    {
      grade:10,
      people:{
        name:'aaa'
      }
    },
    {
      grade:11,
      people:{
        name:'aaa'
      }
    },
    {
      grade:10,
      people:{
        name:'bbb'
      }
    }
  ]
  console.log(await ArrayUtil.sch(grades,{grade:10,'people.name':'aaa'}))
})