"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SumFun_1 = __importDefault(require("./imp/SumFun"));
const MaxFun_1 = __importDefault(require("./imp/MaxFun"));
const MinFun_1 = __importDefault(require("./imp/MinFun"));
const AvgFun_1 = __importDefault(require("./imp/AvgFun"));
const CountFun_1 = __importDefault(require("./imp/CountFun"));
var map = {
    test: {
        fun: function (nums) {
            var val = nums[1];
            if (val == null)
                val = 1;
            return nums[0] * 2 + val;
        }
    },
    sum: new SumFun_1.default(),
    max: new MaxFun_1.default(),
    min: new MinFun_1.default(),
    avg: new AvgFun_1.default(),
    value_count: {},
    cardinality: {},
    count: new CountFun_1.default()
};
class Funs {
    static get(key) {
        let ret = map[key];
        if (ret != null && ret.clone) {
            ret = ret.clone();
        }
        return ret;
    }
    static isFun(key) {
        return Funs.get(key) != null;
    }
}
exports.default = Funs;
