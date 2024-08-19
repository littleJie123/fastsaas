"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BeanUtil_1 = require("./BeanUtil");
const DateUtil_1 = require("./DateUtil");
function process(data, key, val) {
    if (val != null && val instanceof Date) {
        data[key] = DateUtil_1.DateUtil.formatDate(val);
    }
    if (val == null) {
        delete data[key];
    }
}
exports.default = BeanUtil_1.BeanUtil.eachFun(process);
