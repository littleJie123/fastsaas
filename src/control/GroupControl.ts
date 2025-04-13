import { ArrayUtil } from './../util/ArrayUtil';
import CsvUtil from './../util/CsvUtil';
import ListControl, { ListParam, ListResult } from './ListControl'
import Query from './../dao/query/Query';

/**
 * 做group by的control
 */
export default abstract class GroupControl<Param extends ListParam = ListParam> extends ListControl<Param> {
  /**
   * 内存查询的列
   */
  protected _arrayCdt: Array<string>;
  /**
   * group 字段
   * _orderArray 设置排序
   */
  protected acqGroup(): Array<string> {
    return null
  }
  /**
   * 处理当前页数据
   * @param list 
   */
  protected async _processPageList(list: Array<any>): Promise<Array<any>> {
    return list;
  }
  
  /**
   * 是否设置数据库排序
   * @returns 
   */
  protected _needOrder(): boolean {
    //通过first进行拉取
    return this._param._first != null;
  }
  /**
   * 是否设置数据库排序
   * @returns 
   */
  protected _needPager():boolean{
    //通过first进行拉取
    return this._param._first != null;
  }
  /**
   * 内存排序
   * @param list 
   */
  protected _pageOrder(list) {
    if (!this._needOrder()) {
      var param = this._param
      if (param.orderBy) {
        ArrayUtil.order(list, {
          order: param.orderBy,
          desc: param.desc
        })
      }

      if (this._orderArray) {
        var orders = []
        for (var i = 0; i < this._orderArray.length; i++) {
          var item = this._orderArray[i]
          orders.push({ order: item.order, desc: item.desc })

        }
        ArrayUtil.order(list, orders);
      }

    }
  }
  async addOrder(query: Query) {
    if (!this._needOrder()) {
      return
    }
    return await super.addOrder(query);
  }


  protected async addCdt(query: Query) {
    var arrayCdt = this._arrayCdt;
    var param = this._param;
    for (var e in param) {
      if (arrayCdt == null || !ArrayUtil.inArray(arrayCdt, e)) {
        query.addCdt(await this.buildCdt(e, param[e]));
      }
    }
  }
  async buildQuery() {
    var query = await super.buildQuery();
    var group = this.acqGroup()
    if (group) {
      query.group(group)
    }

    return query
  }
   /**
   * 使用findData 函数
   */
   protected useFindData(){
    return false;
  }
  protected async find(query: Query) {
    
    let list = await this.findByDao(query)

    return list
  }
  /**
   * 内存过滤
   * @param list 
   */
  protected async _filterByArrayCdt(list) {
    var arrayCdt = this._arrayCdt;
    if (arrayCdt == null)
      return list;
    var array = [];
    var param = this._param;
    var query = new Query();
    for (var e of arrayCdt) {
      if (param[e] != null) {
        query.addCdt(await this.buildCdt(e, param[e]));
      }
    }
    for (var data of list) {
      if (query.isHit(data)) {
        array.push(data);
      }
    }
    return array;

  }
  protected async doExecute():Promise<any> {
    if (this.isDownload()) {

      let query = await this.buildQuery()
      let list = await this.find(query)
      let processedList = await this._processList(list)
      if (processedList != null) {
        list = processedList
      }
      list = await this._filterByArrayCdt(list);
      processedList = await this._processPageList(list)
      if (processedList != null) {
        list = processedList
      }
      return CsvUtil.toBuffer(list, this.getDownloadCols());


    } else {
      let query = await this.buildQuery()
      let map: ListResult = {}

      map.content = await this.find(query)


      let processedList = await this._processList(map.content)
      if (processedList != null) {
        map.content = processedList
      }


      map.content = await this._filterByArrayCdt(map.content);
      if (!this._needCnt){
        this._pageOrder(map.content)
        await this.schCnt(map, query)

        
      }
      if (this._processPageList) {
        let processedList = await this._processPageList(map.content)
        if (processedList != null) {
          map.content = processedList
        }
      }
      this.slice(map)
      map.pageSize = this.getPageSize()
      map.first = this.getFirst()
 
      return map
    }
  }
  /**
   * 搜索数量和值
   * @param map 
   * @param query 
   */
  protected async schCnt(map, query) {
    if(this.needSchCnt()){
      map.totalElements = map.list.length
    }
  }
  /**
   * 内存中分页
   * @param map 
   */
  slice(map:ListResult) {
    if(!this._needPager()){
      map.content = map.content.slice(this.getFirst(),this.getFirst()+this.getPageSize())
    }
  }
 

  /**
   * setPage 注销掉，因为group 必须查询所有数据才知道数量
   * @param query 
   */
  protected _setPage(query: Query) {
    if(this._needPager()){
      super._setPage(query);
    }
  }

}