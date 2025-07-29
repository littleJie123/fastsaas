import JsonUtil from '../../src/util/JsonUtil'; 
it('addObj',()=>{
  function run(obj1,obj2,cols:string[]){
    let ret = JsonUtil.addObj(obj1,obj2,cols);
    console.log(ret)
  }
  run ({
    age:10,
    grade:20
  },{
    age:100,
    grade:200
  },['age','grade'])

  run ({
    person:{
      age:10,
      grade:20
    }
  },{
    person:{
      age:100,
      grade:200
    }
  },['person.age','person.grade'])
})