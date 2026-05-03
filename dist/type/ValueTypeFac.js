"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DateValueType_1 = __importDefault(require("./DateValueType"));
const NumValueType_1 = __importDefault(require("./NumValueType"));
const StrValueType_1 = __importDefault(require("./StrValueType"));
class ValueTypeFac {
    static isEq(obj1, obj2) {
        let types = this.getTypes();
        for (let i = 0; i < types.length; i++) {
            let v = types[i];
            if (v.isHit(obj1)) {
                return v.isEq(obj1, obj2);
            }
        }
        return obj1 == obj2;
    }
    static getTypes() {
        return [
            new NumValueType_1.default(),
            new StrValueType_1.default(),
            new DateValueType_1.default()
        ];
    }
}
exports.default = ValueTypeFac;
