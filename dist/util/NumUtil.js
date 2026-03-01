"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayUtil_1 = require("./ArrayUtil");
const JsonUtil_1 = __importDefault(require("./JsonUtil"));
class default_1 {
    /**
     * 将一个数平均分配到多个对象中
     * @param sumValue
     * @param cnt
     * @param avgOpt
     */
    static avg(sumValue, cnt, avgOpt) {
        let result = [];
        if (cnt <= 0) {
            return result;
        }
        let realSum = sumValue;
        if (avgOpt === null || avgOpt === void 0 ? void 0 : avgOpt.fee) {
            realSum = Math.round(sumValue * avgOpt.fee);
        }
        let avg = Math.floor(realSum / cnt);
        let remain = realSum - avg * cnt;
        for (let i = 0; i < cnt; i++) {
            let val = avg;
            if (i < remain) {
                val = val + 1;
            }
            if (avgOpt === null || avgOpt === void 0 ? void 0 : avgOpt.fee) {
                val = val / avgOpt.fee;
            }
            result.push(val);
        }
        return result;
    }
    /**
     * 把类似“￥54.90”，“$10”,"10.01"等字符串转化成数字，上述返回分别是54.9， 10，10.01
     * @param str
     */
    static getNum(str) {
        if (str == null)
            return 0;
        // 去掉逗号
        str = str.replace(/,/g, '');
        let reg = /((-)?\d+(\.\d+)?)/;
        let match = reg.exec(str);
        if (match) {
            return parseFloat(match[0]);
        }
        return 0;
    }
    /**
     * 获取数字和单位，例如“23瓶500ml”变成[{num:23,unit:'瓶'},{num:500,unit:'ml'}]
     * @param str
     */
    static getNumAndUnit(str) {
        if (str == null || str == '')
            return [];
        // 去除掉字符串中的空格
        str = str.replace(/\s+/g, '');
        let list = [];
        // 匹配数字(包含小数)和非数字部分
        let reg = /(\d+(\.\d+)?)([^\d\.]*)/g;
        let r;
        while (r = reg.exec(str)) {
            list.push({
                cnt: parseFloat(r[1]),
                name: r[3]
            });
        }
        return list;
    }
    /**
     * 分别负担。例如多个账户负担一笔支出。
     * 如果账户的余额总和小于支出，则支出全部余额。
     * 如果总和大于支出，则按比例分配。剩余的再依次扣减
     * @param cost 支出
     * @param shareCosts 账户余额
     * @param opt
     */
    static shareCost(cost, shareCosts, opt) {
        let sum = ArrayUtil_1.ArrayUtil.sum(shareCosts);
        if (sum <= cost) {
            return [...shareCosts];
        }
        let realCost = cost;
        if (opt === null || opt === void 0 ? void 0 : opt.fee) {
            realCost = Math.round(cost * opt.fee);
        }
        let result = [];
        let currentSum = 0;
        // First pass: proportional distribution
        for (let shareCost of shareCosts) {
            let val = 0;
            if (sum > 0) {
                val = Math.floor((shareCost / sum) * realCost);
            }
            result.push(val);
            currentSum += val;
        }
        // Second pass: distribute remainder
        let diff = realCost - currentSum;
        let index = 0;
        while (diff > 0 && index < result.length) { // Verify index constraint just in case
            result[index]++;
            diff--;
            index++;
            if (index >= result.length) {
                index = 0;
            }
        }
        // Handle fee scaling back
        if (opt === null || opt === void 0 ? void 0 : opt.fee) {
            for (let i = 0; i < result.length; i++) {
                result[i] = result[i] / opt.fee;
            }
        }
        return result;
    }
    /**
     * 把一个大的，按比例分配给小的。类似10个苹果 ，5个人分。如果每个人需要的量加起来小于10个，则按需求量分配。如果大于，则按比例进行分配。
     * 如果需要分配的值大于被分配对象的值，那么需要分配的值将按比例缩小，直到等于被分配对象的值
     * @param numObj 被分配的值
     * @param assignNumObjs 需要分配的值
     
     */
    static assign(numObj, assignNumObjs, opt) {
        var _a, _b, _c, _d;
        let { col, assignNumObjCol } = opt;
        let value = (_a = JsonUtil_1.default.getByKeys(numObj, col)) !== null && _a !== void 0 ? _a : 0;
        if (assignNumObjCol == null) {
            assignNumObjCol = col;
        }
        let valueCol = (_b = opt.valueCol) !== null && _b !== void 0 ? _b : assignNumObjCol;
        let sumAssignValue = ArrayUtil_1.ArrayUtil.sum(assignNumObjs, valueCol);
        if (opt.ifBigNoAssign && value >= sumAssignValue) {
            if (valueCol == assignNumObjCol) {
                return;
            }
            else {
                for (let assignNumObj of assignNumObjs) {
                    let value = JsonUtil_1.default.getByKeys(assignNumObj, valueCol);
                    JsonUtil_1.default.setByKeys(assignNumObj, assignNumObjCol, value);
                }
            }
        }
        if (value == 0) {
            for (let assignNumObj of assignNumObjs) {
                JsonUtil_1.default.setByKeys(assignNumObj, assignNumObjCol, 0);
            }
            return;
        }
        if (opt.fee) {
            value *= opt.fee;
        }
        for (let assignNumObj of assignNumObjs) {
            let assignValue = (_c = JsonUtil_1.default.getByKeys(assignNumObj, valueCol)) !== null && _c !== void 0 ? _c : 0;
            JsonUtil_1.default.setByKeys(assignNumObj, assignNumObjCol, Math.floor((assignValue / sumAssignValue) * value));
        }
        sumAssignValue = ArrayUtil_1.ArrayUtil.sum(assignNumObjs, assignNumObjCol);
        if (sumAssignValue < value) {
            let diff = value - sumAssignValue;
            let index = 0;
            while (diff > 0) {
                let val = (_d = JsonUtil_1.default.getByKeys(assignNumObjs[index], assignNumObjCol)) !== null && _d !== void 0 ? _d : 0;
                JsonUtil_1.default.setByKeys(assignNumObjs[index], assignNumObjCol, val + 1);
                diff--;
                index++;
                if (index >= assignNumObjs.length) {
                    index = 0;
                }
            }
        }
        if (opt.fee) {
            for (let assignNumObj of assignNumObjs) {
                let val = JsonUtil_1.default.getByKeys(assignNumObj, assignNumObjCol);
                JsonUtil_1.default.setByKeys(assignNumObj, assignNumObjCol, val / opt.fee);
            }
        }
    }
    /**
     * 能否整除
     * @param num1
     * @param num2
     * @returns
     */
    static isDivisible(num1, num2) {
        if (num1 == null || num2 == null) {
            return false;
        }
        if (num2 == 0) {
            return false;
        }
        return Math.floor(num1 * 10000) % num2 == 0;
    }
    /**
     * 计算两个数的最大公约数
     * @param a 第一个数
     * @param b 第二个数
     * @returns 最大公约数
     */
    static gcd(a, b) {
        // 使用辗转相除法
        if (a == null || isNaN(a)) {
            a = 1;
        }
        if (b == null || isNaN(b)) {
            b = 1;
        }
        a = Math.abs(a);
        b = Math.abs(b);
        while (b !== 0) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
    /**
     * 计算两个数的最小公倍数
     * @param a 第一个数
     * @param b 第二个数
     * @returns 最小公倍数
     */
    static lcm(a, b) {
        // 最小公倍数 = 两数之积 / 最大公约数
        return Math.abs(a * b) / this.gcd(a, b);
    }
    static add(...nums) {
        let cnt = 0;
        if (nums) {
            for (let num of nums) {
                if (num != null) {
                    cnt += num;
                }
            }
        }
        return cnt;
    }
    static isEq(num1, num2) {
        return Math.abs(num1 - num2) < 0.000001;
    }
    /**
     * 保留几位小数,默认2位
     * @param num
     * @param n
     * @returns
     */
    static toNum(num, n) {
        if (num == null)
            return 0;
        let x = 1;
        if (n == null)
            n = 2;
        for (let i = 0; i < n; i++) {
            x = x * 10;
        }
        num = num * x;
        let ret = Math.floor(num);
        if (Math.abs((num - (ret + 1))) < 0.01) {
            ret = ret + 1;
        }
        return ret / x;
    }
    static format(num, len) {
        let strNum = num.toString();
        if (strNum.length > len) {
            return strNum.substring(0, len);
        }
        if (strNum.length < len) {
            let array = [];
            let lenOfStr = strNum.length;
            for (let i = 0; i < len - lenOfStr; i++) {
                array.push('0');
            }
            array.push(strNum);
            return array.join('');
        }
        return strNum;
    }
    /**
     * 判断是否数字
     * @param num
     */
    static isNum(num) {
        if (num == null) {
            return false;
        }
        return ((typeof num) == 'number') || (num instanceof Number);
    }
    /**
     * 判断是不是数字，包括可以转化成数字的字符串
     */
    static isNumber(num) {
        if (num == null || num == '') {
            return false;
        }
        if (((typeof num) == 'number') || (num instanceof Number)) {
            return true;
        }
        return !isNaN(num);
    }
    /**
     * 是否含有小数
     * @param num
     */
    static isDecimal(num) {
        if (num == null) {
            return false;
        }
        return Math.floor(num) != num;
    }
}
exports.default = default_1;
