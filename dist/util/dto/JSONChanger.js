"use strict";
/**
 * 描述了一个json一个属性变成另外一个属性
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
class JSONChanger {
    constructor(opt) {
        this.arrayChanger = [];
        this._opt = opt;
        let arrayProcesser = opt.array;
        if (arrayProcesser) {
            if (arrayProcesser instanceof Array) {
                arrayProcesser = {
                    changes: arrayProcesser
                };
            }
            if (arrayProcesser.changes) {
                for (let prop of arrayProcesser.changes) {
                    this.arrayChanger.push(new JSONChanger(prop));
                }
            }
        }
    }
    getTargetKey() {
        let opt = this._opt;
        let targetKey = opt.target;
        if (targetKey == null)
            targetKey = opt.src;
        return targetKey;
    }
    changeTo(src, target) {
        if (src == null || target == null) {
            return;
        }
        let opt = this._opt;
        let vals = this.getVals(src);
        if ((vals == null || vals === '') && opt.defVal != null) {
            vals = opt.defVal;
        }
        if (opt.srcFun) {
            vals = opt.srcFun(vals, src);
        }
        let targetKey = this.getTargetKey();
        if (vals != null) {
            if (vals instanceof Array)
                JsonUtil_1.default.adds(target, targetKey.split('.'), vals);
            else
                JsonUtil_1.default.set(target, targetKey.split('.'), vals);
        }
    }
    getVals(srcObj) {
        let opt = this._opt;
        let obj = JsonUtil_1.default.get(srcObj, opt.src.split('.'));
        if (obj == null
            || !(obj instanceof Array)) {
            return obj;
        }
        let arrayProcesser = opt.array;
        if (arrayProcesser == null)
            arrayProcesser = {};
        let array = obj;
        let filter = arrayProcesser.filter;
        if (filter != null) {
            array = ArrayUtil_1.ArrayUtil.filter(array, function (row) {
                for (let e in filter) {
                    if (filter[e] != JsonUtil_1.default.get(row, e.split('.')))
                        return false;
                }
                return true;
            });
        }
        let vals = arrayProcesser.vals;
        let changes = this.arrayChanger;
        if (changes == null)
            changes = [];
        let list = [];
        for (let data of array) {
            let changeObj = {};
            if (changes != null && changes.length > 0) {
                for (let change of changes)
                    change.changeTo(data, changeObj);
            }
            else {
                changeObj = data;
            }
            if (vals != null) {
                for (let e in vals) {
                    JsonUtil_1.default.set(changeObj, e.split('.'), vals[e]);
                }
            }
            list.push(changeObj);
        }
        return list;
    }
    /**
     * 反转
     */
    reverse() {
        let opt = this._opt;
        let reverseOpt = {
            src: this.getTargetKey(),
            target: opt.src,
            defVal: opt.defVal,
            targetFun: opt.srcFun,
            srcFun: opt.targetFun,
            array: {}
        };
        let arrayProcesser = opt.array;
        if (arrayProcesser) {
            reverseOpt.array['vals'] = arrayProcesser.filter;
        }
        let changer = new JSONChanger(reverseOpt);
        changer.arrayChanger = this.reverseArrayChanger();
        return changer;
    }
    reverseArrayChanger() {
        let list = [];
        if (this.arrayChanger != null) {
            for (let changer of this.arrayChanger) {
                list.push(changer.reverse());
            }
        }
        return list;
    }
}
exports.default = JSONChanger;
const JsonUtil_1 = __importDefault(require("../JsonUtil"));
const ArrayUtil_1 = require("../ArrayUtil");
