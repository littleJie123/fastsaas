import Query from './query/Query';
import IExecutor from './executor/IExecutor'
import Builder from './builder/Builder';
import DaoOpt from './opt/DaoOpt';

import _ from 'lodash'
import { BeanUtil } from './../util/BeanUtil';
import { ArrayUtil } from './../util/ArrayUtil';
import Context from './../context/Context';
import { OnlyArrayIntface, AnyObject, onlyDataInterface } from '../interface'
import { Sql } from './sql';
import IDaoOpt from '../inf/IDaoOpt';
import ISaveItem from './ISaveItem';

export default abstract class Dao<Pojo = any> {


  protected _opt: DaoOpt;
  protected _map: object;
  protected _context: Context;


  /**
   * 根据id更新cdt中的数据，updateArray的语法糖
   * @param pojos 
   * @param cdt 更新内容
   * @param where 更新条件
   */
  async updateByIds(pojos: Pojo[], cdt: any, where?: any) {
    let idCol = this._opt.acqPojoFirstId();
    let datas: any[] = pojos.map(pojo => ({
      [idCol]: pojo[idCol]
    }))
    return this.updateArray(datas, cdt, where);

  }

  /**
   * 根据一个查询条件，进行更新
   * @param whereCdt 查询条件
   * @param data  //更新数据
   */
  async updateByCdt(whereCdt, data) {
    this._checkNullCdt(whereCdt);
    let idCol = this._opt.acqPojoFirstId();
    let list = await this.findCol(whereCdt, idCol);
    list = list.map(id => ({ [idCol]: id }))

    return await this.updateArray(list, data, whereCdt);
  }


  /**
   * 根据一个查询条件，进行删除
   * @param cdt 
   * @param data 
   */
  async delByCdt(cdt) {
    this._checkNullCdt(cdt);
    let idCol = this._opt.acqPojoFirstId();
    let list = await this.findCol(cdt, idCol);
    list = list.map(id => ({ [idCol]: id }))
    return await this.delArray(list, cdt);
  }
  /**
   * 检查一些查询条件是否为空
   * @param cdt 
   * @returns 
   */
  protected _checkNullCdt(cdt) {
    if (cdt == null) {
      throw new Error('条件不能为空');
    }
    if (cdt.clazz == 'BaseCdt' || cdt.clazz == 'Query') { //BaseCdt 没办法检测条件
      throw new Error('条件只能传结构体');
    }
    let cnt = 0;
    for (var e in cdt) {
      if (cdt[e] != null) {

        cnt++;
      }
    }
    if (cnt == 0)
      throw new Error('不能传空的条件');

  }
  /**
   * 返回表格名称
   * @returns 
   */
  getTableName(): string {
    return this._opt.getTableName();
  }

  setContext(context: Context) {
    this._context = context;
  }
  getContext() {
    if (this._context == null)
      this._context = new Context()
    return this._context;
  }
  constructor(opt: IDaoOpt) {

    this._opt = new DaoOpt(opt);
  }

  /**
   * 根据主键判断有或者没有 来决定是更新还是新增
   * @param data 
   */
  async save(data: Pojo, whereObj?) {
    if (data == null)
      return
    let id = data[this._opt.acqPojoFirstId()]
    if (id == null) {
      await this.add(data)
    } else {
      await this.update(data, whereObj);
    }
    return data;
  }

  /**
   * 根据主键判断有或者没有
   * 和save的区别，会返回结果true/false
   * 如果是add 返回true
   * 如果是update 根据update的条数是否不为0 返回true或者false
   * 不为0 返回true
   * 为0 表示没有更新到，返回false
   * @param data 
   */
  async saved(data: Pojo, whereObj?): Promise<boolean> {
    if (data == null)
      return
    let id = data[this._opt.acqPojoFirstId()]
    if (id == null) {
      await this.add(data)
      return true;
    } else {
      return (0 != (await this.update(data, whereObj)));
    }
  }
  /**
   * 返回table的主键，只针对一个主键的表有效
   */
  getIdCol(): string {
    return this._opt.acqFirstId();
  }

