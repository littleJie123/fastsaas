"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NormalStatus_1 = __importDefault(require("./status/NormalStatus"));
const MysqlPoolFac_1 = __importDefault(require("../../poolFac/MysqlPoolFac"));
class MySqlExecutor {
    constructor(opt) {
        this._normalStatus = new NormalStatus_1.default();
        this._opt = opt;
    }
    setOpt(opt) {
        this._opt = opt;
    }
    setContext(context) {
        this._context = context;
        this._normalStatus;
    }
    _printLog(...message) {
        if (this._context == null) {
            return;
        }
        var logger = this._context.getLogger('mysql');
        logger.debug(message);
    }
    _acqStatus() {
        let ret;
        if (this._context != null) {
            let tm = this._context.get('TransManager');
            if (tm != null && tm.getTransNum() > 0) {
                ret = this._context.get('MySqlTrans');
            }
            else {
                ret = this._normalStatus;
            }
        }
        else {
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
    async execute(sql) {
        var str = sql.toSql();
        var values = sql.toVal();
        return await this.executeSql(str, values);
    }
    async executeSql(sql, values) {
        var opt = this._opt;
        let poolName = opt.getPoolName();
        if (poolName == null || poolName == '')
            poolName = MysqlPoolFac_1.default.getDefPoolName();
        let status = this._acqStatus();
        let obj;
        let now = new Date();
        try {
            obj = await status.execute(poolName, sql, values);
        }
        catch (e) {
            throw e;
        }
        finally {
            let num = new Date().getTime() - now.getTime();
            if (obj instanceof Array) {
                this._printLog(sql, values, "time:" + num, 'length:' + obj.length);
            }
            else {
                this._printLog(sql, values, "time:" + num);
            }
        }
        return obj;
    }
    /**
     * 执行查询
     * @param sql
     */
    query(sql) {
        return this.execute(sql);
    }
}
exports.default = MySqlExecutor;
