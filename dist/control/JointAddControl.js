"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseOpControl_1 = __importDefault(require("./BaseOpControl"));
/**
 * 从别的表里面拉取数据
 */
class default_1 extends BaseOpControl_1.default {
    /**
     * 返回联合表的字段和
     * @returns
     */
    getJoints() {
        return null;
    }
    async getData() {
        let data = await super.getData();
        let joints = this.getJoints();
        if (joints != null) {
            for (let joint of joints) {
                await this.processJoint(joint, data);
            }
        }
        return data;
    }
    async processJoint(joint, data) {
        if (joint != null && data != null) {
            let dao = this._context.get(`${joint.table}Dao`);
            if (dao) {
                let pkCol = joint.pkCol;
                if (pkCol == null)
                    pkCol = `${joint.table}_id`;
                let row = await dao.getById(data[pkCol]);
                if (row != null) {
                    data[joint.col] = row[joint.col];
                }
            }
        }
    }
    async doExecute() {
        await this.getDao().add(await this.getData());
    }
}
exports.default = default_1;