  /**
   * 返回table的pojo【内存】主键 和getIdCol的区别本函数返回驼峰，getIdCol返回下划线
   */
  getPojoIdCol(): string {
    return this._opt.acqPojoFirstId();
  }
  /**
   *
   * 增加一条数据
   * @param obj 数据
   */
  async add(obj: Pojo): Promise<Pojo> {
    if (!obj || typeof obj !== 'object' || !Object.keys(obj)) return <Pojo>{}
    var result = await this._execute('add', _.cloneDeep(obj))
    var opt = this._opt;
    if (result.insertId && opt.isIncrement()) {
      obj[opt.acqPojoFirstId()] = result.insertId;
    }
    return obj
  }
  /**
   * 导入一个数组,和addArray的区别在于，主键会被插入
   * @param list 
   */
  async importArray(list: Pojo[]) {
    if (list != null && list.length > 0) {
      await this._execute('importArray', _.cloneDeep(list))
    }
  }
  /**
   * @description 增加一组数据
   * @param arr objectp[]
   */
  async addArray(arr: Pojo[]): Promise<Pojo[]> {
    if (!arr || arr.length == 0) return
    const result = await this._execute('addArray', _.cloneDeep(arr))
    const opt = this._opt
    if (result.insertId && opt.isIncrement()) {
      const idName = opt.acqPojoFirstId()
      for (let obj of arr) {
        obj[idName] = result.insertId++
      }
    }
    return arr
  }
  /**
   * 修改一条数据
   * 返回值，更改数量，0/1
   * @param obj  数据
   * @param whereObj 其他条件
   *
   */
  async update(obj: Pojo, whereObj?): Promise<number> {


    var ret = await this._execute('update', obj, whereObj)
    return ret.affectedRows;
  };

  async incre(pojo: Pojo, col: string, num?: number) {
    let id = this._opt.acqPojoFirstId()
    let obj: any = {
      [id]: pojo[id]
    };
    if (num == null) {
      num = 1;
    }
    let sqlCol = this._opt.parsePojoField(col)
    obj[col] = new Sql(`${sqlCol}=${sqlCol}+${num}`);
    return this.update(obj);
  }

  /**
   * 多对1的保存，有点类似onlyArray，但是没有重复性检查
   * @param saveItems 
   * @returns 
   */
  async saveItems(saveItems: ISaveItem<Pojo>) {
    let needUpdates: Pojo[] = [];
    let needAdds: Pojo[] = [];
    let idCol = this._opt.acqPojoFirstId()
    if (saveItems.list) {
      for (let pojo of saveItems.list) {
        if (pojo[idCol] == null) {
          needAdds.push(pojo);
        } else {
          needUpdates.push(pojo);
        }
      }
    }
    let exists = await this.find(saveItems.query);
    let needDel = ArrayUtil.notInByKey(exists, needUpdates, idCol);
    if (needDel.length > 0) {
      await this.updateArrayWithCols(needDel, [], { isDel: 1 });
    }
    await this.updateArray(needUpdates);
    await this.addArray(needAdds);
  }
  /**
  }

 

  /**
   * 更新一个数组
   * @param array
   */
  async updateArray(array: Pojo[], other?: object, whereObj?: any): Promise<number> {
    if (!array || array.length == 0) return
    if (array.length == 1 && other == null) {
      return this.update(array[0], whereObj)
    }
    const res = await this._execute('updateArray', array, { other, whereObj })
    return res.affectedRows
  }

  async updateArrayWithCols(array: Pojo[], cols: string[], other?: object, whereObj?: any) {
    const idName = this._opt.acqPojoFirstId()
    let updateDatas = array.map(row => {
      let ret: any = {};
      cols.forEach(col => {
        if (row.hasOwnProperty(col)) {
          ret[col] = row[col];
        }
      })
      ret[idName] = row[idName];
      return ret;
    })
    return await this.updateArray(updateDatas, other, whereObj);
  }

  /**
   *删除一条数据 
   * @param obj 删除的数据
   * @param opts 删除条件
   */
  async del(obj: Pojo, opts?): Promise<number> {
    var ret = await this._execute('del', obj, opts)
    return ret.affectedRows;
  }

