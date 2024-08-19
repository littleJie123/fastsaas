"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SqlDao_1 = __importDefault(require("./imp/SqlDao"));
const MySqlExecutor_1 = __importDefault(require("./executor/MySqlExecutor"));
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
}
exports.default = MySqlDao;
