"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DateUtil_1 = require("./DateUtil");
class default_1 {
    static add(strDate, day) {
        if (day == 0) {
            return strDate;
        }
        let date = DateUtil_1.DateUtil.parse(strDate);
        if (day > 0) {
            date = DateUtil_1.DateUtil.afterDay(date, day);
        }
        if (day < 0) {
            date = DateUtil_1.DateUtil.beforeDay(date, day * -1);
        }
        return DateUtil_1.DateUtil.format(date);
    }
}
exports.default = default_1;