  /**
   * 删除一个数组
   * @param array 删除的数据
   * @opts 删除条件
   */
  async delArray(array: Pojo[], opts?: any): Promise<number> {

    if (!array || !array.length) return 0;
    const res = await this._execute('delArray', array, opts)
    return res.affectedRows
  }

  /**
   * 查询
   * @param query 可以是个结构体，可以是个Cdt，可以是个Query 
   */
  async find(query): Promise<Pojo[]> {

    const ret = await this._query('find', query)
    return this.changeDbArray2Pojo(ret)
  }

  /**
   * 和find一样的用法，但是不会再经过转换，适合于group之类的场景
   * @param query 
   * @returns 
   */
  async findData(query): Promise<any[]> {

    let executor = this._acqExecutor();
    let builder = this._acqBuilder('find', this._opt.clone().removeColChange());
    let sql = builder.build(query)
    return await executor.query(sql);
  }

  /**
   * 创建查询的sql
   * @param query 
   */
  createFindSql(query: any): Sql {
    let builder = this._acqBuilder('find');
    return builder.build(query);
  }
  /**
   * 查询数量
   * @param query  可以是个结构体，可以是个Cdt，可以是个Query
   */
  async findCnt(query): Promise<number> {
    let array = await this._execute('findCnt', query)
    if (array.length == 0)
      return 0;
    return array[0].cnt
  }
  /**
   * 查询单条数据
   * @param query  可以是个结构体，可以是个Cdt，可以是个Query
   */
  async findOne(query): Promise<Pojo> {
    var array = await this._execute('findOne', query)

    if (array.length == 0)
      return null;
    return this.changeDbData2Pojo(array[0])
  }
  /**
   * 根据id查询一条数据
   * @param id 
   */
  async getById(id: string | number | object): Promise<Pojo> {
    const res = await this._execute('findById', id)
    if (!res || !res.length) return null
    return this.changeDbData2Pojo(res[0])
  }
  /**
   * 根据id数组查询一批数据
   * @param ids
   * @key 特定 key (findByKeys)
   * @col 单独列, distinct 数据
   */
  async findByIds(ids: Array<string | number>, key?: string, col?: string): Promise<Pojo[]> {
    if (!ids || !ids.length) return []
    if (!key) key = this._opt.acqFirstId();
    var query = new Query()
    query.in(key, ids)
    if (col != null) {
      let ret = await this._findCol(query, col)
      return ret
    }
    let ret = await this.find(query)
    return ret
  }

