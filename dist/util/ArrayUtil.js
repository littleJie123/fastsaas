"use strict";
/*
 * @Author       : kaikai.hou
 * @Email        : kaikai.hou@downtown8.com
 * @Description  : Balabala
 * @Date         : 2020-02-10 16:11:59
 * @LastEditors  : kaikai.hou
 * @LastEditTime : 2020-02-11 19:33:16
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayUtil = void 0;
const JsonUtil_1 = __importDefault(require("./JsonUtil"));
const StrUtil_1 = require("./StrUtil");
/**
从一个元素中取值
也支持有function
*/
function get(obj, key) {
    if (key == null)
        return obj;
    if (key instanceof Function) {
        return key(obj);
    }
    var ret = [];
    if (key instanceof Array) {
        for (var k of key) {
            ret.push(JsonUtil_1.default.getByKeys(obj, k));
        }
        return ArrayUtil.link(ret);
    }
    else {
        return JsonUtil_1.default.getByKeys(obj, key);
    }
}
class ArrayUtil {
    /**
     * 类似字符串的indexOf
     * @param array1
     * @param arra2
     * @param fun
     */
    static indexOf(array1, array2, fun) {
        let ret = -1;
        for (let i = 0; i < array1.length; i++) {
            if (this.equalArray(array1, array2, i, fun)) {
                return i;
            }
        }
        return ret;
    }
    static equalArray(array1, array2, start, fun) {
        if (fun == null) {
            fun = (row1, row2) => row1 == row2;
        }
        if (start == null) {
            start = 0;
        }
        if (array2.length > array1.length - start) {
            return false;
        }
        for (let i = 0; i < array2.length; i++) {
            if (!fun(array2[i], array1[i + start])) {
                return false;
            }
        }
        return true;
    }
    static link(strs) {
        return strs.join('#___#');
    }
    /**
     * 是否有重复
     * @param array
     * @param key
     */
    static isDuplicate(array, key) {
        let map = {};
        for (let row of array) {
            let keyStr = get(row, key);
            if (map[keyStr] == null) {
                map[keyStr] = true;
            }
            else {
                return true;
            }
        }
        return false;
    }
    static keys(array) {
        return array.join('#___#');
    }
    /**
     * 求各个key不重复的数量
     * @param array
     * @param keys
     */
    static countObj(array, keys) {
        let keyMap = {};
        let ret = {};
        for (let key of keys) {
            ret[key] = 0;
            keyMap[key] = {};
        }
        for (let row of array) {
            for (let key of keys) {
                let value = row[key];
                if (value != null) {
                    if (keyMap[key][value] == null) {
                        keyMap[key][value] = true;
                        ret[key]++;
                    }
                }
            }
        }
        return ret;
    }
    /**
     * 得到一个object，这个object 含有所有的key值
     * @param array
     * @param keys
     */
    static sumObj(array, keys) {
        let ret = {};
        for (let row of array) {
            for (let key of keys) {
                if (ret[key] == null) {
                    ret[key] = row[key];
                }
                else {
                    if (row[key] != null)
                        ret[key] += row[key];
                }
            }
        }
        return ret;
    }
    static sum(array, key) {
        var ret = 0;
        if (!array)
            return 0;
        var len = array.length;
        for (var i = 0; i < len; i++) {
            var obj = array[i];
            if (key) {
                var val = get(obj, key);
                if (val != null) {
                    ret += val;
                }
            }
            else {
                ret += obj;
            }
        }
        return ret;
    }
    static distinctByKey(array, keys) {
        var map = ArrayUtil.toMapByKey(array, keys);
        var list = [];
        for (var e in map) {
            list.push(map[e]);
        }
        return list;
    }
    /**
     * 根据这个产生一个key
     * @param obj
     * @param keys
     */
    static get(obj, keys) {
        return get(obj, keys);
    }
    /**
     * 排序
     * @param array 排序数组
     * @param param string|{order:'name',desc:'desc'} 支持多级排序
     *
     *
     */
    static order(array, param) {
        let opts;
        if (!(param instanceof Array)) {
            if (StrUtil_1.StrUtil.isStr(param)) {
                opts = [{
                        order: param
                    }];
            }
            else {
                opts = [param];
            }
        }
        else {
            opts = param;
        }
        function sort(obj1, obj2) {
            function createFun(opt) {
                return function (obj1, obj2) {
                    var order = opt.order;
                    var desc = opt.desc;
                    var ret = 0;
                    let d1 = get(obj1, order);
                    let d2 = get(obj2, order);
                    if (d1 == null && d2 == null) {
                        ret = 0;
                    }
                    else if (d1 == null && d2 != null) {
                        ret = -1;
                    }
                    else if (d1 != null && d2 == null) {
                        ret = 1;
                    }
                    else {
                        if ((d1 instanceof Date)) {
                            d1 = d1.getTime();
                        }
                        if ((d2 instanceof Date)) {
                            d2 = d2.getTime();
                        }
                        if (d1 < d2) {
                            ret = -1;
                        }
                        else if (d1 > d2) {
                            ret = 1;
                        }
                    }
                    if (desc == 'desc') {
                        ret = ret * -1;
                    }
                    return ret;
                };
            }
            var funs = ArrayUtil.parse(opts, createFun);
            for (var i = 0; i < funs.length; i++) {
                var ret = funs[i](obj1, obj2);
                if (ret != 0 || i == funs.length - 1) {
                    return ret;
                }
            }
        }
        array.sort(sort);
        return array;
    }
    /**
     *
     * @param opt
     * @returns
     */
    static async groupBySync(opt) {
        if (opt == null) {
            return null;
        }
        if (opt.key == null) {
            throw new Error('opt不能为null');
        }
        var list = opt.list || opt.array;
        if (list == null) {
            return null;
        }
        var fun = opt.fun;
        if (fun == null) {
            fun = array => array;
        }
        var key = opt.key;
        if (key == null) {
            key = 'id';
        }
        var map = ArrayUtil.toMapArray(list, key);
        var ret = [];
        for (var e in map) {
            var row = await fun(map[e], e);
            if (row != null) {
                if (row instanceof Array) {
                    ret.push(...row);
                }
                else {
                    ret.push(row);
                }
            }
        }
        return ret;
    }
    /**
     对数组做group by操作
opt:{
    list:list, //数组
    key:key, //分组的key 支持多级
    fun:fun(list,e) // 处理函数
}
*/
    static groupBy(opt) {
        if (opt == null) {
            return null;
        }
        if (opt.key == null) {
            throw new Error('opt不能为null');
        }
        var list = opt.list || opt.array;
        if (list == null) {
            return null;
        }
        var fun = opt.fun;
        if (fun == null) {
            fun = array => array;
        }
        var key = opt.key;
        if (key == null) {
            key = 'id';
        }
        var map = ArrayUtil.toMapArray(list, key);
        var ret = [];
        for (var e in map) {
            var row = fun(map[e], e);
            if (row != null) {
                if (row instanceof Array) {
                    ret.push(...row);
                }
                else {
                    ret.push(row);
                }
            }
        }
        return ret;
    }
    /**
 * 将 通过比较key将两个数组按and的方式and
     
            array1:数组1
            array2:数组2
            key1
            key2
 */
    static andByKey(array1, array2, key1, key2) {
        if (key1 == null) {
            key1 = (row) => row;
        }
        if (key2 == null) {
            key2 = key1;
        }
        var map = ArrayUtil.toMapByKey(array1, key1);
        var retMap = {};
        var ret = [];
        for (var i = 0; i < array2.length; i++) {
            var item = array2[i];
            var keyValue = get(item, key2);
            if (map[keyValue]) {
                retMap[keyValue] = map[keyValue];
            }
        }
        for (var e in retMap) {
            ret.push(retMap[e]);
        }
        return ret;
    }
    static inArray(array, obj) {
        if (obj == null)
            return false;
        if (!Array.isArray(obj)) {
            var len = array.length;
            for (var i = 0; i < len; i++) {
                if (obj == array[i]) {
                    return true;
                }
            }
            return false;
        }
        else {
            obj = ArrayUtil.distinct(obj);
            var list = ArrayUtil.and(array, obj);
            return list.length == obj.length;
        }
    }
    static and(array1, array2) {
        var map = ArrayUtil.toMap(array1);
        var retMap = {};
        var ret = [];
        for (var i = 0; i < array2.length; i++) {
            var val = array2[i];
            if (map[val]) {
                retMap[val] = val;
            }
        }
        for (var e in retMap) {
            ret.push(retMap[e]);
        }
        return ret;
    }
    /**
     * 去除重复
     * @param array
     * @returns
     */
    static distinct(array) {
        if (array == null || array.length == 0)
            return array;
        var map = {};
        for (let row of array) {
            map[row] = row;
        }
        var ret = [];
        for (var e in map) {
            ret.push(map[e]);
        }
        return ret;
    }
    /**
建议使用
 * 根据key 转化为map
 * @param array
 * @param key
 */
    static toMapByKey(array, key, fun) {
        if (fun == null) {
            fun = (data) => {
                return data;
            };
        }
        let map = {};
        if (key == null) {
            key = (data) => data;
        }
        if (array) {
            const len = array.length;
            for (let i = 0; i < len; i++) {
                let data = array[i];
                let mapKey = get(data, key);
                if (mapKey != null) {
                    map[mapKey] = get(data, fun);
                }
            }
        }
        return map;
    }
    /**
 * @description 将一个list按key分组，放在map中
 */
    static toMapArray(list, key, fun) {
        var ret = {};
        if (list != null && key != null) {
            for (let i = 0; i < list.length; i++) {
                let data = list[i];
                let val = get(data, key);
                let mapData = get(data, fun);
                if (val != null && mapData != null) {
                    var array = ret[val];
                    if (array == null) {
                        array = [];
                        ret[val] = array;
                    }
                    array.push(mapData);
                }
            }
        }
        return ret;
    }
    static copy(destArray, srcArray, maxLen) {
        if (destArray == null)
            return [];
        if (srcArray == null)
            return destArray;
        var len = srcArray.length;
        if (maxLen != null && maxLen >= 0 && maxLen < len) {
            len = maxLen;
        }
        for (let i = 0; i < len; i++) {
            destArray.push(srcArray[i]);
        }
        return destArray;
    }
    static toMap(array) {
        let obj = {};
        if (array) {
            if (!(array instanceof Array)) {
                array = [array];
            }
            for (let i = 0; i < array.length; i++) {
                obj[array[i]] = true;
            }
        }
        return obj;
    }
    /**
     * 两个数组求not_in,根据key 来 进行
     * @param array1
     * @param array2
     * @param key
     * @param key2
     */
    static notInByKey(array1, array2, key, key2) {
        if (key == null) {
            return ArrayUtil.notIn(array1, array2);
        }
        if (key2 == null) {
            key2 = key;
        }
        var map = ArrayUtil.toMapByKey(array2, key2);
        var retMap = {};
        for (let i = 0; i < array1.length; i++) {
            var val = array1[i];
            var valKey = get(val, key);
            if (map[valKey] == null) {
                retMap[valKey] = val;
            }
        }
        var array = [];
        for (var e in retMap) {
            array.push(retMap[e]);
        }
        return array;
    }
    /**
     * 查找最大的
     * @param array
     * @param fun
     * @returns
     */
    static findMax(array, fun) {
        let ret = null;
        let val = null;
        for (let row of array) {
            if (ret == null) {
                ret = row;
                val = get(row, fun);
            }
            else {
                let rowVal = get(row, fun);
                if (rowVal > val) {
                    val = rowVal;
                    ret = row;
                }
            }
        }
        return ret;
    }
    /**
     * 查找最大的
     * @param array
     * @param fun
     * @returns
     */
    static findMin(array, fun) {
        let ret = null;
        let val = null;
        for (let row of array) {
            if (ret == null) {
                ret = row;
                val = get(row, fun);
            }
            else {
                let rowVal = get(row, fun);
                if (rowVal < val) {
                    val = rowVal;
                    ret = row;
                }
            }
        }
        return ret;
    }
    /**
    第二个参数可以是function、map、array
    */
    static filter(array, fun) {
        var ret = [];
        if (!(array instanceof Array)) {
            array = [array];
        }
        for (var i = 0; i < array.length; i++) {
            if (fun(array[i], i)) {
                ret.push(array[i]);
            }
        }
        return ret;
    }
    /**
     * 过滤出一个
     * @param array
     * @param fun
     */
    static filterOne(array, fun) {
        return ArrayUtil.filter(array, fun)[0];
    }
    /**
 * 找出在array1 不在array2的数据
 */
    static notIn(array1, array2) {
        var map = ArrayUtil.toMap(array2);
        var retMap = {};
        for (var i = 0; i < array1.length; i++) {
            var val = array1[i];
            if (map[val] == null) {
                retMap[val] = val;
            }
        }
        var ret = [];
        for (var e in retMap) {
            ret.push(retMap[e]);
        }
        return ret;
    }
    /**
     * 将一个数组转换成另外一个数组
     * 和系统的map 类似
     * 之处传入一个asyn 函数，支持函数返回值为数组，将每次运行返回的数组组合成一个数组
     * @param list
     * @param fun
     */
    static async map(list, fun) {
        var ret = [];
        for (var i = 0; i < list.length; i++) {
            var funRet = await fun(list[i], i);
            if (funRet != null) {
                if (funRet instanceof Array) {
                    ArrayUtil.addAll(ret, funRet);
                }
                else {
                    ret.push(funRet);
                }
            }
        }
        return ret;
    }
    static parse(array, fun) {
        if (!array)
            return [];
        if (!(array instanceof Array)) {
            array = [array];
        }
        return ArrayUtil._parseArray(array, fun);
    }
    /**
 * 根据fun转化array后返回
 * @param array
 * @param fun
 * @returns
 */
    static _parseArray(array, fun) {
        if (!array)
            return [];
        if (!fun) {
            return array;
        }
        var ret = [];
        for (let i = 0; i < array.length; i++) {
            var obj = fun(array[i], i);
            if (obj != null) {
                ret.push(obj);
            }
        }
        return ret;
    }
    static addAll(array1, array2) {
        if (array1 == null)
            array1 = [];
        if (array2 == null)
            return array1;
        if (!(array2 instanceof Array)) {
            array1.push(array2);
        }
        else {
            for (var i = 0; i < array2.length; i++) {
                array1.push(array2[i]);
            }
        }
        return array1;
    }
    static toArray(array, key) {
        if (array == null)
            return [];
        if (!(array instanceof Array))
            array = [array];
        if (!key)
            key = 'id';
        var ret = [];
        if (array) {
            for (let i = 0; i < array.length; i++) {
                var obj = get(array[i], key);
                if (obj != null) {
                    ret.push(obj);
                }
            }
        }
        return ret;
    }
    static isSame(array1, array2) {
        function _isSame(a, b) {
            var aProps = Object.getOwnPropertyNames(a);
            var bProps = Object.getOwnPropertyNames(b);
            if (aProps.length != bProps.length) {
                return false;
            }
            for (var i = 0; i < aProps.length; i++) {
                var propName = aProps[i];
                if (a[propName] !== b[propName]) {
                    return false;
                }
            }
            return true;
        }
        if (array1 == null || array2 == null) {
            return false;
        }
        if (array1.length != array2.length)
            return false;
        for (var i = 0; i < array1.length; i++) {
            if (!_isSame(array1[i], array2[i])) {
                return false;
            }
        }
        return true;
    }
    static orByKey(array1, array2, key1, key2) {
        if (key1 == null) {
            key1 = (row) => row;
        }
        if (key2 == null)
            key2 = key1;
        var map = ArrayUtil.toMapByKey(array1, key1);
        for (var i = 0; i < array2.length; i++) {
            var data = array2[i];
            var key = get(data, key2);
            if (map[key] == null) {
                map[key] = data;
            }
        }
        var array = [];
        for (var e in map) {
            array.push(map[e]);
        }
        return array;
    }
    /**
两个list进行join操作,
类似数据库中inner join
{
    list:[],
    list2:[],
    fun:function(data,data1){
        return data
    },
    key:function(){ //可以是function 也可以是key 在list中必须唯一

    },
    key2:function(){

    },
    onlyOne:function(data){ //只有第一个数组有的情况

    },
    onlyTwo:function(data){ //只存在2，不存在1

    }

}
*/
    static join(opt) {
        var list = opt.list;
        var list2 = opt.list2;
        if (list == null ||
            list2 == null) {
            return [];
        }
        var key = opt.key;
        var key2 = opt.key2;
        var fun = opt.fun;
        if (key == null) {
            key = 'id';
        }
        if (key2 == null) {
            key2 = key;
        }
        if (fun == null) {
            fun = function (data) {
                return data;
            };
        }
        var onlyOne = opt.onlyOne;
        var onlyTwo = opt.onlyTwo;
        var map = ArrayUtil.toMapByKey(list, key);
        var ret = [];
        for (var i = 0; i < list2.length; i++) {
            var data2 = list2[i];
            var keyValue = get(data2, key2);
            var data1 = map[keyValue];
            if (data1 != null) {
                let row = fun(data1, data2);
                if (row != null) {
                    ret.push(row);
                }
            }
            else {
                if (onlyTwo != null) {
                    let row = onlyTwo(data2);
                    if (row != null) {
                        ret.push(row);
                    }
                }
            }
        }
        if (onlyOne != null) {
            var map2 = ArrayUtil.toMapByKey(list2, key2);
            for (var i = 0; i < list.length; i++) {
                var data1 = list[i];
                var keyValue = get(data1, key);
                var data2 = map2[keyValue];
                if (data2 == null) {
                    let row = onlyOne(data1);
                    if (row != null) {
                        ret.push(row);
                    }
                }
            }
        }
        return ret;
    }
    /**
    两个list进行map操作,
    joinArray 方法和join类似，
    join 是一对一的关系，
    joinArray 是一对多的关系
    list2 是多条数据
    类似数据库中inner join
    {
        list:[],
        list2:[],
        fun:function(data,array){
            return data
        },
        key:function(){ //可以是function 也可以是key 在list中必须唯一

        },
        key2:function(){

        },
        onlyOne:function(data){ //只有第一个数组有的情况

        },
        onlyTwo:funtion(data){ //只存在2，不存在1

        }

    }
    */
    static joinArray(opt) {
        var list = opt.list;
        var list2 = opt.list2;
        if (list == null && list2 == null)
            return [];
        if (list == null) {
            list = [];
        }
        if (list2 == null)
            list2 = [];
        var key = opt.key;
        var key2 = opt.key2;
        var fun = opt.fun;
        if (key == null) {
            key = 'id';
        }
        if (key2 == null) {
            key2 = key;
        }
        if (fun == null) {
            fun = function (data) {
                return data;
            };
        }
        var map = ArrayUtil.toMapByKey(list, key);
        var map2 = ArrayUtil.toMapArray(list2, key2);
        var ret = [];
        for (var e in map) {
            let data = map[e];
            var array = map2[e];
            if (array != null) {
                var row = fun(data, array);
                ArrayUtil.addAll(ret, row);
            }
            else {
                if (opt.onlyOne) {
                    var row = opt.onlyOne(data);
                    ArrayUtil.addAll(ret, row);
                }
            }
        }
        if (opt.onlyTwo) {
            for (var e in map2) {
                if (map[e] == null) {
                    let row = opt.onlyTwo(map2[e]);
                    ArrayUtil.addAll(ret, row);
                }
            }
        }
        return ret;
    }
    /**
    两个list进行join操作,
    类似数据库中inner join
    和join不同是 两个数组都存在多个
    {
        list:[],
        list2:[],
        fun:function(array1,array2,key){
            return data
        },
        key:function(){ //可以是function 也可以是key 在list中必须唯一

        },
        key2:function(){

        },
        onlyOne:function(array,key){ //只有第一个数组有的情况

        },
        onlyTwo:funtion(data){ //只存在2，不存在1

        }

    }
    */
    static joinMany(opt) {
        var list = opt.list;
        var list2 = opt.list2;
        var onlyOne = opt.onlyOne;
        var onlyTwo = opt.onlyTwo;
        if (list == null ||
            list2 == null) {
            return [];
        }
        var key = opt.key;
        var key2 = opt.key2;
        var fun = opt.fun;
        if (key == null) {
            key = 'id';
        }
        if (key2 == null) {
            key2 = key;
        }
        if (fun == null) {
            fun = function (data) {
                return data;
            };
        }
        var map = ArrayUtil.toMapArray(list, key);
        var map2 = ArrayUtil.toMapArray(list2, key2);
        var ret = [];
        for (var e in map2) {
            var array2 = map2[e];
            var array = map[e];
            if (array != null) {
                ArrayUtil.addAll(ret, fun(array, array2));
            }
            else {
                if (onlyTwo)
                    ArrayUtil.addAll(ret, onlyTwo(array2));
            }
        }
        if (onlyOne != null) {
            for (var e in map) {
                var array = map[e];
                var array2 = map2[e];
                if (array2 == null) {
                    ArrayUtil.addAll(ret, onlyOne(array));
                }
            }
        }
        return ret;
    }
    /**
     * 根据字段取得某个值的数组 并去重
     * @param array
     * @param key
     */
    static toArrayDis(array, key) {
        if (array == null)
            return null;
        let set = new Set();
        for (let row of array) {
            let val = get(row, key);
            if (val != null)
                set.add(val);
        }
        return [...set];
    }
    /**
     * 将一个mapArray 转成map
     * @param map
     */
    static mapArray2Array(map) {
        let array = [];
        for (var e in map) {
            ArrayUtil.addAll(array, map[e]);
        }
        return array;
    }
    /**
     * 判断两个数组是否相等
     * @param array1
     * @param array2
     * @param key
     */
    static isSameByKey(array1, array2, key) {
        if (array1 == null && array2 == null)
            return true;
        if (array1 == null || array2 == null)
            return false;
        if (array1.length != array2.length)
            return false;
        for (let i = 0; i < array1.length; i++) {
            if (get(array1[i], key) != get(array2[i], key))
                return false;
        }
        return true;
    }
    /**
    将两个数组笛卡尔相乘，返回一个新数组
    新数组的长度 是两个数组的长度乘积
    新数组的内容是fun函数的执行结果，null不会保存到结果里面
    opt{
        list:[],
        list2:[],
        fun:function(data,data2 ,i,t) //i和t 是数组的索引
    }
    */
    static absJoin(opt) {
        var array = [];
        var list = opt.list;
        var list2 = opt.list2;
        if (opt.fun == null) {
            let keys = opt.keys;
            opt.fun = function (data1, data2) {
                let obj = {};
                obj[keys[0]] = data1[keys[0]];
                obj[keys[1]] = data2[keys[1]];
                return obj;
            };
        }
        for (var i = 0; i < list.length; i++) {
            for (var t = 0; t < list2.length; t++) {
                var row = opt.fun(list[i], list2[t], i, t);
                if (row != null) {
                    array.push(row);
                }
            }
        }
        return array;
    }
    /**
     * 只取key指定的值
     * @param list
     * @param key
     */
    static onlyKeys(list, key) {
        if (key == null)
            return null;
        if (!(key instanceof Array)) {
            key = [key];
        }
        let array = [];
        for (let data of list) {
            let obj = {};
            for (let dataKey of key) {
                obj[dataKey] = data[dataKey];
            }
            array.push(obj);
        }
        return array;
    }
    static sort(array, desc) {
        array.sort(function (o1, o2) {
            let ret = 0;
            if (o1.compare) {
                ret = o1.compare(o2);
            }
            else {
                if (o1.getSortValue && o2.getSortValue) {
                    ret = o1.getSortValue() - o2.getSortValue();
                }
            }
            if (desc) {
                ret = ret * (-1);
            }
            return ret;
        });
    }
}
exports.ArrayUtil = ArrayUtil;
