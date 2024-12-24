"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ExecutorStatus_1 = __importDefault(require("./ExecutorStatus"));
class NormalStatus extends ExecutorStatus_1.default {
    async execute(poolName, sql, values) {
        var pool = MysqlPoolFac_1.default.get(poolName);
        let context = this._context;
        return new Promise(function (resolve, reject) {
            pool.query(sql, values, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async beginTran() {
        throw new Error("Method not implemented.");
    }
    async commitTran() {
        throw new Error("Method not implemented.");
    }
    async rollbackTran() {
        throw new Error("Method not implemented.");
    }
}
exports.default = NormalStatus;
const MysqlPoolFac_1 = __importDefault(require("../../../poolFac/MysqlPoolFac"));
