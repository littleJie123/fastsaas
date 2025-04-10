"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableBackUp = void 0;
const fastsaas_1 = require("../fastsaas");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
    async exportJson(lastResult) {
        let daoHelper = new fastsaas_1.DaoHelper({ context: this.context });
        let schCdt = this.getSchCdt(lastResult);
        let tableName = this.opt.tableName;
        return {
            list: await daoHelper.findBySchCdt(tableName, schCdt),
            schCdt,
            tableName
        };
    }
    getSchCdt(lastResult) {
        if (this.opt.builder != null) {
            return this.opt.builder(lastResult);
        }
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
/**
 * 数据备份
 */
class DataBakup {
    constructor(opt) {
        this.tableBackUps = [];
        this.opt = opt;
    }
    getSchCdt() {
        return this.opt.schCdt;
    }
    add(tableName, builder) {
        let tableBackUp = new TableBackUp({
            tableName,
            builder
        });
        this.addTableBackUp(tableBackUp);
    }
    addTableBackUp(tableBackUp) {
        tableBackUp.setDataBakup(this);
        tableBackUp.setContext(this.opt.context);
        this.tableBackUps.push(tableBackUp);
    }
    async backup() {
        let ret = [];
        let daoHelper = new fastsaas_1.DaoHelper({ context: this.opt.context });
        let fileName = this.opt.fileName;
        daoHelper.backupFile(fileName);
        let lastResult = null;
        for (let tableBackUp of this.tableBackUps) {
            lastResult = await tableBackUp.exportJson(lastResult);
            ret.push(lastResult);
        }
        if (!fs_1.default.existsSync(fileName)) {
            //写一段代码，如果上述目录不存在则创建目录
            let dir = path_1.default.dirname(fileName);
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdirSync(dir, { recursive: true });
            }
        }
        fs_1.default.writeFileSync(fileName, JSON.stringify(ret, null, 2));
    }
    async restore() {
        let daoHelper = new fastsaas_1.DaoHelper({ context: this.opt.context });
        let fileName = this.opt.fileName;
        let ret = JSON.parse(fs_1.default.readFileSync(fileName).toString());
        for (let item of ret) {
            await daoHelper.importJsonData(item.tableName, item);
        }
    }
}
exports.default = DataBakup;
