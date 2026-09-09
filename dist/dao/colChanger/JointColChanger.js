"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ColChanger_1 = __importDefault(require("./ColChanger"));
const StrUtil_1 = require("../../util/StrUtil");
/**
 * 联合查询的字段转换器
 * 将 pojo 字段转成 tableName.dbField
 */
class JointColChanger extends ColChanger_1.default {
    constructor(opt) {
        super({});
        this.jointDaoOpt = opt;
    }
    /**
     * 将一个内存字段转成 db 字段，并带上所在表名
     * @param pojoField 内存中的字段
     */
    parsePojoField(pojoField) {
        var _a;
        let daos = (_a = this.jointDaoOpt) === null || _a === void 0 ? void 0 : _a.daos;
        if (daos == null) {
            return pojoField;
        }
        if (pojoField.indexOf('.') != -1) {
            return this.parseTablePojoField(daos, pojoField);
        }
        return this.parsePlainPojoField(daos, pojoField);
    }
    /**
     * 已带表名：从同名表的 dao 中查 pojoFields
     */
    parseTablePojoField(daos, pojoField) {
        let index = pojoField.indexOf('.');
        let tableName = pojoField.substring(0, index);
        let field = pojoField.substring(index + 1);
        let dao = this.findDaoByTableName(daos, tableName);
        if (dao == null) {
            return pojoField;
        }
        if (!this.hasPojoField(dao, field)) {
            return pojoField;
        }
        return this.toTableDbField(dao, field);
    }
    /**
     * 未带表名：按 daos 顺序命中第一个
     */
    parsePlainPojoField(daos, pojoField) {
        for (let dao of daos) {
            if (this.hasPojoField(dao, pojoField)) {
                return this.toTableDbField(dao, pojoField);
            }
        }
        return pojoField;
    }
    findDaoByTableName(daos, tableName) {
        for (let dao of daos) {
            if (this.isSameTableName(tableName, dao.getTableName())) {
                return dao;
            }
        }
        return null;
    }
    /**
     * 表名相同，兼容驼峰和下划线
     */
    isSameTableName(src, dest) {
        if (src == dest) {
            return true;
        }
        return StrUtil_1.StrUtil.changeUnderStringToCamel(src) == StrUtil_1.StrUtil.changeUnderStringToCamel(dest);
    }
    hasPojoField(dao, field) {
        return dao.getPojoCols().indexOf(field) != -1;
    }
    toTableDbField(dao, field) {
        let dbField = dao.getColChanger().parsePojoField(field);
        return `${dao.getTableName()}.${dbField}`;
    }
    /**
     * 查询结果转成内存对象
     * 无表名：遍历 daos 转字段名
     * 有表名：挂到对应表的嵌套对象上
     */
    changeDb2Pojo(data) {
        var _a;
        if (data == null) {
            return null;
        }
        let daos = (_a = this.jointDaoOpt) === null || _a === void 0 ? void 0 : _a.daos;
        if (daos == null) {
            return data;
        }
        let ret = {};
        for (let col in data) {
            this.putDbValue(ret, daos, col, data[col]);
        }
        return ret;
    }
    putDbValue(ret, daos, col, value) {
        if (col.indexOf('.') != -1) {
            this.putTableDbValue(ret, daos, col, value);
            return;
        }
        this.putPlainDbValue(ret, daos, col, value);
    }
    /**
     * inventory.inventory_day -> { inventory: { inventoryDay } }
     */
    putTableDbValue(ret, daos, col, value) {
        let index = col.indexOf('.');
        let tableName = col.substring(0, index);
        let dbField = col.substring(index + 1);
        let dao = this.findDaoByTableName(daos, tableName);
        let colChanger = dao === null || dao === void 0 ? void 0 : dao.getColChanger();
        if (dao == null || colChanger == null) {
            ret[col] = value;
            return;
        }
        let pojoField = colChanger.parseDbField(dbField);
        let nestKey = this.toPojoTableName(dao.getTableName());
        this.setNestValue(ret, nestKey, pojoField, value);
    }
    /**
     * 无表名：遍历 dao 的 dbFields 做字段名转化
     */
    putPlainDbValue(ret, daos, col, value) {
        for (let dao of daos) {
            if (this.hasDbField(dao, col)) {
                let pojoField = dao.getColChanger().parseDbField(col);
                ret[pojoField] = value;
                return;
            }
        }
        ret[col] = value;
    }
    setNestValue(ret, nestKey, field, value) {
        if (ret[nestKey] == null) {
            ret[nestKey] = {};
        }
        ret[nestKey][field] = value;
    }
    toPojoTableName(tableName) {
        return StrUtil_1.StrUtil.changeUnderStringToCamel(tableName);
    }
    hasDbField(dao, dbField) {
        return this.getDbFields(dao).indexOf(dbField) != -1;
    }
    getDbFields(dao) {
        let colChanger = dao.getColChanger();
        if (colChanger == null) {
            return [];
        }
        return colChanger.parsePojoFieldsToDbFields(dao.getPojoCols());
    }
}
exports.default = JointColChanger;
