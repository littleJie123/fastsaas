import Mapper from '../../src/mapperReducer/Mapper'
it('测试mapper',()=>{
  let list = [
    {
      age:10,country:'中国',name:'小杰'
    },
    {
      age:10,country:'中国',name:'小翕'
    },
    {
      age:5,country:'中国',name:'小悠'
    },
    {
      age:3,country:'中国',name:'小静'
    },
    {
      age:3,country:'美国',name:'alice'
    },
    {
      age:5,country:'美国',name:'marry'
    }

  ]

  let mapper1 = new Mapper(list,['age','country'])
  console.log(JSON.stringify(mapper1));
  console.log(mapper1.get(['10','中国']))
  console.log(mapper1.get(['5']))

  mapper1.setByGeters(['age','country'],[
    {age:10,country:'中国',name:'老王'},
    {age:5,country:'中国',name:'小小王'},
    {age:6,country:'中国',name:'小大王'},
  ])
  console.log(mapper1.get(['10','中国']))
  console.log(mapper1.get(['10','泰国']))
  console.log(mapper1.get(['5']))

  console.log(mapper1.get(['101']))

  mapper1.add(['5','中国'],[{name:'xiaoxiao'},{name:'tom'}] as any[])
  mapper1.add(['10','中国'],[{name:'xiaoxiao1'},{name:'tom1'}] as any[])
  console.log(mapper1.get(['5']))
  console.log(mapper1.get(['10','中国']))

   mapper1.add(['99','日本'],[{name:'xiaoxiao2'},{name:'tom2'}] as any[])

   console.log(mapper1.get(['99','日本']))
})