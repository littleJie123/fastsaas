"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MySqlDao_1 = __importDefault(require("./MySqlDao"));
const JointDaoOpt_1 = __importDefault(require("./opt/JointDaoOpt"));
/**
 * 一个联合查询的dao，只支持查询
 */
class JointDao extends MySqlDao_1.default {
    constructor(opt) {
        super(null);
        this._opt = new JointDaoOpt_1.default(opt);
    }
    getContext() {
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
    async _execute(key, obj, opts) {
        this.throwIfUpdate(key);
        return super._execute(key, obj, opts);
    }
    getDaos() {
        let opt = this._opt;
        return opt.getDaos();
    }
    throwIfUpdate(key) {
        let updateKeys = ['add', 'addArray', 'importArray', 'update', 'updateArray', 'del', 'delArray'];
        if (updateKeys.indexOf(key) != -1) {
            throw new Error('JointDao是纯查询类，不能执行更新方法');
        }
    }
}
exports.default = JointDao;
