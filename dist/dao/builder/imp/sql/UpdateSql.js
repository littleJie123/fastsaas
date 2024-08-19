"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SqlBuilder_1 = __importDefault(require("../SqlBuilder"));
const BaseCdt_1 = __importDefault(require("../../../query/cdt/BaseCdt"));
const sql_1 = require("../../../sql");
class UpdateSql extends SqlBuilder_1.default {
    /**
    拼凑modify的sql
    */
    build(data, opts) {
        var array = new sql_1.Sql();
        this._buildFront(array, data);
        var cnt = 0;
        var dbIds = this._opt.acqIds();
        for (var dbId of dbIds) {
            if (cnt++ > 0) {
                this._pushSqlTxt(array, 'and');
            }
            this._pushSqlTxt(array, new sql_1.ColSql(dbId));
            this._pushSqlTxt(array, '=');
            this._pushSqlTxt(array, new sql_1.ValSql(data[this.parseDbField(dbId)]));
        }
        if (opts) {
            this._pushSqlTxt(array, 'and');
            let cdt = BaseCdt_1.default.parse(opts);
            this._pushSqlTxt(array, cdt.toSql(this._opt.getColChanger()));
        }
        return array;
    }
    /**
     * 构建where前面的sql
     * @param sql
     * @param data
     */
    _buildFront(sql, data) {
        var opt = this._opt;
        this._pushSqlTxt(sql, 'update ');
        this._pushSqlTxt(sql, opt.getTableName());
        this._pushSqlTxt(sql, ' set');
        var cnt = 0;
        let colChanger = this._opt.getColChanger();
        for (var pojoCol in data) {
            if (!opt.isId(pojoCol) && this._isValidCol(pojoCol)) {
                let v = data[pojoCol];
                if (cnt++ > 0) {
                    this._pushSqlTxt(sql, ',');
                }
                if (v != null && v.getSql) {
                    let valueSql = v.getSql(colChanger);
                    this._pushSqlTxt(sql, valueSql);
                }
                else {
                    this._pushSqlTxt(sql, new sql_1.ColSql(this.parsePojoField(pojoCol)));
                    this._pushSqlTxt(sql, '=');
                    this._pushSqlTxt(sql, new sql_1.ValSql(v));
                }
            }
        }
        this._pushSqlTxt(sql, 'where');
    }
}
exports.default = UpdateSql;
