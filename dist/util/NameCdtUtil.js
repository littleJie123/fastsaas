"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = __importDefault(require("../dao/query/Query"));
const imp_1 = require("../dao/query/cdt/imp");
class default_1 {
    /**
     * 根据名称到一个辅助表里面查询name，返回到主表做in的查询
     * @param context
     * @param key 必须是 `${tablename}_name`形式
     * @param value
     */
    static async build(opt) {
        let key = opt.key;
        let context = opt.context;
        let tableName = key.substring(0, key.length - 5);
        let dao = context.get(tableName + 'Dao');
        let idCol = tableName + "_id";
        if (opt.idCol != null)
            idCol = opt.idCol;
        let otherCdt = opt.otherCdt;
        if (otherCdt == null)
            otherCdt = {};
        let query = Query_1.default.parse(otherCdt);
        let op = opt.op;
        let colName = opt.colName;
        if (colName == null)
            colName = opt.key;
        if (op == null) {
            op = 'like';
        }
        if (op == 'like') {
            query.addCdt(new imp_1.Cdt(colName, `%${opt.value}%`, op));
        }
        else {
            query.addCdt(new imp_1.Cdt(colName, opt.value, op));
        }
        let list = await dao.findCol(query, idCol);
        return new imp_1.Cdt(idCol, list);
    }
}
exports.default = default_1;
