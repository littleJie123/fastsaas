"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JointColChanger_1 = __importDefault(require("../colChanger/JointColChanger"));
const StrUtil_1 = require("../../util/StrUtil");
const DaoOpt_1 = __importDefault(require("./DaoOpt"));
/**
 * 联合查询的 DaoOpt
 * getTableName 返回 inner join sql
 * getColChanger 返回 JointColChanger
 */
class JointDaoOpt extends DaoOpt_1.default {
    constructor(opt) {
        if (opt == null) {
            opt = { daos: [] };
        }
        let param = { ...opt };
        let jointColChanger = new JointColChanger_1.default(param);
        super({
            colChanger: jointColChanger
        });
        this.param = param;
        this.daos = param.daos;
        this.jointColChanger = jointColChanger;
    }
    getDaos() {
        return this.daos;
    }
    /**
     * 返回 table1 inner join table2 on table2.table2_id=table1.table2_id
     */
    getTableName() {
        let daos = this.daos;
        if (daos == null || daos.length == 0) {
            return '';
        }
        let sqls = [daos[0].getTableName()];
        let joinedDaos = [daos[0]];
        for (let i = 1; i < daos.length; i++) {
            let newDao = daos[i];
            sqls.push(this.buildJoinSql(joinedDaos, newDao));
            joinedDaos.push(newDao);
        }
        return sqls.join(' ');
    }
    /**
     * 返回联合查询的字段转换器
     */
    getColChanger() {
        return this.jointColChanger;
    }
    clone() {
        return new JointDaoOpt({
            ...this.param
        });
    }
    removeColChange() {
        this.jointColChanger = null;
        return super.removeColChange();
    }
    /**
     * 按主键和已加入表的 dbFields 互相对上后，拼 inner join。
     * 被 join 的表配了 jointOpt 时，改用 table1Col、table2Col。
     * 参与这次 join 的表配了 valueOpt 时，追加到 on。
     * @param joinedDaos 已经在 sql 中的表
     * @param newDao 新加入的表
     */
    buildJoinSql(joinedDaos, newDao) {
        let onSql = this.buildJointOptSql(joinedDaos, newDao);
        if (onSql == null) {
            onSql = this.findJoinOn(joinedDaos, newDao);
        }
        let extras = [
            this.buildOtherSql(newDao.getTableName()),
            this.buildValueSql(joinedDaos, newDao)
        ];
        for (let extra of extras) {
            if (extra != null && extra !== '') {
                onSql = `${onSql} and ${extra}`;
            }
        }
        return `inner join ${newDao.getTableName()} on ${onSql}`;
    }
    /**
     * jointOpt 指定关联列。没有配置时返回 null，交给主键匹配。
     * other_item.other_item_id=stock_record.note_item_id
     */
    buildJointOptSql(joinedDaos, newDao) {
        let jointOpt = this.param == null ? null : this.param.jointOpt;
        let item = this.findByTableName(jointOpt, newDao.getTableName());
        if (item == null || item.table1Col == null || item.table1Col === '' || item.table2Col == null || item.table2Col === '') {
            return null;
        }
        let oldDao = joinedDaos[joinedDaos.length - 1];
        let table1Col = this.parseDaoField(oldDao, item.table1Col);
        let table2Col = this.parseDaoField(newDao, item.table2Col);
        return `${newDao.getTableName()}.${table2Col}=${oldDao.getTableName()}.${table1Col}`;
    }
    /**
     * 已加入的最后一张表和新表上的 valueOpt，拼成 表.列=值。
     */
    buildValueSql(joinedDaos, newDao) {
        let parts = [];
        this.appendValueSql(parts, joinedDaos[joinedDaos.length - 1]);
        this.appendValueSql(parts, newDao);
        if (parts.length == 0) {
            return null;
        }
        return parts.join(' and ');
    }
    appendValueSql(parts, dao) {
        if (dao == null) {
            return;
        }
        let valueOpt = this.param == null ? null : this.param.valueOpt;
        let item = this.findByTableName(valueOpt, dao.getTableName());
        if (item == null || item.col == null || item.col === '') {
            return;
        }
        let dbCol = this.parseDaoField(dao, item.col);
        parts.push(`${dao.getTableName()}.${dbCol}=${this.formatSqlValue(item.value)}`);
    }
    formatSqlValue(value) {
        if (value == null) {
            return 'null';
        }
        if (typeof value == 'number') {
            return String(value);
        }
        if (typeof value == 'boolean') {
            return value ? '1' : '0';
        }
        return `'${String(value).replace(/'/g, "''")}'`;
    }
    parseDaoField(dao, field) {
        let colChanger = dao.getColChanger();
        if (colChanger == null) {
            return field;
        }
        return colChanger.parsePojoField(field);
    }
    /**
     * 拼被 join 表上的附加条件。没有配置时返回 null。
     */
    buildOtherSql(tableName) {
        let item = this.findOtherSql(tableName);
        if (item == null) {
            return null;
        }
        let op = item.op;
        if (op == null || op === '') {
            op = '<>';
        }
        let table1Col = this.parseOtherCol(item.table1Col);
        let table2Col = this.parseOtherCol(item.table2Col);
        return `${table1Col}${op}${table2Col}`;
    }
    /**
     * 按表名取附加条件。key 可以是驼峰或下划线。
     */
    findOtherSql(tableName) {
        let otherSql = this.param == null ? null : this.param.otherSql;
        return this.findByTableName(otherSql, tableName);
    }
    /**
     * 按表名取配置。key 可以是驼峰或下划线。
     */
    findByTableName(map, tableName) {
        if (map == null || tableName == null) {
            return null;
        }
        if (map[tableName] != null) {
            return map[tableName];
        }
        for (let key in map) {
            if (this.isSameTableName(key, tableName)) {
                return map[key];
            }
        }
        return null;
    }
    /**
     * salesRecord.bomCode 转成 sales_record.bom_code。
     * 表名找到对应 dao，列名走该 dao 的 colChanger。
     */
    parseOtherCol(col) {
        if (col == null || col.indexOf('.') == -1) {
            return col;
        }
        let index = col.indexOf('.');
        let tableName = col.substring(0, index);
        let field = col.substring(index + 1);
        let dao = this.findDaoByTableName(tableName);
        if (dao == null) {
            return col;
        }
        let colChanger = dao.getColChanger();
        let dbField = field;
        if (colChanger != null) {
            dbField = colChanger.parsePojoField(field);
        }
        return `${dao.getTableName()}.${dbField}`;
    }
    findDaoByTableName(tableName) {
        let daos = this.daos;
        if (daos == null) {
            return null;
        }
        for (let dao of daos) {
            if (this.isSameTableName(tableName, dao.getTableName())) {
                return dao;
            }
        }
        return null;
    }
    isSameTableName(src, dest) {
        if (src == dest) {
            return true;
        }
        return StrUtil_1.StrUtil.changeUnderStringToCamel(src) == StrUtil_1.StrUtil.changeUnderStringToCamel(dest);
    }
    /**
     * 新表主键在老表中，或老表主键在新表中
     */
    findJoinOn(joinedDaos, newDao) {
        let onSql = this.matchNewPkInOld(joinedDaos, newDao);
        if (onSql != null) {
            return onSql;
        }
        onSql = this.matchOldPkInNew(joinedDaos, newDao);
        if (onSql != null) {
            return onSql;
        }
        throw new Error(`JointDao无法找到${newDao.getTableName()}的关联字段`);
    }
    /**
     * 新表主键出现在某张老表的 dbFields 中
     */
    matchNewPkInOld(joinedDaos, newDao) {
        let newPk = newDao.getIdCol();
        let newTable = newDao.getTableName();
        for (let oldDao of joinedDaos) {
            if (this.containsDbField(oldDao, newPk)) {
                return `${newTable}.${newPk}=${oldDao.getTableName()}.${newPk}`;
            }
        }
        return null;
    }
    /**
     * 某张老表主键出现在新表的 dbFields 中
     */
    matchOldPkInNew(joinedDaos, newDao) {
        let newTable = newDao.getTableName();
        for (let oldDao of joinedDaos) {
            let oldPk = oldDao.getIdCol();
            if (this.containsDbField(newDao, oldPk)) {
                return `${oldDao.getTableName()}.${oldPk}=${newTable}.${oldPk}`;
            }
        }
        return null;
    }
    containsDbField(dao, dbField) {
        let dbFields = this.getDbFields(dao);
        return dbFields.indexOf(dbField) != -1;
    }
    getDbFields(dao) {
        let colChanger = dao.getColChanger();
        if (colChanger == null) {
            return [];
        }
        return colChanger.parsePojoFieldsToDbFields(dao.getPojoCols());
    }
}
exports.default = JointDaoOpt;
