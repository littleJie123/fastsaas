"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
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
