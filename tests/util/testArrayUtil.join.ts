import {ArrayUtil} from '../../src/util/ArrayUtil';
it.skip('testJoin',()=>{
  let list1 = [
    {name:'aaa',age:1},
    {name:'bbb',age:2},
    {name:'ccc',age:3},
    {name:'eee',age:3}
  ] 
 

  let list2 =  [
    {name:'aaa',grade:5},
    {name:'bbb',grade:3},
    {name:'ccc',grade:4},
    {name:'ddd',grade:4}
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
    onlyOne(data){
      return {
        ... data,
        onlyOne:true
      }
    },
    onlyTwo(data){
      return {
        ... data,
        onlyTwo:true
      }
    },
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


it.skip('testJoinArray',()=>{
  let list1 = [
    {name:'aaa',age:1},
    {name:'bbb',age:2},
    {name:'ccc',age:3},
    {name:'eee',age:3}
  ] 
 

  let list2 =  [
    {name:'aaa',type:'math',grade:5},
    {name:'aaa',type:'english',grade:3},
    {name:'ccc',type:'math',grade:4},
    {name:'ddd',grade:4}
  ] 

 
  console.log(JSON.stringify(ArrayUtil.joinArray({
    list:list1,
    list2,
    key:'name',
    onlyOne(data){
      return {
        ... data,
        onlyOne:true
      }
    },
    onlyTwo(data){
      return [{
        grade: data,
        onlyTwo:true,
        name:'no name'
      }]
    },
    fun(obj,obj2:any[]){
      return {
        ...obj,
        grade:obj2
      }
    }
  })));

   
})



it('testJoinMany',()=>{
  let list1 = [
    {name:'aaa',age:1},
    {name:'bbb',age:2},
    {name:'ccc',age:3},
    {name:'eee',age:3}
  ] 
 

  let list2 =  [
    {name:'aaa',type:'math',grade:5},
    {name:'aaa',type:'english',grade:3},
    {name:'ccc',type:'math',grade:4},
    {name:'ddd',grade:4}
  ] 

 
  console.log(JSON.stringify(ArrayUtil.joinMany({
    list:list1,
    list2,
    key:'name',
    onlyOne(data:any[]){
      let retArray:any[] = [];
      for(let item of data){
        retArray.push({
          ...item,
          onlyOne:true
        })
        
        retArray.push({
          ...item,
          onlyOne:true
        })
      }
      return retArray
    },
    onlyTwo(data:any[]){
      let retArray:any[] = [];
      for(let item of data){
        retArray.push({
          ...item,
          onlyTwo:true
        })
        retArray.push({
          ...item,
          onlyTwo:true
        })
      }
      return retArray
    },
    fun(obj:any[],obj2:any[]){
      return {
        one:obj,
        two:obj2
      }
    }
  })));

   
})