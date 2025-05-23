interface Result extends ListResult{
  isInit?: boolean;
}


import ListControl, { ListResult } from './ListControl'
/**
 * 还是一个查询，查出来空会运行processInit 方法
 */
export default abstract class InitListControl extends ListControl {
  /**
   * 处理初始化，返回true表示运行了初始化代码，需要重新查询一次。
   */
  abstract processInit(): Promise<boolean>;

  protected async doExecute(): Promise<any> {


    var query = await this.buildQuery()

    let map: Result = {}
    map.content = await this.find(query)
    if (await this._needInit(map.content)) {
      let initRet = await this.processInit();
      //如果运行了初始化

      if (initRet) {
        map.isInit = initRet;
        map.content = await this.find(query);
      }
    }
    if (!this._needCnt) {
      await this.schCnt(map, query)
    } else {
      return map;
    }
    return map

  }
  /**
   * 是否需要初始化
   * @param list 
   */
  protected async _needInit(list): Promise<boolean> {
    return list.length == 0 && !(await this.hasInited());
  }

  protected async hasInited(){
    return false
  }
}
