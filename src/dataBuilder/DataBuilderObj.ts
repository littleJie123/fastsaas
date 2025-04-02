export default interface DataBuilderObj<Param=any,Result=any>{
  param:Param;
  result:Result;
  runner:any;
}