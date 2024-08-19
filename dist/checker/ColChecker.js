"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseChecker_1 = __importDefault(require("./BaseChecker"));
class ColChecker extends BaseChecker_1.default {
    constructor() {
        super(...arguments);
        this._opt = null;
    }
    async _createError(param, col) {
        return new Error(this._createMsg(param[col], col));
    }
    _getCols() {
        let opt = this._opt;
        if (opt.cols != null) {
            return opt.cols;
        }
        if (opt.col != null)
            return [opt.col];
        return null;
    }
    async check(param) {
        let cols = this._getCols();
        if (cols != null) {
            for (let col of cols) {
                if (!(await this._check(param[col], col, param))) {
                    throw await this._createError(param, col);
                }
                ;
            }
        }
    }
}
exports.default = ColChecker;
