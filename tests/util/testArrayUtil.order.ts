import OrderItemParam, {ArrayUtil} from '../../src/util/ArrayUtil';
it('testOrder',()=>{
  let list1 = [
    {name:'aaa',age:3,grade:{math:100,english:60}},
    {name:'bbb',age:2,grade:{math:80,english:80}},
    {name:'ccc',age:1,grade:{math:80,english:70}},
    {name:'ddd',age:0.5,grade:{math:100,english:90}},

  ]
  function run(param:OrderItemParam){
    console.log('****************param',param);
    ArrayUtil.order(list1,param)
    console.log('list1',list1);
  }
  run('age')
  run('grade.math')
  run('grade.english')
  run({order:'grade.math',desc:'desc'})
  run([
    {order:'grade.math',desc:'desc'},
    {order:'grade.english',desc:'desc'}
  ])
}) 