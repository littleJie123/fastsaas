import JsonUtil from '../../src/util/JsonUtil'; 
it('getJson',()=>{
  //let result = {"result":{"totalElements":1,"content":[{"noteItemId":10000794,"price":4,"supplierId":125,"stockUnitsId":1,"name":"咸鸡蛋","buyUnitId":67,"categoryId":241,"pinyin":"xianjidan","firstPinyin":"xjd","unitsId":1,"instock":{"cnt":0,"buyUnitFee":1},"back":{"cnt":0,"buyUnitFee":1},"materialId":3746,"purcharse":{"cnt":6,"buyUnitFee":1},"sendCnt":{"cnt":0,"buyUnitFee":1},"supplierMaterial":{"buyUnitFee":1,"price":4},"stockBuyUnitFee":1,"buyUnit":[{"unitsId":1,"fee":1,"isUnits":true,"isSupplier":true,"name":"斤"}]}]}}
  //let json = JsonUtil.getByKeys({result},'result.result.content.0.noteItemId')
  //let json = {aa:[{dd:'${result.result.content.0.noteItemId'}]}
  let json = {aa:[{dd:'${bb}'}],bbb:{hhh:"${kcc.kddd}"}}
  let json2 =  JsonUtil.parseJson(json,{bb:123,kcc:{kddd:'mmmm'}})
  console.log(json2)
})