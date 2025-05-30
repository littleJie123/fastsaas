"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Sql {
    constructor(sql, val) {
        this._sql = '';
        this._val = [];
        this._other = [];
        this.clazz = 'Sql';
        if (sql != null && sql != undefined)
            this._sql = sql;
        if (val != null && val != undefined) {
            if (val instanceof Array) {
                this._val.push(...val);
            }
            else {
                this._val.push(val);
            }
        }
    }
    getSql() {
        return this;
    }
    toSql() {
        let other = this._other.map((sql) => sql.toSql());
        let strs = [this._sql, other.join(' ')];
        return strs.join(' ');
    }
    toVal() {
        let ret = [];
        ret.push(...this._val);
        this._other.map(sql => {
            let val = sql.toVal();
            if (val)
                ret.push(...val);
        });
        return ret;
    }
    add(sql) {
        if (sql == null) {
            return this;
        }
        if (sql['clazz'] == 'Sql') {
            this._other.push(sql);
        }
        else {
            this._other.push(new Sql(sql));
        }
        return this;
    }
    /**
     * @description cols 格式化
     * @param cols
     */
    _colsToArray(cols) {
        cols = ( // 直接 return 无变化, 应该是引用传递的问题, 但是 why
        cols instanceof Array ? cols : cols.split(',')).map(val => val.trim()).filter(val => val);
        return cols;
    }
}
exports.default = Sql;
