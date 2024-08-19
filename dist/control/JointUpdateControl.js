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
    async doExecute() {
        let data = await this.getData();
        await this.getDao().update(data);
        let joints = this.getJoints();
        let myTable = this.getTableName();
        if (joints != null) {
            for (let joint of joints) {
                let dao = this._context.get(`${joint.table}Dao`);
                if (dao != null) {
                    let pk = joint.pkCol;
                    if (pk == null && myTable != null) {
                        pk = `${myTable}_id`;
                    }
                    if (pk != null) {
                        let col = joint.col;
                        if (data[col] != null) {
                            await dao.updateByCdt({
                                [pk]: data[pk]
                            }, {
                                [col]: data[col]
                            });
                        }
                    }
                }
            }
        }
    }
}
exports.default = default_1;
