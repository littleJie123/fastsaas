"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AddArraySql_1 = __importDefault(require("./AddArraySql"));
/**
 * 执行importSql的sql 构建
 */
class ImportArraySql extends AddArraySql_1.default {
    /**
     * 是否需要这个字段, 因为导入的时候需要导入主键
     * @param name
     * @returns
     */
    _need(name) {
        let colChanger = this._opt.getColChanger();
        if (!colChanger.isValid(name)) {
            return false;
        }
        return (name.substring(0, 1) === '_') ? false : true;
    }
}
exports.default = ImportArraySql;
