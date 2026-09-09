"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JointColChanger_1 = __importDefault(require("../colChanger/JointColChanger"));
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
        let jointColChanger = new JointColChanger_1.default(opt);
        super({
            colChanger: jointColChanger
        });
        this.daos = opt.daos;
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
            daos: this.daos
        });
    }
    removeColChange() {
        this.jointColChanger = null;
        return super.removeColChange();
    }
    /**
     * 按主键和已加入表的 dbFields 互相对上后，拼 inner join
     * @param joinedDaos 已经在 sql 中的表
     * @param newDao 新加入的表
     */
    buildJoinSql(joinedDaos, newDao) {
        let onSql = this.findJoinOn(joinedDaos, newDao);
        return `inner join ${newDao.getTableName()} on ${onSql}`;
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
