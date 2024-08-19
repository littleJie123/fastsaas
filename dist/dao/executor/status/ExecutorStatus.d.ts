import Context from './../../../context/Context';
import TransManager from './../../../tans/TransManager';
export default abstract class ExecutorStatus {
    protected _context: Context;
    /**
     * 执行sql
     * @param poolName
     * @param sql
     * @param values
     */
    abstract execute(poolName: any, sql: string, values: Array<any>): Promise<any>;
    /**
     * 开始事物
     */
    abstract beginTran(): Promise<any>;
    /**
     *
     * 开始参数
     */
    abstract commitTran(): Promise<any>;
    /**
     * 回滚参数
     */
    abstract rollbackTran(): Promise<any>;
    setContext(context: Context): void;
    getTransManager(): TransManager;
}
