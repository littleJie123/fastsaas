import Context from './../context/Context';

export default abstract class Searcher<Pojo = any> {


  protected _map = {};

  protected _context: Context;


  /**
   * 传入的id中是否有0
   * @returns 
   */
  protected hasZeroId():boolean{
    return false;
  }

  /**
   * 出事化，注册inquiry
   * @param context 
   */
  protected abstract init(context: Context);

  /**
   * 返回表格名
   */
  protected abstract getKey(): string;

  setContext(context: Context) {
    this._context = context;
  }

  getContext(): Context {
    return this._context;
  }
  protected getIdKey() {
    //return this.getKey() + '_id';
    let dao = this.getDao();
    return dao.getPojoIdCol();
  }

  protected getDao(): Dao {
    return this._context.get(this.getKey() + 'Dao')
  }

  protected getNoKey() {
    return this.getKey() + '_no';
  }

  /**
   * 是否逻辑删除
   */
  protected getIsDel(): boolean {
    return false;
  }

  afterBuild(context: Context) {

    let opt:any = {
      col: this.getIdKey()
    }
    // if(this.getIsDel()){
    //   opt.otherCdt = {
    //     isDel:0
    //   }
    // }
    this.reg('getById', new Inquiry(opt));
    this.init(context);

    var map = this._map;
    for (var e in map) {
      let inquiry: BaseInquiry = map[e];
      inquiry.setKey(this.getKey());
      inquiry.setContext(this._context);
    }
  }
  /**
   * 注册key
   * @param inquiryKey 
   * @param inquiry 
   */
  reg(inquiryKey: string, inquiry: BaseInquiry) {
    inquiry.setSchColsOnReg(this.getSchCols());
    this._map[inquiryKey] = inquiry
  }

  protected getSchCols(): Array<string> {
    return null;
  }

  _getAll(): Array<BaseInquiry> {
    var array = []
    for (var e in this._map) {
      var inquiry = this._map[e]
      if (inquiry) {
        array.push(inquiry)
      }
    }
    return array
  }
  async save(key: string, array: Array<any>) {
    var inquiry = this.get(key)
    if (inquiry) {
      await inquiry.save(array)
    }
  }

  /**
   * 根据id保存到缓存中，以后get 和findByIds可以从缓存中读取数据
   * @param key 
   * @param array 
   */
  async saveByIds( array: any[]) {
    await this.save('getById',array);
  }
  get(key): BaseInquiry {
    return this._map[key]
  }



  getCache(key): BaseCache {
    let inquiry = this.get(key);
    return inquiry.acqCache();
  }
  async saveAll(array: Array<any>) {
    var list = this._getAll()
    for (var i = 0; i < list.length; i++) {
      if (list[i].couldSaveAll()) {
        await list[i].save(array)
      }
    }
    // list.forEach(obj=>obj.save(array));
  }
  /**
   * 清空缓存，对于多表查询可能无效
   */
  clearCache() {

    var list = this._getAll()
    for (var i = 0; i < list.length; i++) {
      list[i].clearCache();
    }

  }
  /**
   * 根据ids 列表查询多条记录
   * @param array 
   */
  async findByIds(idArray: Array<any>, col?: string): Promise<Pojo[]> {
    var inquiry = this.get('getById')
    let array = idArray;
    let hasZero = false;
    if(this.hasZeroId()){
      array = []
      for(let id of idArray){
        if(id != 0){
          array.push(id)
        }else{
          hasZero = true;
        }
      }
    }
    let ret = await inquiry.find(array, col)
    if(this.hasZeroId()){
      if(hasZero){
        ret.push(this.buildWithZeroId());
      }
    }
    return ret;
  }

  async findAndCheck(idArray:any[],schQuery?:any,cols?:string[]) :Promise<Pojo[]> {

    let ids:any[] = [];
    let idCol = this.getIdKey()
    for(let idObj of idArray){
      if(StrUtil.isStr(idObj) || NumUtil.isNum(idObj)){
        ids.push(idObj)
      }else{
        if(idObj[idCol] != null){
          ids.push(idObj[idCol]);
        }
      }
    }
    let pojos = await this.findByIds(ids);
    let query = schQuery;
    if(schQuery != null && cols != null){
      query = {}
      for(let col of cols){
        query[col] = schQuery[col]
      }
    }
    if(query == null){
      return pojos;
    }

    let dao = new ArrayDao(pojos);
    return await dao.find(query);
  }

  /**
   * 
   * @param obj 带有主键的对象
   * @param cols  需要检查的字段
   * @returns 
   */
  async getByObj(obj:any,cols?:string[]){
    if(obj==null){
      return null;
    }
    let schObj ;
    if(cols == null){
      schObj = obj;
    }else{
      schObj = {};
      for(let col of cols){
        schObj[col] = obj[col]
      }
     
    }
    let ret = await this.getById(obj[this.getIdKey()]);
    for(let e in schObj){
      if(ret[e] != schObj[e]){
        return null;
      }
    }
    return ret;
    
    
  }

  
  /**
   * 从缓存中拿
   * @param array 
   * @param col 
   */
  findByIdsFromCache(array: any, col?: string) {
    var inquiry = this.get('getById')
    return inquiry.acqDataFromCache(array, col)
  }

  buildWithZeroId():Pojo{
    return null;
  }

  async getById(id,cols?:string[]): Promise<Pojo> {
    if (id == null){
      return null;
    }
    if(this.hasZeroId() && id == 0){
      return this.buildWithZeroId();
    }

    var list = await this.findByIds([id])
    let ret =  list[0];
    if(ret != null && cols != null){
      let retObj:any = {};
      for(let col of cols){
        retObj[col] = ret[col] 
      }
      return retObj;
    }
    return ret;
  }
  /**
   * 从缓存中拿
   * @param array 
   * @param col 
   */
  getFromCache(id) {
    if (id == null)
      return null;

    var list = this.findByIdsFromCache(id)
    return list[0]
  }


}
import Inquiry from './inquiry/imp/Inquiry'

import BaseInquiry from './inquiry/BaseInquiry'
import BaseCache from './inquiry/cache/BaseCache';
import Dao from './../dao/Dao';
import e from 'cors';
import { ArrayDao, NumUtil, StrUtil } from '../fastsaas';


