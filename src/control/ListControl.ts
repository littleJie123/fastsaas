import { ArrayUtil } from './../util/ArrayUtil';
import CsvUtil, { CsvCol } from './../util/CsvUtil';
import Cdt from './../dao/query/cdt/imp/Cdt';
import Query from './../dao/query/Query';
import BaseCdt from './../dao/query/cdt/BaseCdt';
import Dao from './../dao/Dao';
import Control from "./Control";
import { JsonUtil } from '../fastsaas';

/**
 * 参数__download不为空，则转为下载 
 * 查询（不包括group by）的控制类
 */
export default abstract class ListControl extends Control {
  /**
   * 开关，不需要查询条件
   */
  protected _noCdt: boolean = false;
  /**
   * 开关，不需要查询数量
   */
  protected _onlySch: boolean = false;

  /**
   * 增加排序字段
   *  [{
          col:'sort',desc:'desc'
      }]
   */
  protected _orderArray: {col:string,desc:string}[] = null;
  /*
  指定只有_schCols 才产生的查询条件
  */
  protected _schCols: any = null;
  /*
  指定_noSchCols 中不要产生查询条件
  */
  protected _noSchCols: any = null;
  /**
   * 查询 计算符 > <
   * {
   *  begin:'>',
   * end:'<'
   * }
   */
  protected _opMap: any = null;

  /**
   * 默认查询类型，可以是Array,结构体{store_id：330108}或者BaseCdt的实例
   * 
   */
  protected _schCdt: any = null;

  /**
   * 查询字段转化map
   * </br>
   * <pre>
   * {
   *  begin:'gmt_crete',
   * end:'gmt_create'
   * }
   * </pre>
   */
  protected _colMap: any = null;

  protected getTableName(): string {
    return null
  }
  /**
   * 返回查询负责的dao
   */
  protected getDao(): Dao {
    let tableName = this.getTableName();
    if (tableName == null)
      throw new Error('必须冲载getTableName');
    let context = this.getContext();
    return context.get(tableName + 'dao');
  };
  /**
   * 对查询结果的后处理
   * @param list 
   */
  protected async _processList(list: any[]): Promise<any[]> {
    return list;
  }
  /**
   返回查询字段
  */
  protected acqCol(): Array<string> {
    return null;
  }

  protected isOnlySch(){
    if(this._onlySch){
      return true;
    }
    return this._param._first != null;
  }
  /**
   * 是否需要排序
   */
  protected _needOrder() {
    return true
  }


  /**
   根据params的列和值构建某个条件
  */
  protected async buildCdt(e:string, val): Promise<BaseCdt> {
    if (e.substring(0, 1) == '_') return null;
    if (val == null) {
      return null;
    }
    if (this._noCdt)
      return null
    if (this._schCols != null) {
      if (typeof this._schCols == 'string')
        this._schCols = [this._schCols];
      if (this._schCols instanceof Array) {
        this._schCols = ArrayUtil.toMap(this._schCols);
      }
      if (this._schCols[e] == null) {
        return null;
      }

    }

    if (this._noSchCols != null) {
      if (typeof this._noSchCols == 'string')
        this._noSchCols = [this._noSchCols];
      if (this._noSchCols instanceof Array) {
        this._noSchCols = ArrayUtil.toMap(this._noSchCols);
      }
      if (this._noSchCols[e]) {
        return null;
      }

    }
    if (e == 'desc' || e == 'orderBy' || e == 'pageNo' || e == 'pageSize') {
      return null;
    }
    return new Cdt(
      await this.getCol(e),
      await val,
      await this.getOp(e))
  }

  /**
   * 产生一个like查询语句
   * @param field 
   * @param val 
   */
  protected like(field, val, onlyLeft?: boolean): Cdt {
    if (val == null || val == '') return null
    if (onlyLeft) {
      return new Cdt(field, val + '%', 'like')
    } else {
      return new Cdt(field, '%' + val + '%', 'like')
    }
  }
  /**
   * 初始化分页信息
   */
  protected _initPager() {
    var param = this._param
    if (param.pageSize == null) {
      
      param.pageSize = this.acqDefPageSize()
    }
  }
  /**
   * 是否第一页为0
   */
  protected firstPageIsZero(): boolean {
    return false;
  }
  /**
   * 设置分页
   * @param query 
   */
  protected _setPage(query: Query):void {
    if (!this.isDownload()) {
      var param = this._param
      if (param.pageSize != null){
        query.size(param.pageSize)
      }
      if (param._first != null) { 
        query.first(param._first)
      } else {

        if (!this.firstPageIsZero()) {
          if (param.pageNo == null) {
            param.pageNo = 1
          }
          query.setPage(param.pageNo);
        } else {
          if (param.pageNo == null) {
            param.pageNo = 0
          }
          query.setPage(param.pageNo + 1);
        }
      }
    }

  }

