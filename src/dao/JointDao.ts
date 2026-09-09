import Context from "../context/Context";
import Dao from "./Dao";
import MySqlDao from "./MySqlDao";
import JointDaoOpt, { JointDaoParam } from "./opt/JointDaoOpt";

/**
 * 一个联合查询的dao，只支持查询
 */
export default class JointDao extends MySqlDao {

  constructor(opt: JointDaoParam) {
    super(null);
    this._opt = new JointDaoOpt(opt);
  }

  getContext(): Context {
    if (this._context != null) {
      return this._context;
    }
    let daos = this.getDaos();
    if (daos != null && daos.length > 0) {
      return daos[0].getContext();
    }
    return super.getContext();
  }

  /**
   * 联合查询不能执行更新
   */
  protected async _execute(key: string, obj: any, opts?: any): Promise<any> {
    this.throwIfUpdate(key);
    return super._execute(key, obj, opts);
  }

  private getDaos(): Dao[] {
    let opt = this._opt as JointDaoOpt;
    return opt.getDaos();
  }

  private throwIfUpdate(key: string) {
    let updateKeys = ['add', 'addArray', 'importArray', 'update', 'updateArray', 'del', 'delArray'];
    if (updateKeys.indexOf(key) != -1) {
      throw new Error('JointDao是纯查询类，不能执行更新方法');
    }
  }
}
