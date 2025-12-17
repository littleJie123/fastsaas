import IExecutor from './IExecutor';
import mysqlPoolFac from '../../poolFac/MysqlPoolFac'
import Sql from './../sql/Sql';
import TransManager from './../../tans/TransManager';
import Context from './../../context/Context';
import ExecutorStatus from './status/ExecutorStatus';
import NormalStatus from './status/NormalStatus';
import MysqlPoolFac from '../../poolFac/MysqlPoolFac';

export default class MySqlExecutor implements IExecutor {
  protected _opt: any;
  protected _context: Context;
  protected _normalStatus: NormalStatus = new NormalStatus();


  constructor(opt?) {
    this._opt = opt;
  }
  setOpt(opt) {
    this._opt = opt;
  }

  setContext(context) {
    this._context = context;
    if (this._normalStatus != null) {
      this._normalStatus.setContext(context);
    }
  }
  _printLog(...message) {
    if (this._context == null) {
      return;
    }
    var logger = this._context.getLogger('mysql')
    logger.debug(message);
  }

  protected _acqStatus(): ExecutorStatus {
    let ret: ExecutorStatus;
    if (this._context != null) {
      let tm: TransManager = this._context.get('TransManager');
      if (tm != null && tm.getTransNum() > 0) {
        ret = this._context.get('MySqlTrans');
      } else {
        ret = this._normalStatus;
      }
    } else {
      ret = this._normalStatus;
    }
    return ret;
  }

  async beginTrans() {

    await this._acqStatus().beginTran();

  }

  async commitTrans() {
    await this._acqStatus().commitTran();

  }

  async rollbackTrans() {
    await this._acqStatus().rollbackTran();

  }



  /**
   * 执行更新
   * @param sql
   */
  async execute(sql: Sql): Promise<any> {
    var str = sql.toSql();
    var values = sql.toVal();
    return await this.executeSql(str, values);
  }
  async executeSql(sql: string | String, values: any[]) {
    var opt = this._opt;
    let poolName = opt.getPoolName();
    if (poolName == null || poolName == '') {
      poolName = MysqlPoolFac.getDefPoolName();
    }
    let status = this._acqStatus()
    let obj;
    let now = new Date();
    try {
      obj = await status.execute(poolName, <string>sql, values)
    } catch (e) {
      throw e;
    } finally {

      let num = new Date().getTime() - now.getTime();
      if (obj instanceof Array) {
        this._printLog(sql, values, "time:" + num, 'length:' + obj.length);
      } else {
        this._printLog(sql, values, "time:" + num);
      }


    }
    return obj;
  }
  /**
   * 执行查询
   * @param sql
   */
  query(sql: Sql): Promise<any> {
    return this.execute(sql);
  }

}

