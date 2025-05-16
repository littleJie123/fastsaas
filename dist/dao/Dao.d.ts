import Query from './query/Query';
import IExecutor from './executor/IExecutor';
import Builder from './builder/Builder';
import DaoOpt from './opt/DaoOpt';
import Context from './../context/Context';
import { OnlyArrayIntface, onlyDataInterface } from '../interface';
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
     * @param cdt
     */
    updateByIds(pojos: Pojo[], cdt: any): Promise<number>;
    /**
     * 根据一个查询条件，进行更新
     * @param whereCdt 查询条件
     * @param data  //更新数据
     */
    updateByCdt(whereCdt: any, data: any): Promise<number>;
    /**
     * 根据一个查询条件，进行删除
     * @param cdt
     * @param data
     */
    delByCdt(cdt: any): Promise<number>;
    /**
     * 检查一些查询条件是否为空
     * @param cdt
     * @returns
     */
    protected _checkNullCdt(cdt: any): void;
    /**
     * 返回表格名称
     * @returns
     */
    getTableName(): string;
    setContext(context: Context): void;
    getContext(): Context;
    constructor(opt: IDaoOpt);
    /**
     * 根据主键判断有或者没有 来决定是更新还是新增
     * @param data
     */
    save(data: Pojo, whereObj?: any): Promise<Pojo>;
    /**
     * 根据主键判断有或者没有
     * 和save的区别，会返回结果true/false
     * 如果是add 返回true
     * 如果是update 根据update的条数是否不为0 返回true或者false
     * 不为0 返回true
     * 为0 表示没有更新到，返回false
     * @param data
     */
    saved(data: Pojo, whereObj?: any): Promise<boolean>;
    /**
     * 返回table的主键，只针对一个主键的表有效
     */
    getIdCol(): string;
    /**
     * 返回table的pojo【内存】主键 和getIdCol的区别本函数返回驼峰，getIdCol返回下划线
     */
    getPojoIdCol(): string;
    /**
     *
     * 增加一条数据
     * @param obj 数据
     */
    add(obj: Pojo): Promise<Pojo>;
    /**
     * 导入一个数组,和addArray的区别在于，主键会被插入
     * @param list
     */
    importArray(list: Pojo[]): Promise<void>;
    /**
     * @description 增加一组数据
     * @param arr objectp[]
     */
    addArray(arr: Pojo[]): Promise<Pojo[]>;
    /**
     * 修改一条数据
     * 返回值，更改数量，0/1
     * @param obj  数据
     * @param whereObj 其他条件
     *
     */
    update(obj: Pojo, whereObj?: any): Promise<number>;
    incre(pojo: Pojo, col: string, num?: number): Promise<number>;
    /**
     * 多对1的保存，有点类似onlyArray，但是没有重复性检查
     * @param saveItems
     * @returns
     */
    saveItems(saveItems: ISaveItem<Pojo>): Promise<void>;
    /**
    }
  
   
  
    /**
     * 更新一个数组
     * @param array
     */
    updateArray(array: Pojo[], other?: object, whereObj?: any): Promise<number>;
    updateArrayWithCols(array: Pojo[], cols: string[], other?: object, whereObj?: any): Promise<void>;
    /**
     *删除一条数据
     * @param obj 删除的数据
     * @param opts 删除条件
     */
    del(obj: Pojo, opts?: any): Promise<number>;
    /**
     * 删除一个数组
     * @param array 删除的数据
     * @opts 删除条件
     */
    delArray(array: Pojo[], opts?: any): Promise<number>;
    /**
     * 查询
     * @param query 可以是个结构体，可以是个Cdt，可以是个Query
     */
    find(query: any): Promise<Pojo[]>;
    /**
     * 和find一样的用法，但是不会再经过转换，适合于group之类的场景
     * @param query
     * @returns
     */
    findData(query: any): Promise<any[]>;
    /**
     * 创建查询的sql
     * @param query
     */
    createFindSql(query: any): Sql;
    /**
     * 查询数量
     * @param query  可以是个结构体，可以是个Cdt，可以是个Query
     */
    findCnt(query: any): Promise<number>;
    /**
     * 查询单条数据
     * @param query  可以是个结构体，可以是个Cdt，可以是个Query
     */
    findOne(query: any): Promise<Pojo>;
    /**
     * 根据id查询一条数据
     * @param id
     */
    getById(id: string | number | object): Promise<Pojo>;
    /**
     * 根据id数组查询一批数据
     * @param ids
     * @key 特定 key (findByKeys)
     * @col 单独列, distinct 数据
     */
    findByIds(ids: Array<string | number>, key?: string, col?: string): Promise<Pojo[]>;
    /**
     *
     * @param opt
     * @returns
     */
    onlyArray(opt: OnlyArrayIntface<Pojo>): Promise<Pojo[]>;
    /**
       * 只查询某一列 distinct col
       * @param {[type]} query     [description]
       * @param {[type]} col       [description]
       * @yield {[type]} [description]
       */
    protected _findCol(query: Query, col: string): Promise<any[]>;
    /**
     * 查询某一列，返回当前列的简单数据，没有结构体
     * @param query
     * @param col
     */
    findCol(query: any, col: string): Promise<any[]>;
    /**
     * findCol 的limit 1 版本
     * @param query
     * @param col
     * @returns
     */
    findOneCol(query: any, col?: any): Promise<any>;
    /**
     * 将一个结构转成query
     * @param query
     * @returns
     */
    protected _parseQuery(query: any): Query;
    /**
     * data可空
     * opt.query 查询条件
     * opt.noSch default false, 直接查询, 返回 opt.fun (sortFun) 第一条
     * opt.sortFun
     * opt.data 当 nosch: true, 不需要先查询时，插入 data, 再查询 query
     * 若仅新增一条, 即返回；若 sortFun 后，第一条不是该新增, 则返回第一条, 删除新增
     * @param opt AnyObject
     */
    onlyData(opt: onlyDataInterface): Promise<any>;
    /**
     * @description list 数组排序后, 只取第一条, 删除剩余数据 onlyArray用
     * @param list
     * @param sortFun
     * @param delId
     */
    protected _delOther(list: any[], sortFun?: (obj1?: Pojo, obj2?: Pojo) => number): Promise<any>;
    /**
     * 根据多个查询查找
     * @param querys
     * @returns
     */
    findByQuerys(querys: Query[]): Promise<Pojo[]>;
    /**
     * 返回sql的map
     * map 结构{key:class}
     */
    protected _acqMap(): object;
    /**
     * 初始化sql的map，需要每个子类指定
     */
    protected abstract _initMap(): any;
    /**
     * 执行一个指定的sql
     * @param key
     * @param obj
     * @param opts
     * @returns
     */
    protected _execute(key: string, obj: any, opts?: any): Promise<any>;
    /**
     * 直接执行sql
     * @param sql sql,可以带?
     * @param values sql的值
     *
     */
    executeSql(sql: string, values?: any[]): Promise<any>;
    /**
     * 执行存储过程
     * @param sql
     * @param values
     */
    executeStoreProcedure(name: string, values?: any[]): Promise<any>;
    protected _query(key: string, obj: any, opts?: any): Promise<any>;
    /**
     * 返回sql的执行器，每个数据库重写
     */
    protected abstract _acqExecutor(): IExecutor;
    /**
     * 返回
     * @param key 操作，类似add ,update
     */
    protected _acqBuilder(key: string, opt?: DaoOpt): Builder;
    /**
     * 高阶函数，返回一个逻辑删除的批量操作
     */
    buildLogicDelArrayFun(): (array: any[]) => Promise<void>;
    processInTimes(opt: {
        query: any;
        /** 处理函数 */
        fun: (list: Pojo[]) => Promise<boolean>;
        limit?: number;
        col?: string;
    }): Promise<void>;
    /**
     * 将一个从数据库里面查询出来的数据转成内存的数据
     * @param data
     */
    protected changeDbData2Pojo(data: any): Pojo;
    /**
     * 将一个从数据库里面查询出来的数据转成内存的数据
     * @param data
     */
    changeDbArray2Pojo(datas: any[]): Pojo[];
    getColChanger(): import("./colChanger/ColChanger").default;
}