  /**
  构建查询
  */
  protected async buildQuery() {
    var query = new Query()
    var param = this._param
    if (param == null) param = {}
    this._setPage(query)

    var col = this.acqCol()
    if (col) {
      query.col(col)
    }
    if (this._needOrder()) {
      //从参数中设置排序
      query.order(param.orderBy, param.desc)
    }
    //设置预定于的排序条件
    await this.addOrder(query)
    await this.addCdt(query);

    await this.processSchCdt(query)
    return query
  }
  /**
   * 增加查询条件
   * @param query 
   */
  protected async addCdt(query: Query) {

    var param = this._param;
    for (var e in param) {
      query.addCdt(await this.buildCdt(e, param[e]));
    }
  }

  /**
   * 增加排序
   * @param query 
   */
  protected async addOrder(query) {
    if (this._orderArray) {
      for (var i = 0; i < this._orderArray.length; i++) {
        var item = this._orderArray[i]
        if (item.col != null) {
          query.addOrder(item.col, item.desc)
        } else {
          query.addOrder(item)
        }
      }
    }
  }
  /**
   * 返回默认的查询条件
   */
  protected acqDefPageSize() {
    return 1500
  }

  /**
   * 处理this._schCdt
   * @param {[type]} query         [description]
   * @yield {[type]} [description]
   */
  protected async processSchCdt(query) {
    if (this._schCdt) {
      if (this._schCdt instanceof Array) {
        for (var cdt of this._schCdt) {
          if (!(cdt.clazz == 'BaseCdt')) {
            if (cdt.col != null) {
              query.addCdt(new Cdt(cdt.col, cdt.value, cdt.op))
            } else {
              query.addCdt(cdt);
            }
          } else {
            query.addCdt(cdt)
          }
        }
      } else {
        if (this._schCdt.clazz == 'BaseCdt') {
          query.addCdt(this._schCdt)
        } else {
          for (var e in this._schCdt) {
            query.addCdt(new Cdt(e, this._schCdt[e]))
          }
        }
      }
    }
  }
  protected getCol(name): string {
    if (this._colMap == null) return name
    var ret = this._colMap[name]
    if (ret == null) ret = name
    return ret
  }

  /**
   * 使用findData 函数
   */
  protected useFindData(){
    return false;
  }
  /**
  返回关联表
  */

  protected async getOp(name) {
    if (this._opMap == null) return null
    return this._opMap[name]
  }
  protected async findByDao(query: Query) {
    if(this.useFindData()){
      return this.getDao().findData(query);
    }
    return this.getDao().find(query)
  }

  protected async find(query) {
    var list = await this.findByDao(query)


    var processedList = await this._processList(list)
    if (processedList != null) {
      list = processedList
    }

    return list
  }
  protected async findCnt(query: Query): Promise<number> {
    if(query == null){
      return 0;
    }
    return await this.getDao().findCnt(query)
  }
  protected async schCnt(map, query: Query) {
    map.totalElements = await this.findCnt(query)
  }

  /**
   * 判断当前请求是否下载
   */
  protected isDownload(): boolean {
    return this._param.__download != null;
  }

  protected getDownloadCols(): CsvCol[] {
    return []
  }

  protected async download():Promise<Buffer> {
    this._param.pageSize = null;
    var query = await this.buildQuery()
    let list = await this.find(query);
    return this.buildDownloadBuffer(list);
  }

  protected buildDownloadBuffer(list: any[]):Buffer {
    return CsvUtil.toBuffer(list, this.getDownloadCols())
  }
  protected async doExecute(): Promise<any> {
    if (this.isDownload()) {
      return await this.download()
    } else {
      this._initPager()
      var query = await this.buildQuery()

      let map: any = {}
      if (query != null) {
        map.list = await this.find(query)
      } else {
        map.list = []
      }
      if (!this.isOnlySch()) {
        await this.schCnt(map, query)
      } 
      this._calPager(map)
      return map
    }

  }
  protected _sendResp(resp, ret) {
    if (this.isDownload()) {
      console.log("'attachment; filename=' + this.getDownloadFileName()",'attachment; filename=' + this.getDownloadFileName());
      resp.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename=' + this.getDownloadFileName(),
        'Content-Length': ret.length
      })
      resp.send(ret);
    } else {
      return super._sendResp(resp, ret);
    }
  }

  protected getDownloadFileName() {
    return 'export.csv'
  }
  /**
   * 计算分页信息
   * @param map 
   */
  protected _calPager(map) {
    if ( map.list == null){
      return;
    }
    map.content = this.onlyCols(map.list)
    
    delete map.list;
  }

  protected getOnlyCols():string[]{
    return null;
  }

  protected onlyCols(list:any[]){
    let cols = this.getOnlyCols();
    
    return JsonUtil.onlyKeys4List(list,cols)   
    
  }


}