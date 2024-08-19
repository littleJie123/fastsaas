"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SqlTokenFac_1 = __importDefault(require("./sqlToken/SqlTokenFac"));
class default_1 {
    /**
     * 一个db的field为key，pojo属性为value的map
     * @param dbToPojoMap
     */
    constructor(dbToPojoMap, clazz) {
        this.clazz = clazz;
        this.dbToPojoMap = dbToPojoMap;
        ;
        let pojoToDbMap = {};
        for (let e in dbToPojoMap) {
            pojoToDbMap[dbToPojoMap[e]] = e;
        }
        this.pojoToDbMap = pojoToDbMap;
    }
    /**
     * 是否有效的key
     * @param col
     */
    isValid(col) {
        return this.pojoToDbMap[col] != null;
    }
    /**
     * 将db的字段转成pojo的字段
     * @param col
     * @returns
     */
    parseDbField(col) {
        let ret = this.dbToPojoMap[col];
        if (ret != null)
            return ret;
        return col;
    }
    /**
     * 将一个内存字段转成db中的字段
     * @param pojoField 内存中的字段
     */
    parsePojoField(pojoField) {
        let pojoToDbMap = this.pojoToDbMap;
        let dbField = pojoToDbMap[pojoField];
        if (dbField == null)
            return pojoField;
        return dbField;
    }
    /**
     * 将内存的字段数组转成db的字段
     * @param pojoFields 内存中的字段
     */
    parsePojoFieldsToDbFields(pojoFields) {
        let ret = [];
        let pojoToDbMap = this.pojoToDbMap;
        for (let field of pojoFields) {
            if (pojoToDbMap[field] != null) {
                ret.push(pojoToDbMap[field]);
            }
            else {
                ret.push(field);
            }
        }
        return ret;
    }
    /**
     * 把一个字段为pojo属性的sql ，转成数据库的sql
     */
    changeSql(sql) {
        let sqlTokens = this.scanTokens(sql);
        let sqls = sqlTokens.map(token => token.change(this.pojoToDbMap));
        return sqls.join('');
    }
    scanTokens(sql) {
        let i = 0;
        let token = null;
        let ret = [];
        while (i < sql.length) {
            let c = sql.charAt(i);
            if (token == null) {
                token = SqlTokenFac_1.default.hit(c);
                token.add(c);
                ret.push(token);
            }
            else {
                if (token.isEnd(c)) {
                    token = SqlTokenFac_1.default.hit(c);
                    ret.push(token);
                }
                token.add(c);
            }
            i++;
        }
        return ret;
    }
    /**
     * 把从db里面查询出来的对象转成内存
     */
    changeDb2Pojo(data) {
        if (data == null)
            return null;
        let ret = null;
        let clazz = this.clazz;
        if (clazz == null) {
            ret = {};
        }
        else {
            ret = new clazz();
        }
        let db2PojoMap = this.dbToPojoMap;
        for (let e in data) {
            if (db2PojoMap[e] != null) {
                ret[db2PojoMap[e]] = data[e];
            }
            else {
                ret[e] = data[e];
            }
        }
        return ret;
    }
    /**
     * 将一个数组的数据库对象转成内存的数组
     */
    changeDbArray2Pojo(array) {
        return array.map(row => this.changeDb2Pojo(row));
    }
}
exports.default = default_1;
