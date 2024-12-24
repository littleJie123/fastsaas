import SqlDao from './imp/SqlDao';
import IExecutor from './executor/IExecutor';
import MySqlExecutor from './executor/MySqlExecutor'
import { Query, Sql } from '../fastsaas';


export default class MySqlDao<Pojo = any> extends SqlDao<Pojo> {
  protected _executor: IExecutor;
  protected _acqExecutor(): IExecutor {
    let context = this.getContext();
    if (this._executor == null) {
      var opt = this._opt;
      let mysqlExecutor;
      mysqlExecutor = new MySqlExecutor(opt)
      mysqlExecutor.setContext(context);
      this._executor = mysqlExecutor;

    }
    return this._executor;
  }


  /**
   * 根据多个查询查找
   * @param querys 
   * @returns 
   */
  async findByQuerys(querys:Query[]):Promise<Pojo[]>{
    if(querys == null || querys.length == 0){
      return []
    }
    let sql = new Sql('');
    let executor = this._acqExecutor();
    let builder = this._acqBuilder('find');
    for(let i =0;i<querys.length;i++){
      let query = querys[i];
      if(i>0){
        sql.add('union')
      }
      sql.add('(');
      sql.add(builder.build(query))
      sql.add(')')
    }
    let list = await executor.execute(sql);
    return this.changeDbArray2Pojo(list);
  }
}

