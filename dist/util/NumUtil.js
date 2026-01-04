"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayUtil_1 = require("./ArrayUtil");
const JsonUtil_1 = __importDefault(require("./JsonUtil"));
class default_1 {
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
        if (num == null)
            return false;
        return ((typeof num) == 'number') || (num instanceof Number);
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
