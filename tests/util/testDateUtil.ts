import {DateUtil} from '../../src/util/DateUtil'; 
it('testLastMonth',()=>{
  function run(d:string){
    let date = DateUtil.parse(d);
    let lastMonth = DateUtil.beforeMonth(date,1)
    
    console.log(DateUtil.format(lastMonth))
  }

  function runLast(){
    let date = DateUtil.monthFirst()
    let lastMonth = DateUtil.beforeDay(date,1)
    
    console.log(DateUtil.format(lastMonth))
  }

  run('2024-05-31')
  run('2023-03-31')
  runLast()

  
})

it.only('测试获得时间',()=>{
  let str = DateUtil.getTimeStr(new Date);
  console.log('str',str);
  console.log(str>'09:00')
})