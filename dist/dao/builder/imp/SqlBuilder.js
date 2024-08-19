"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sql_1 = __importDefault(require("../../sql/Sql"));
const Builder_1 = __importDefault(require("../Builder"));
class SqlBuilder extends Builder_1.default {
    _pushSqlTxt(sql, str, val) {
        if (str['clazz'] == 'Sql') {
            sql.add(str);
        }
        else {
            sql.add(new Sql_1.default(str, val));
        }
    }
    _isValidCol(col) {
        let colChanger = this._opt.getColChanger();
        if (!colChanger.isValid(col)) {
            return false;
        }
        return col.substring(0, 1) != '_';
    }
    _need(name) {
        let colChanger = this._opt.getColChanger();
        if (!colChanger.isValid(name)) {
            return false;
        }
        return (name.substring(0, 1) === '_') ? false : true;
    }
    _findCols(dataArray) {
        const map = {};
        for (let i = 0; i < dataArray.length; i++) {
            const data = dataArray[i];
            for (let e in data) {
                map[e] = true;
            }
        }
        // var map = dataArray[0];
        const array = [];
        for (let e in map) {
            if (this._need(e)) {
                array.push(e);
            }
        }
        return array;
    }
    /**
     * 把db的转成pojo的
     * @param field
     * @returns
     */
    parseDbField(field) {
        let colChanger = this._opt.getColChanger();
        if (colChanger == null) {
            return field;
        }
        return colChanger.parseDbField(field);
    }
    /**
     * 把pojo的转成db的
     * @param field
     * @returns
     */
    parsePojoField(field) {
        let colChanger = this._opt.getColChanger();
        if (colChanger == null) {
            return field;
        }
        return colChanger.parsePojoField(field);
    }
}
exports.default = SqlBuilder;
