import IExecutor from './IExecutor';
import Sql from './../sql/Sql';
import Context from './../../context/Context';
import ExecutorStatus from './status/ExecutorStatus';
import NormalStatus from './status/NormalStatus';
export default class MySqlExecutor implements IExecutor {
    protected _opt: any;
    protected _context: Context;
    protected _normalStatus: NormalStatus;
    constructor(opt?: any);
    setOpt(opt: any): void;
    setContext(context: any): void;
    _printLog(...message: any[]): void;
    protected _acqStatus(): ExecutorStatus;
    beginTrans(): Promise<void>;
    commitTrans(): Promise<void>;
    rollbackTrans(): Promise<void>;
    /**
     * 执行更新
     * @param sql
     */
    execute(sql: Sql): Promise<any>;
    executeSql(sql: string | String, values: any[]): Promise<any>;
    /**
     * 执行查询
     * @param sql
     */
    query(sql: Sql): Promise<any>;
}
