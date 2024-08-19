"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = __importDefault(require("./../../../dao/query/Query"));
const JointWiget_1 = __importDefault(require("../JointWiget"));
class default_1 extends JointWiget_1.default {
    constructor() {
        super(...arguments);
        this.cdts = [];
    }
    async find() {
        let query = new Query_1.default();
        let opt = this.opt;
        if (this.cdts.length == 0) {
            return null;
        }
        let dao = this.context.get(`${opt.table}Dao`);
        for (let cdt of this.cdts) {
            query.addCdt(cdt);
        }
        // let list = await dao.find(query);
        let tableCol = this.opt.tableCol;
        if (tableCol == null)
            tableCol = this.opt.col;
        return dao.findCol(query, tableCol);
    }
    async addParam(key, value, cdtFun) {
        let cdt = await cdtFun();
        if (cdt != null) {
            this.cdts.push(cdt);
        }
    }
}
exports.default = default_1;