  /**
   * 
   * @param opt 
   * @returns 
   */
  async onlyArray(opt: OnlyArrayIntface<Pojo>): Promise<Pojo[]> {
    if (!opt || typeof opt != 'object') throw new Error('OnlyArray: need a object')
    if (!opt.query && !opt.finds) throw new Error('OnlyArray: choose one from query and finds')
    let idCol = this._opt.acqPojoFirstId();
    let sortFun = opt.sortFun || ((obj1, obj2) => obj1[idCol] - obj2[idCol])

    let checkUpdate = opt.checkUpdate || (
      (oldData, data) => !BeanUtil.checkIgnore(oldData, data)
    )
    let self = this;
    const find = async (opt) => {
      if (opt.finds)
        return await opt.finds();
      else
        return await self.find(opt.query);
    }

    let list;
    if (opt.noSch) {
      list = [];
    } else {
      list = await find(opt);
    }
    let mapFun = opt.mapFun
    if (mapFun == null) {
      throw new Error('没有给出map的函数')
    }
    let array = opt.array;
    if (array == null && opt.data != null) {
      array = [opt.data];
    }
    let allDatas = array; //记录一下所有的数据，后续查询出来设置id用
    if (array != null && opt.needDistinct) {
      array = ArrayUtil.distinctByKey(array, mapFun);
    }
    if (array == null) {
      return [];
    }
    let arrayMap = ArrayUtil.toMapByKey(array, mapFun)
    let listMap = ArrayUtil.toMapArray(list, mapFun)
    let hasDelData = false;
    for (let e in listMap) {
      var datas = listMap[e]
      if (datas.length > 1) {
        hasDelData = true;
        datas.sort(sortFun);
      }
      listMap[e] = datas[0];
    }

    var needAdd = []
    var needUpdate = []
    var needDel = []

    function pushAdd(e, data) {
      if (data == null) {
        return null
      }
      if (opt.addFun) {
        var addFunRet = opt.addFun(data)
        if (addFunRet != null) {
          data = addFunRet
        }
      }

      needAdd.push(data)
    }

    function pushUpdate(e, data: Pojo, oldData: Pojo) {
      if (data == null) {
        return null
      }
      if (opt.updateFun) {
        var updateFunRet: Pojo = opt.updateFun(data, oldData)
        if (updateFunRet != null) {
          data = updateFunRet
        }
      }


      if (checkUpdate(oldData, data)) {
        data = BeanUtil.shallowClone(data);
        data[idCol] = oldData[idCol]

        if (opt.beforeUpdate) {
          var beforeUpdateRet = opt.beforeUpdate(data, oldData)
          if (beforeUpdateRet != null) {
            data = beforeUpdateRet;
          }
        }
        needUpdate.push(data)
      }
    }
    for (let e in arrayMap) {
      var oldData = listMap[e]
      var data = arrayMap[e]
      if (oldData == null) {
        if (!opt.noAdd) pushAdd(e, data)
      } else {
        if (opt.needUpdate) {
          if (opt.isUpdate == null || (await opt.isUpdate(data, oldData))) {
            pushUpdate(e, data, oldData)
          }
        }
      }
    }
    var delArray = [];
    if (opt.needDel) {
      delArray = ArrayUtil.notInByKey(list, array, mapFun);
      if (opt.delFun) {
        delArray = ArrayUtil.parse(delArray, opt.delFun);
      }
      if (opt.dels == null) {
        await this.delArray(delArray);
      } else {
        await opt.dels(delArray);
      }
    }
    if (needAdd.length == 0 &&
      needUpdate.length == 0 &&
      !hasDelData &&
      delArray.length == 0) {
      if (opt.needFindId) {
        for (let data of allDatas) {
          let key = ArrayUtil.get(data, mapFun);
          let dbData = listMap[key];
          if (dbData != null) {
            data[idCol] = dbData[idCol];
          }
        }
      }
      return list
    }
    let addedArray = null
    if (opt.adds) {
      addedArray = await opt.adds(needAdd);
    } else {

      addedArray = await this.addArray(needAdd);
    }
    if (opt.updates) {
      await opt.updates(needUpdate, list);
    } else {
      await this.updateArray(needUpdate)
    }
    if (opt.afterFun) {
      await opt.afterFun();
    }
    if (!opt.noLastFind) {
      list = await find(opt);
      let arrayMap = ArrayUtil.toMapArray(list, mapFun)
      let ret: Pojo[] = []
      for (let e in arrayMap) {
        var mapArray = arrayMap[e]
        if (mapArray.length == 1) {
          ret.push(mapArray[0])
        }
        if (mapArray.length > 1) {
          mapArray.sort(sortFun)
          ret.push(mapArray[0])
          ArrayUtil.addAll(needDel, mapArray.slice(1))
        }

      }
      if (opt.needFindId) {
        for (let data of allDatas) {
          let key = ArrayUtil.get(data, mapFun);
          let dbData = arrayMap[key];
          if (dbData != null) {
            data[idCol] = dbData[0][idCol];
          }
        }
      }
      if (!opt.noDel) {
        if (addedArray != null) {
          let delAddArray = ArrayUtil.andByKey(addedArray, delArray, idCol);

          for (let row of delAddArray) {
            delete row[idCol];
          }
        }
        if (opt.dels == null) {
          await this.delArray(needDel);
        } else {
          await opt.dels(needDel, ArrayUtil.andByKey(ret, needDel, opt.mapFun));
        }
      }
      return ret
    }
  }

