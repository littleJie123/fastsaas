import BaseOpControl from "./BaseOpControl";

export default abstract class<Pojo= any> extends BaseOpControl{
  protected async doExecute(req?: Request, resp?: Response): Promise<any> {
    let searcher = this.getSearcher();
    let pkCol = this.getPkCol();
    let pojo = await searcher.getById(this._param[pkCol]);
    if(pojo !=null && this.checkDataCdt(pojo)){
      await this.processPojo(pojo)
    }
  }

  protected abstract processPojo(pojo:Pojo):Promise<void>;

  checkDataCdt(pojo:Pojo):boolean{
    let dataCdt = this.getDataCdt()
    if(dataCdt != null){
      for(let e in dataCdt){
        if(dataCdt[e] != pojo[e]){
          return false;
        }
      }
    }
    return true;
  }

  protected needCheckName(): boolean {
    return false;
  }
}