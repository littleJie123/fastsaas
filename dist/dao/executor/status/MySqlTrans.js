"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ExecutorStatus_1 = __importDefault(require("./ExecutorStatus"));
class MySqlTrans extends ExecutorStatus_1.default {
    constructor() {
        super(...arguments);
        this._map = {};
    }
    /**
     * 得到链接
     * @param poolName
     */
    async getConnection(poolName) {
        let conn = this._map[poolName];
        if (conn == null) {
            let pool = await MysqlPoolFac_1.default.get(poolName);
            conn = await this.getConnFromPool(pool);
            this._map[poolName] = conn;
        }
        return conn;
    }
    getConnFromPool(pool) {
        return new Promise(function (resolve) {
            pool.getConnection(function (err, connection) {
                resolve(connection);
            });
        });
    }
    async execute(poolName, sql, values) {
        var connection = await this.getConnection(poolName);
        return new Promise(function (resolve, reject) {
            connection.query(sql, values, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    /**
     * 得到所有链接
     */
    async getAllConnection() {
        var keys = MysqlPoolFac_1.default.getKeys();
        var ret = [];
        for (var key of keys) {
            ret.push(await this.getConnection(key));
        }
        return ret;
    }
    doWithConnection(connection, funName) {
        return new Promise(function (resolve, reject) {
            connection[funName](function (err) {
                if (err) {
                    try {
                        reject(err);
                    }
                    catch (e) {
                        reject(e);
                    }
                }
                else {
                    try {
                        resolve(null);
                    }
                    catch (e) {
                        reject(e);
                    }
                }
            });
        });
    }
    async beginTran() {
        var connections = await this.getAllConnection();
        for (let conn of connections) {
            try {
                await this.doWithConnection(conn, 'beginTransaction');
            }
            catch (e) {
                console.error(e);
            }
        }
    }
    async commitTran() {
        let tm = this.getTransManager();
        let num = tm.getTransNum();
        var connections = await this.getAllConnection();
        for (let conn of connections) {
            try {
                await this.doWithConnection(conn, 'commit');
                if (num <= 0) {
                    conn.release();
                }
            }
            catch (e) {
                console.error(e);
            }
        }
        if (num <= 0) {
            this._map = {};
        }
    }
    async rollbackTran() {
        var connections = await this.getAllConnection();
        let tm = this.getTransManager();
        let num = tm.getTransNum();
        for (let conn of connections) {
            try {
                await this.doWithConnection(conn, 'rollback');
                if (num <= 0) {
                    conn.release();
                }
            }
            catch (e) {
                console.error(e);
            }
        }
        if (num <= 0)
            this._map = {};
    }
}
exports.default = MySqlTrans;
const MysqlPoolFac_1 = __importDefault(require("../../../poolFac/MysqlPoolFac"));
