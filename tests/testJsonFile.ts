import fs from 'fs'
it('test json file',()=>{
  let array:any[] = [];
  for(let i = 0;i<10000;i++){
    array.push({
      id:i,
      name:`name${i}`,
      age:i,
      sex:i%2===0?'male':'female',
      address:`address${i}`,
      phone:`phone${i}`,
      email:`email${i}@gmail.com`,
      createTime:new Date().toISOString(),
      updateTime:new Date().toISOString(),
      isDelete:false
    })
  }
  //fs.writeFileSync('./habit.json',JSON.stringify(array))
  console.log(JSON.stringify(array).length)
})