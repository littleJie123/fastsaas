"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrUtil = void 0;
const JsonUtil_1 = __importDefault(require("./JsonUtil"));
const console_1 = require("console");
const lodash_1 = require("lodash");
const fp_1 = require("lodash/fp");
function createIteratee(converter, self) {
    return (result, value, key) => {
        (0, lodash_1.set)(result, converter(key), (0, fp_1.isObjectLike)(value) ? self(value) : value);
    };
}
function toCamelCase(str) {
    return str.replace(/_(\w)/g, function (m, $1) {
        return $1 ? $1.toUpperCase() : m;
    });
}
function createHumps(keyConverter) {
    return function humps(node) {
        if ((0, fp_1.isArray)(node))
            return (0, fp_1.map)(humps, node);
        if (Object.prototype.toString.call(node) === '[object Object]')
            return (0, lodash_1.transform)(node, createIteratee(keyConverter, humps));
        return node;
    };
}
/**
 * 字符串处理类
 */
class StrUtil {
    /**
     * 将一个下划线的字符串转成驼峰式
     * @param str
     */
    static changeUnderStringToCamel(str) {
        if (str == null) {
            return null;
        }
        let strArray = str.split('_');
        for (let i = 1; i < strArray.length; i++) {
            strArray[i] = this.firstUpper(strArray[i]);
        }
        return strArray.join('');
    }
    /**
     * 将一个对象的属性 从驼峰转下划线
     * @param obj
     */
    static camelToUnder(obj) {
        if (obj == null)
            return null;
        let fun = createHumps(fp_1.snakeCase);
        return fun(obj);
    }
    /**
     * 将一个对象的属性 从下划线到驼峰
     * @param obj
     */
    static underToCamel(obj) {
        if (obj == null)
            return null;
        let fun = createHumps(toCamelCase);
        return fun(obj);
    }
    /**
     * 首字母小写
     */
    static firstLower(str) {
        if (!str)
            return;
        str = str.toString();
        var ret = str.substring(0, 1).toLowerCase();
        ret = ret + str.substring(1);
        return ret;
    }
    static firstUpper(str) {
        if (!str)
            return;
        str = str.toString();
        var ret = str.substring(0, 1).toUpperCase();
        ret = ret + str.substring(1);
        return ret;
    }
    static pasical(name) {
        return StrUtil.firstLower(StrUtil.firstUpperPasical(name));
    }
    static firstUpperPasical(name) {
        var names = name.split('_');
        for (var i = 0; i < names.length; i++) {
            names[i] = StrUtil.firstUpper(names[i]);
        }
        return names.join('');
    }
    static removeExtName(str) {
        return str.substring(0, str.indexOf('.'));
    }
    static pad(num, n) {
        var len = num.toString().length;
        while (len < n) {
            num = '0' + num;
            len++;
        }
        return num;
    }
    // 不是string的情况也返回true
    static isEmpty(str) {
        return typeof str !== 'string' || str.length === 0;
    }
    /**
    替换字符串,会替换所有
    */
    static replace(str, substr, replacement) {
        var array = [];
        if (str != null &&
            substr != null) {
            if (replacement == null)
                replacement = '';
            var n = 0;
            while ((n = str.indexOf(substr)) != -1) {
                array.push(str.substring(0, n));
                array.push(replacement);
                str = str.substring(n + substr.length);
            }
            if (str != null) {
                array.push(str);
            }
        }
        return array.join('');
    }
    static start(str, prefix, noCase) {
        if (str == null || prefix == null)
            return false;
        if (noCase) {
            str = str.toLowerCase();
            prefix = prefix.toLowerCase();
        }
        if (str.length < prefix.length)
            return false;
        return str.substring(0, prefix.length) == prefix;
    }
    static startIngoreCase(str, prefix) {
        str = str.toLowerCase();
        prefix = prefix.toLowerCase();
        return StrUtil.start(str, prefix);
    }
    static end(str, suffix, noCase) {
        if (str == null || suffix == null)
            return false;
        if (noCase) {
            str = str.toLowerCase();
            suffix = suffix.toLowerCase();
        }
        if (str.length < suffix.length)
            return false;
        let ret = str.substring(str.length - suffix.length) == suffix;
        return ret;
    }
    static trim(str) {
        if (str == null)
            return null;
        function isWhite(c) {
            return c == ' '
                || c == '\r'
                || c == '\n'
                || c == '\t';
        }
        var i = 0;
        for (; i < str.length; i++) {
            if (!isWhite(str.charAt(i))) {
                break;
            }
        }
        str = str.substring(i);
        for (i = str.length - 1; i >= 0; i--) {
            if (!isWhite(str.charAt(i))) {
                break;
            }
        }
        return str.substring(0, i + 1);
    }
    static split(str, array) {
        if (!(array instanceof Array)) {
            array = [array];
        }
        var list;
        var strs;
        if (str instanceof Array) {
            strs = str;
        }
        else {
            strs = [str];
        }
        for (var key of array) {
            list = [];
            for (var s of strs) {
                list.push(...s.toString().split(key));
            }
            strs = list;
        }
        return list;
    }
    /**
     * 可以通过多个key进行split，防止类似全角的；和;都可以应用
     */
    static splitKeys(str, keys) {
        if (keys.length == 1) {
            return str.split(keys[0]);
        }
        let key = keys[0];
        for (let i = 1; i < keys.length; i++) {
            str = StrUtil.replace(str, keys[i], key);
        }
        return str.split(key);
    }
    /**
    判断是否字符串
    */
    static isStr(str) {
        if (str == null)
            return false;
        return ((typeof str) == 'string') || (str instanceof String);
    }
    static trimList(list) {
        if (list == null)
            return null;
        var array = [];
        for (var str of list) {
            array.push(this.trim(str));
        }
        return array;
    }
    /**
     *
     * @param strs
     * @param key
     */
    static join(strs, key) {
        if (key == null)
            key = '___';
        return strs.join(key);
    }
    /**
     * 根据keyword里面的数组，将一个字符串转成一个数组
     * 例如 aa+bb-cc 转成[{str:"aa",keyword:"+"},{str:"bb",keyword:"-"},{str:"cc"}]的数组
     *
     * @param str
     * @param keyword
     */
    static splitToArray(str, keyword) {
        let ret = [];
        if (!(keyword instanceof Array)) {
            keyword = [keyword];
        }
        let len = str.length;
        let i = 0;
        let begin = 0;
        while (i < len) {
            let hit = false;
            for (let key of keyword) {
                if (i + key.length <= len && str.substring(i, i + key.length) == key) {
                    hit = true;
                    ret.push({
                        keyword: key,
                        str: str.substring(begin, i)
                    });
                    begin = i = i + key.length;
                    break;
                }
            }
            if (!hit) {
                i++;
            }
        }
        if (begin < i) {
            ret.push({
                str: str.substring(begin, i)
            });
        }
        return ret;
    }
    /**
     * 格式化sql
     * @param sql
     * @param obj
     * @returns {sql:string,params:any[]}
     */
    static formatSql(sql, obj) {
        let params = [];
        if (sql == null || obj == null)
            return { sql, params };
        let start = 0;
        let begin = sql.indexOf('${');
        while (begin != -1) {
            let end = sql.indexOf('}', begin + 2);
            (0, console_1.assert)(end != -1);
            let key = sql.substring(begin + 2, end).trim();
            let val = JsonUtil_1.default.getByKeys(obj, key);
            if (val == null) {
                start = end + 1;
            }
            else {
                let str = null;
                if (val instanceof Array) {
                    if (val.length > 0) {
                        let valArray = new Array(val.length).fill('?');
                        str = valArray.join(',');
                        params.push(...val);
                    }
                    else {
                        str = sql.substring(begin, end + 1);
                    }
                }
                else {
                    str = '?';
                    params.push(val);
                }
                let beginStr = sql.substring(0, begin);
                let endStr = sql.substring(end + 1);
                start = beginStr.length + str.length;
                sql = `${beginStr}${str}${endStr}`;
            }
            begin = sql.indexOf('${', start);
        }
        return { sql, params };
    }
    /**
     * 格式化sql
     * @param strFormat
     * @param obj
     * @returns {sql:string,params:any[]}
     */
    static format(strFormat, obj) {
        if (strFormat == null || obj == null)
            return strFormat;
        let start = 0;
        let begin = strFormat.indexOf('${');
        while (begin != -1) {
            let end = strFormat.indexOf('}', begin + 2);
            (0, console_1.assert)(end != -1);
            let key = strFormat.substring(begin + 2, end).trim();
            let val = JsonUtil_1.default.getByKeys(obj, key);
            if (val == null) {
                start = end + 1;
            }
            else {
                let str = null;
                str = val.toString();
                let beginStr = strFormat.substring(0, begin);
                let endStr = strFormat.substring(end + 1);
                start = beginStr.length + str.length;
                strFormat = `${beginStr}${str}${endStr}`;
            }
            begin = strFormat.indexOf('${', start);
        }
        return strFormat;
    }
    /**
     * 从一段对象中挑选和一个字符串含有最相近名称的对象
     * 返回结果：
     * {
     *  score //相似度分数 越高表示匹配度越高
     *  data //array中的元素。
     * }
     * 返回之前按score倒叙排
     * 计算score的步骤
     * 1. 按word中字符的顺序匹配，每次匹配到1个 +1 分
     * 例如：字符串 “你好啊” 和 “你好啊” 完全匹配，score为3分
     * 字符串 “你好啊” 和 “你啊好”。 “你”和“好”匹配上，“啊” 没有匹配上，只能得到2分。
     * 字符串 “你好啊” 和 “我好啊”。也能得到2分。
     * 字符串 “你好啊” 和 “你坏啊”。也能得到2分。
     *
     * 2. data字符串中间每个没有匹配上的字符减去0.4分
      * 例如：字符串 “你好啊” 和 “你好啊” 完全匹配，score为3分
     * 字符串 “你好啊” 和 “你啊好”。 “你”和“好”匹配上，“啊” 没有匹配上，只能得到2分。同时减去0.4分
     * 字符串 “你好啊” 和 “我好啊”。也能得到2分。不用减分
     * 字符串 “你好啊” 和 “你坏啊”。得到2分，并减去0.4*2 分
     
    3.其他每个没有匹配上的字符减去0.1分
    * 例如：字符串 “你好啊” 和 “你好啊” 完全匹配，score为3分
     * 字符串 “你好啊” 和 “你啊好”。 “你”和“好”匹配上，“啊” 没有匹配上，只能得到2分。同时减去0.4分
     * 字符串 “你好啊” 和 “我好啊”。也能得到2分。并减去0.1*2分
     * 字符串 “你好啊” 和 “你坏啊”。得到2分，并减去0.4*2 分
     
    
     * @param word
     * @param array
     * @param opt{
     *
     *  col:string //指定比较的属性
     * }
     *
     */
    static compare(word, array, opt) {
        var _a;
        if (!word || !array || array.length === 0)
            return [];
        // 移除所有空格，使其不参与评分
        word = word.replace(/\s+/g, '');
        const col = (opt === null || opt === void 0 ? void 0 : opt.col) || 'name';
        let results = array.map(item => {
            let target = null;
            if (this.isStr(item)) {
                target = item;
            }
            else {
                target = item[col !== null && col !== void 0 ? col : 'name'];
            }
            if (target == null)
                target = '';
            target = target.toString();
            // 移除所有空格，使其不参与评分
            target = target.replace(/\s+/g, '');
            const score = this.calculateSimilarityScore(word, target);
            return { score, data: item };
        });
        let cnt = (_a = opt === null || opt === void 0 ? void 0 : opt.cnt) !== null && _a !== void 0 ? _a : 3;
        results = results.filter(row => row.score > 0);
        if (results.length > cnt) {
            results = results.slice(0, cnt);
        }
        return results.sort((a, b) => b.score - a.score);
    }
    static calculateSimilarityScore(word, target) {
        if (!word || !target)
            return 0;
        const n = word.length;
        const m = target.length;
        let hasMatch = false;
        // dp[i][j] 存储以匹配对 (word[i], target[j]) 结尾的匹配序列的最大得分
        const dp = Array.from({ length: n }, () => new Float64Array(m).fill(-Infinity));
        // M[i][j] 存储 i' <= i 且 j' <= j 的 dp[i'][j'] + 0.4 * (i' + j') 的最大值，用于加速中间间隙计算
        const M = Array.from({ length: n }, () => new Float64Array(m).fill(-Infinity));
        let maxFinalScore = 0;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                if (word[i] === target[j]) {
                    hasMatch = true;
                    const prevM = (i > 0 && j > 0) ? M[i - 1][j - 1] : -Infinity;
                    // 如果是序列中的第一个匹配：1 (匹配分) - 0.1 * i (word前缀) - 0.1 * j (target前缀)
                    const firstMatchScore = 1 - 0.1 * i - 0.1 * j;
                    // 如果接在之前的匹配后面：prevScore + 1 - 0.4 * (i - pi - 1) - 0.4 * (j - pj - 1)
                    // 变形为：(dp[pi][pj] + 0.4*pi + 0.4*pj) + 1.8 - 0.4*i - 0.4*j
                    const continueMatchScore = prevM + 1.8 - 0.4 * i - 0.4 * j;
                    dp[i][j] = Math.max(firstMatchScore, continueMatchScore);
                    // 计算最终得分（加上末尾未匹配字符的扣分 -0.1）
                    // Final = dp[i][j] - 0.1 * (n - 1 - i) - 0.1 * (m - 1 - j)
                    const finalScore = dp[i][j] - 0.1 * (n - 1 - i) - 0.1 * (m - 1 - j);
                    maxFinalScore = Math.max(maxFinalScore, finalScore);
                }
                // 更新 M 矩阵
                let currentM = dp[i][j] + 0.4 * i + 0.4 * j;
                if (i > 0)
                    currentM = Math.max(currentM, M[i - 1][j]);
                if (j > 0)
                    currentM = Math.max(currentM, M[i][j - 1]);
                M[i][j] = currentM;
            }
        }
        return hasMatch ? Math.max(0, maxFinalScore) : 0;
    }
    static createMatchFun(cols) {
        return function (obj) {
            let ret = [];
            for (let col of cols) {
                ret.push(StrUtil.getByCol(obj, col));
            }
            return ret.join('$____$');
        };
    }
    static getByCol(obj, col) {
        let ret = JsonUtil_1.default.getByKeys(obj, col.col);
        if (ret == null) {
            return '';
        }
        ret = ret.toString().toLowerCase();
        if (col.needFormat) {
            let changeCols = this.getNeedFormatChar();
            for (let changeCol of changeCols) {
                ret = ret.replaceAll(changeCol.src, changeCol.target);
            }
        }
        if (ret.indexOf('大蒜') != -1) {
            console.log(ret, '---------------');
        }
        return ret;
    }
    static getNeedFormatChar() {
        return [
            { src: '(', target: "（" },
            { src: ')', target: "）" }
        ];
    }
    /**
     * 对字符进行格式化处理
     *
     * */
    static createFormatFun(col) {
        return function (obj) {
            return StrUtil.getByCol(obj, { col, needFormat: true });
        };
    }
}
exports.StrUtil = StrUtil;
