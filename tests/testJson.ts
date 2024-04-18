it('testJson',()=>{
  let json = [
    {
      data:{name:"日常操作",key:'daily'},
      children:[
        {
          data:{name:'报货',key:'reporting',image:'orderlist'}
        },
        {
          data:{name:'入库',key:'storage',image:'truck'}
        },
        {
          data:{name:'盘点',key:'inventory',image:'eye'}
        }
      ]
    },
    {
      data:{name:"基础数据",key:'basicdata'},
      children:[
        {
          data:{name:'门店',key:'store',image:'shop'}
        },
        {
          data:{name:'物料',key:'material',image:'apps'}
        },
        {
          data:{name:'供应商',key:'supplier',image:'people'}
        },
        {
          data:{name:'设置',key:'setting',image:'setting'}
        }
        
      ]
    }
  
  ]
  console.log(JSON.stringify(json,null,4))
})