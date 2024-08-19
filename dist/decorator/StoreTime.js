"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DaoUtil_1 = __importDefault(require("./../util/DaoUtil"));
function default_1(opt) {
    if (opt == null) {
        opt = { addCol: 'add_time' };
    }
    return DaoUtil_1.default.createAddAndUpdate({
        addCol: opt.addCol,
        updateCol: opt.updateCol,
        processFun: function (dao, data) {
            let context = dao.getContext();
            if (context != null) {
                let timezoneServer = context.get('timezoneServer');
                if (timezoneServer) {
                    return timezoneServer.getDate();
                }
            }
        }
    });
}
exports.default = default_1;
