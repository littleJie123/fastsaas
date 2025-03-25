import IDaoHelper from "./IDaoHelper";

export default class<Pojo = any> {
  private beforeList:Pojo[] ;
  private afterList:Pojo[] ;
  private daoHelper:IDaoHelper;
  private tableName:string;
  private cdt:any;
  constructor(daoHelper:IDaoHelper,tableName:string,cdt:any){
    this.daoHelper = daoHelper;
    this.tableName = tableName;
    this.cdt = cdt;
  }

  getBeforeList(){
    return this.beforeList;
  }

  async before(){
    this.beforeList = await this.daoHelper.find(this.tableName,this.cdt); 
  }

  async compare(fun:(beforePojo:Pojo,afterPojo:Pojo)=>void){
    if(this.beforeList == null){
      throw new Error('请先调用before方法');
    }
    this.afterList = await this.daoHelper.find(this.tableName,this.cdt);
    
    fun(this.beforeList[0],this.afterList[0]);

  }

  async compareList(fun:(beforePojo:Pojo[],afterPojo:Pojo[])=>void){
    if(this.beforeList == null){
      throw new Error('请先调用before方法');
    }
    this.afterList = await this.daoHelper.find(this.tableName,this.cdt);

    fun(this.beforeList,this.afterList);
  }

}