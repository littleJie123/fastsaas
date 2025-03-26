import {ArrayUtil} from '../../src/util/ArrayUtil';
it('testJoin',()=>{
  let list1 = [
    {name:'aaa',age:1},
    {name:'bbb',age:2},
    {name:'ccc',age:3}
  ] 
 

  let list2 =  [
    {name:'aaa',grade:5},
    {name:'bbb',grade:3},
    {name:'ccc',grade:4}
  ] 

  let list3 =  [
    {aa:{name:'aaa',grade:5}},
    {aa:{name:'bbb',grade:3}},
    {aa:{name:'ccc',grade:4}}
  ] 
  console.log(ArrayUtil.join({
    list:list1,
    list2,
    key:'name',
    fun(obj,obj2){
      return {
        ...obj,
        grade:obj2.grade
      }
    }
  }));

  console.log(ArrayUtil.join({
    list:list1,
    list2:list3,
    key:'name',
    key2:'aa.name',
    fun(obj,obj2){
      return {
        aa:obj2.aa,
        age:obj.age
      }
    }
  }));
})