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
})