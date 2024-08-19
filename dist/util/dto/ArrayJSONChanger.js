"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONChanger_1 = __importDefault(require("./JSONChanger"));
class ArrayJSONChanger {
    constructor(array) {
        this.array = [];
        this.array = array;
    }
    change(obj) {
        let list = this.getArrayChanger();
        return this._build(list, obj);
    }
    _build(list, obj) {
        if (obj == null)
            return null;
        let array = this.array;
        if (array == null || array.length == 0)
            return obj;
        let retObj = {};
        for (let changer of list) {
            changer.changeTo(obj, retObj);
        }
        return retObj;
    }
    getArrayChanger() {
        return this.array.map(function (row) {
            return new JSONChanger_1.default(row);
        });
    }
    getReverseChanger() {
        let list = this.getArrayChanger();
        return list.map(row => row.reverse());
    }
    reverse(obj) {
        return this._build(this.getReverseChanger(), obj);
    }
}
exports.default = ArrayJSONChanger;
