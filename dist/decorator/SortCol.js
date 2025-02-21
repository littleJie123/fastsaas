"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const DaoUtil_1 = __importDefault(require("./../util/DaoUtil"));
const DefOnChangeOpt_1 = __importDefault(require("../util/inf/imp/DefOnChangeOpt"));
function default_1(opt) {
    if (opt == null) {
        opt = { sort: 1 };
    }
    return DaoUtil_1.default.createOnChangeDecorator(new DefOnChangeOpt_1.default({
        async onAdd(dao, data) {
            if (data && data.sort == null) {
                data.sort = new Date().getTime() * opt.sort;
            }
        },
        async onAddArray(dao, array) {
            if (array) {
                let time = new Date().getTime();
                for (let i = 0; i < array.length; i++) {
                    if (array[i]['sort'] == null)
                        array[i]['sort'] = (time + i) * opt.sort;
                }
            }
        }
    }));
}