  /**
   * 只查询某一列 distinct col
   * @param {[type]} query     [description]
   * @param {[type]} col       [description]
   * @yield {[type]} [description]
   */
  protected async _findCol(query: Query, col: string): Promise<any[]> {
    if (!col) col = this._opt.acqFirstId();
    query = this._parseQuery(query)
    query.col('distinct ' + col)
    var list = await this.find(query)
    return list.map(_data => _data[col])
  }

  /**
   * 查询某一列，返回当前列的简单数据，没有结构体
   * @param query 
   * @param col 
   */
  async findCol(query, col: string): Promise<any[]> {
    const ret = this._findCol(query, col)
    return ret
  }
  /**
   * findCol 的limit 1 版本
   * @param query 
   * @param col 
   * @returns 
   */
  async findOneCol(query, col?): Promise<any> {
    var schQuery = Query.parse(query);
    schQuery.size(1);
    var ret = await this.findCol(schQuery, col);
    if (ret.length == 0)
      return null;
    return ret[0]
  }
  /**
   * 将一个结构转成query
   * @param query 
   * @returns 
   */
  protected _parseQuery(query: any) {
    return Query.parse(query);
  }

  /**
   * data可空
   * opt.query 查询条件
   * opt.noSch default false, 直接查询, 返回 opt.fun (sortFun) 第一条
   * opt.sortFun
   * opt.data 当 nosch: true, 不需要先查询时，插入 data, 再查询 query
   * 若仅新增一条, 即返回；若 sortFun 后，第一条不是该新增, 则返回第一条, 删除新增
   * @param opt AnyObject
   */
  async onlyData(opt: onlyDataInterface) {
    if (!opt) return null
    if (!opt.query) return null

    let query = opt.query
    let fun = opt.fun
    let data = opt.data || {}
    let noSch = opt.noSch
    let self = this

    if (typeof query === 'object' && !(query.clazz == 'Query')) {
      let _queryObj = Object.assign({}, query)
      data = BeanUtil.combine(_queryObj, data)
      query = new Query()
      for (let [k, v] of Object.entries(_queryObj)) query.eq(k, v)
    }

    async function sch() {
      var list = await self.find(query)

      return self._delOther(list, fun)
    }

    var ret = null
    if (!noSch) {
      ret = await sch()
      if (ret) return ret
    }
    await this.add(<Pojo>data)
    return sch()
  }

  /**
   * @description list 数组排序后, 只取第一条, 删除剩余数据 onlyArray用
   * @param list
   * @param sortFun
   * @param delId
   */
  protected async _delOther(
    list: any[],
    sortFun?: (obj1?: Pojo, obj2?: Pojo) => number

  ) {
    let idCol = this._opt.acqPojoFirstId()
    if (!sortFun) {
      sortFun = (obj1, obj2) => obj1[idCol] - obj2[idCol]
    }
    if (!list || !list.length) return null
    if (list.length == 1) return list[0]


    list.sort(sortFun)
    const ret = list[0]

    let delArray = list.slice(1);
    await this.delArray(delArray);

    return ret
  }

  /**
   * 根据多个查询查找
   * @param querys 
   * @returns 
   */
  async findByQuerys(querys: Query[]): Promise<Pojo[]> {
    let ret: Pojo[] = [];
    for (let query of querys) {
      ret.push(... (await this.find(query)))
    }
    return ret;
  }

  /**
   * 返回sql的map
   * map 结构{key:class}
   */
  protected _acqMap() {
    if (this._map == null) {
      this._map = this._initMap();
    }
    return this._map;
  }

  /**
   * 初始化sql的map，需要每个子类指定
   */
  protected abstract _initMap();
  /**
   * 执行一个指定的sql
   * @param key 
   * @param obj 
   * @param opts 
   * @returns 
   */
  protected async _execute(key: string, obj: any, opts?: any): Promise<any> {
    let executor = this._acqExecutor();
    let builder = this._acqBuilder(key);
    if (builder == null) {
      throw new Error(key + '的builder没有被构造');
    }
    let sql = builder.build(obj, opts)

    return await executor.execute(sql);
  }


