"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const DaoUtil_1 = __importDefault(require("./../util/DaoUtil"));
function default_1(opt) {
    let needTimezone = null;
    if (opt == null) {
        opt = { addCol: 'sysAddTime', updateCol: 'sysModifyTime' };
    }
    else {
        needTimezone = opt.needTimezone;
    }
    return DaoUtil_1.default.createAddAndUpdate({
        addCol: opt.addCol,
        updateCol: opt.updateCol,
        processFun: function (dao) {
            return new Date();
        }
    });
}
