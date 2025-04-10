"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableBackUp = void 0;
class TableBackUp {
    setDataBakup(dataBakup) {
        this.dataBakup = dataBakup;
    }
    setContext(context) {
        this.context = context;
    }
    constructor(opt) {
        this.opt = opt;
    }
    getTableName() {
        return this.opt.tableName;
    }
    async exportJson() {
        let daoHelper = new DaoHelper({ context: this.context });
        let schCdt = this.getSchCdt();
        let tableName = this.opt.tableName;
        return {
            list: await daoHelper.findBySchCdt(tableName, schCdt),
            schCdt,
            tableName
        };
    }
    getSchCdt() {
        if (this.opt.schCdt) {
            return this.opt.schCdt;
        }
        else {
            let schCdt = this.dataBakup.getSchCdt();
            if (schCdt == null) {
                throw new Error(`${this.opt.tableName}没有设置schCdt`);
            }
            return schCdt;
        }
    }
}
exports.TableBackUp = TableBackUp;
