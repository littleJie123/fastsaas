"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SqlDao_1 = __importDefault(require("./imp/SqlDao"));
const MySqlExecutor_1 = __importDefault(require("./executor/MySqlExecutor"));
const fastsaas_1 = require("../fastsaas");
class MySqlDao extends SqlDao_1.default {
    _acqExecutor() {
        let context = this.getContext();
        if (this._executor == null) {
            var opt = this._opt;
            let mysqlExecutor;
            mysqlExecutor = new MySqlExecutor_1.default(opt);
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
    async findByQuerys(querys) {
        if (querys == null || querys.length == 0) {
            return [];
        }
        let sql = new fastsaas_1.Sql('');
        let executor = this._acqExecutor();
        let builder = this._acqBuilder('find');
        for (let i = 0; i < querys.length; i++) {
            let query = querys[i];
            if (i > 0) {
                sql.add('union');
            }
            sql.add('(');
            sql.add(builder.build(query));
            sql.add(')');
        }
        let list = await executor.execute(sql);
        return this.changeDbArray2Pojo(list);
    }
}
exports.default = MySqlDao;
