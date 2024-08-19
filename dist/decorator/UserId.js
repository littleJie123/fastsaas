"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DaoUtil_1 = __importDefault(require("./../util/DaoUtil"));
function default_1(opt) {
    if (opt == null) {
        opt = { add_col: 'add_user', update_col: 'modify_user' };
    }
    return DaoUtil_1.default.createAddAndUpdate({
        addCol: opt.add_col,
        updateCol: opt.update_col,
        processFun: function (dao, data) {
            let context = dao.getContext();
            if (context != null) {
                let token = context.getData('token');
                if (token) {
                    return token.user_id;
                }
            }
        }
    });
}
exports.default = default_1;