  /**
   * 直接执行sql
   * @param sql sql,可以带?
   * @param values sql的值
   *
   */
  async executeSql(sql: string, values?: any[]) {
    let executor = this._acqExecutor();
    return executor.executeSql(sql, values);
  }
  /**
   * 执行存储过程
   * @param sql 
   * @param values 
   */
  async executeStoreProcedure(name: string, values?: any[]) {
    let executor = this._acqExecutor();
    let strName = '';
    if (values != null && values.length > 0) {
      let strValues = []
      for (let value of values) {
        strValues.push('?')
      }
      strName = strValues.join(',');
    }
    let str = `call ${name}(${strName})`
    let list = await executor.executeSql(str, values);
    return list[0];
  }

  protected async _query(key: string, obj: any, opts?: any): Promise<any> {
    let executor = this._acqExecutor();
    let builder = this._acqBuilder(key);
    let sql = builder.build(obj, opts)
    return await executor.query(sql);
  }

  /**
   * 返回sql的执行器，每个数据库重写
   */
  protected abstract _acqExecutor(): IExecutor;

  /**
   * 返回
   * @param key 操作，类似add ,update
   */
  protected _acqBuilder(key: string, opt?: DaoOpt): Builder {
    if (opt == null) {
      opt = this._opt
    }
    let map = this._acqMap();
    let Clazz = map[key];
    if (Clazz == null)
      return null;
    return new Clazz(opt);
  }

  /**
   * 高阶函数，返回一个逻辑删除的批量操作
   */
  buildLogicDelArrayFun() {
    let self = this;
    let idCol = this._opt.acqPojoFirstId();
    return async function (array: any[]) {
      array = array.filter(row => row.isDel != 1);
      await self.updateArray(
        ArrayUtil.onlyKeys(array, idCol),
        { isDel: 1 }
      )
    }
  }

  /**
   * 分批次处理数据
   * @param opt 
   */
  async processInTimes(opt: {
    query: any,
    /** 处理函数  */
    fun: (list: Pojo[]) => Promise<boolean>,
    limit?: number,
    col?: string
  }) {
    let { query, fun, limit, col } = opt;
    let dbQuery = Query.parse(query);
    if (col == null)
      col = this._opt.acqIds()[0];
    let beginNum = null;
    if (limit == null)
      limit = 1000;
    let cloneQuery = dbQuery.cloneSameCdt();
    cloneQuery.size(limit);
    cloneQuery.order(col);
    cloneQuery.col(dbQuery.getCol())
    let list = await this.find(cloneQuery);
    do {
      if (list.length > 0) {
        let needStop = await fun(list);
        if (needStop || list.length < limit) {
          break;
        }

        beginNum = list[list.length - 1][col];
        cloneQuery = dbQuery.cloneSameCdt();
        cloneQuery.big(col, beginNum)
        cloneQuery.size(limit);
        cloneQuery.order(col);
        cloneQuery.col(dbQuery.getCol())
        list = await this.find(cloneQuery);
      }
    } while (list.length > 0);
  }
  /**
   * 将一个从数据库里面查询出来的数据转成内存的数据
   * @param data 
   */
  protected changeDbData2Pojo(data: any): Pojo {
    let colChanger = this._opt.getColChanger();
    if (colChanger != null) {
      return <Pojo>colChanger.changeDb2Pojo(data);
    } else {
      return data;
    }
  }

  /**
   * 将一个从数据库里面查询出来的数据转成内存的数据
   * @param data 
   */
  changeDbArray2Pojo(datas: any[]): Pojo[] {
    let colChanger = this._opt.getColChanger();
    if (colChanger != null) {
      return <Pojo[]>colChanger.changeDbArray2Pojo(datas)
    } else {
      return datas;
    }
  }

  getColChanger() {
    return this._opt.getColChanger();
  }

  /**
   * 根据数据和字段，将对应属性变成add 的sql
   */
  changeDataToAddSql(pojo: Pojo, col: string) {
    let data: any = pojo;
    let value = data[col]
    if (value != null) {
      let dbCol = this._opt.parsePojoField(col)
      data[col] = new Sql(`?+\`${dbCol}\``, value)
    }
  }
}