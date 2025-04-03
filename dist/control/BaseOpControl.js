"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bean_1 = __importDefault(require("./../context/decorator/Bean"));
const Control_1 = __importDefault(require("./Control"));
const RepeatChecker_1 = __importDefault(require("../checker/RepeatChecker"));
const fastsaas_1 = require("../fastsaas");
/**
 * 基本操作的对象
 */
class default_1 extends Control_1.default {
    getBaseDataCdt() {
        return this.dataCdt;
    }
    getNameCol() {
        return 'name';
    }
    getCheckNameMsg() {
        return '名称不能重复';
    }
    /**
     * 返回查询负责的dao
     */
    getDao() {
        let tableName = this.getTableName();
        if (tableName == null)
            throw new Error('必须冲载getTableName');
        let context = this.getContext();
        return context.get(tableName + 'dao');
    }
    ;
    getPkCol() {
        let ret = this.getTableName() + 'Id';
        ret = fastsaas_1.StrUtil.changeUnderStringToCamel(ret);
        ret = fastsaas_1.StrUtil.firstLower(ret);
        return ret;
    }
    async getPkData() {
        let pk = this.getPkCol();
        return {
            [pk]: this._param[pk]
        };
    }
    needCheckName() {
        return true;
    }
    /**
     * 创建单一检查的checker
     * @param col
     * @param msg
     * @returns
     */
    buildRepeatChecker(col, msg, otherCdt) {
        if (otherCdt == null) {
            otherCdt = this.getOtherCdt();
        }
        if (msg == null)
            msg = `${col}不能重复。`;
        return new RepeatChecker_1.default({
            col,
            code: msg,
            otherCdt,
            key: this.getTableName(),
            context: this.getContext()
        });
    }
    getCheckers() {
        let array = [];
        if (this.needCheckName()) {
            array.push(new RepeatChecker_1.default({
                col: this.getNameCol(),
                code: this.getCheckNameMsg(),
                otherCdt: this.getOtherCdt(),
                key: this.getTableName(),
                context: this.getContext()
            }));
        }
        return array;
    }
    getOtherCdt() {
        let dataCdt = this.getBaseDataCdt();
        if (dataCdt == null) {
            return {};
        }
        let ret = dataCdt.getOtherCdt();
        return ret;
    }
    async getData() {
        return {
            ...this._param
        };
    }
    getDataCdt() {
        let dataCdt = this.getBaseDataCdt();
        if (dataCdt != null) {
            return dataCdt.get();
        }
        return null;
    }
}
exports.default = default_1;
__decorate([
    (0, Bean_1.default)()
], default_1.prototype, "dataCdt", void 0);
