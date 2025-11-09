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
}
exports.StrUtil = StrUtil;
