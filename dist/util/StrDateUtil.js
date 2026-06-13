"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../fastsaas");
const DateUtil_1 = require("./DateUtil");
class default_1 {
    static getYyMmDd(date) {
        let str = DateUtil_1.DateUtil.format(date);
        let strs = str.split('-');
        return [strs[0].substring(3), strs[1], strs[2]].join('');
    }
    static isToday(date) {
        if (date == null) {
            return false;
        }
        return DateUtil_1.DateUtil.todayStr() == date;
    }
    /**
     * 返回时间部分 类似'00:00:00'
     * @param date
     */
    static getTime(date) {
        let str = DateUtil_1.DateUtil.formatDate(date);
        return str.substring(11);
    }
    static between(colName, begin, end, opt) {
        let andCdt = new fastsaas_1.AndCdt();
        if (begin != null) {
            if (!(opt === null || opt === void 0 ? void 0 : opt.isTimeStamp)) {
                andCdt.bigEq(colName, begin);
            }
            else {
                andCdt.bigEq(colName, DateUtil_1.DateUtil.parse(begin).getTime());
            }
        }
        if (end != null) {
            let endStr = this.add(end, 1);
            if (!(opt === null || opt === void 0 ? void 0 : opt.isTimeStamp)) {
                andCdt.less(colName, endStr);
            }
            else {
                andCdt.less(colName, DateUtil_1.DateUtil.parse(endStr).getTime());
            }
        }
        return andCdt;
    }
    static beforeDay(days, today) {
        if (days == null) {
            days = 1;
        }
        if (today == null) {
            today = DateUtil_1.DateUtil.todayStr();
        }
        return this.add(today, days * -1);
    }
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
