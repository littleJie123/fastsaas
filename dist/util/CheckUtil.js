"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JsonUtil_1 = __importDefault(require("./JsonUtil"));
const NumUtil_1 = __importDefault(require("./NumUtil"));
class default_1 {
    /**
     * 克隆一个列表
     * @param array
     * @param opt
     * @returns
     */
    static cloneList(array, opt) {
        if (array == null) {
            return null;
        }
        let retList = [];
        for (let row of array) {
            let ret = {};
            for (let e in row) {
                if (!e.startsWith('_')) {
                    ret[e] = row[e];
                }
            }
            let notCheckCols = opt === null || opt === void 0 ? void 0 : opt.notCheckCols;
            if (notCheckCols != null) {
                for (let col of notCheckCols) {
                    JsonUtil_1.default.delByKeys(ret, col);
                }
            }
            retList.push(ret);
        }
        return retList;
    }
    static expectEqualArray(array1, array2, opt) {
        let msg = opt === null || opt === void 0 ? void 0 : opt.msg;
        if (array1.length != array2.length) {
            throw new Error(msg !== null && msg !== void 0 ? msg : '两个数组的长度不等');
        }
        let notCheckCols = opt === null || opt === void 0 ? void 0 : opt.notCheckCols;
        if (notCheckCols != null) {
            array2 = this.cloneList(array2, opt);
        }
        this.expectFindByArray(array1, array2, msg);
    }
    static expectEqualObj(obj1, obj2, msg) {
        if (msg == null) {
            msg = `检查:期望是${JSON.stringify(obj2)},实际是${JSON.stringify(JsonUtil_1.default.inKey(obj1, obj2))}`;
        }
        if (!JsonUtil_1.default.isEqualObj(obj1, obj2)) {
            throw new Error(msg);
        }
    }
    static expectEqual(value1, value2, msg) {
        if (msg == null) {
            msg = `检查出错：期望是${value2}，实际是${value1}`;
        }
        if (NumUtil_1.default.isNum(value1) && NumUtil_1.default.isNum(value2)) {
            if (!NumUtil_1.default.isEq(value1, value2)) {
                throw new Error(msg);
            }
        }
        else {
            if (value1 != value2) {
                throw new Error(msg);
            }
        }
    }
    static expectFind(array, findObj, msg) {
        if (msg == null) {
            msg = `没找到${JSON.stringify(findObj)}的数据`;
        }
        let find = false;
        for (let row of array) {
            if (JsonUtil_1.default.isEqualObj(row, findObj)) {
                find = true;
                break;
            }
        }
        if (!find) {
            throw new Error(msg);
        }
    }
    static expectFindByArray(array, findObjs, msg) {
        for (let findObj of findObjs) {
            this.expectFind(array, findObj);
        }
    }
    static expectNotFind(array, findObj, msg) {
        if (msg == null) {
            msg = `找到了${JSON.stringify(findObj)}的数据，本来觉得应该找不到`;
        }
        let row = array.find(function (obj) {
            for (let e in findObj) {
                let val = JsonUtil_1.default.getByKeys(obj, e);
                if (val != findObj[e]) {
                    return false;
                }
            }
            return true;
        });
        if (row != null) {
            throw new Error(msg);
        }
    }
    static expectNotNull(val, msg) {
        if (msg == null) {
            msg = '不能为空的值变成空了';
        }
        if (val == null) {
            throw new Error(msg);
        }
    }
}
exports.default = default_1;
