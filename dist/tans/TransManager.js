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
class TransManager {
    constructor() {
        this._transNum = 0;
    }
    setContext(context) {
        this._context = context;
    }
    getTransNum() {
        return this._transNum;
    }
    /**
     * 开始事物
     */
    async beginTran() {
        let map = this._map;
        for (let trans of map.values()) {
            await trans.beginTran();
        }
        this._printLog('开始事务');
        this._transNum++;
    }
    /**
     *
     * 提交事务
     */
    async commitTran() {
        this._transNum--;
        let map = this._map;
        for (let trans of map.values()) {
            await trans.commitTran();
        }
        this._printLog('提交事务');
    }
    /**
     * 回滚
     */
    async rollbackTran() {
        this._transNum--;
        let map = this._map;
        for (let trans of map.values()) {
            await trans.rollbackTran();
        }
        this._printLog('回滚事务');
    }
    _printLog(msg) {
        let logger = this._context.getLogger();
        logger.debug(msg);
    }
}
exports.default = TransManager;
__decorate([
    (0, Bean_1.default)('DbTrans')
], TransManager.prototype, "_map", void 0);
