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
    static getToday() {
        return DateUtil_1.DateUtil.format(new Date());
    }
    /**
     * 根据开始结束返回日期列表
     * @param begin
     * @param end
     * @returns
     */
    static getDays(begin, end) {
        let ret = [];
        while (begin <= end) {
            ret.push(begin);
            begin = this.add(begin, 1);
        }
        return ret;
    }
}
exports.default = default_1;
