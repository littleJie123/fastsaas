"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const fp_1 = require("lodash/fp");
function createIteratee(converter, self) {
    return (result, value, key) => {
        (0, lodash_1.set)(result, _isValidCol(key) ? converter(key) : key, (0, fp_1.isObjectLike)(value) ? self(value) : value);
    };
}
function _isValidCol(col) {
    if (col == 'pageNo' || col == 'pageSize' || col == 'orderBy') {
        return false;
    }
    return col.substring(0, 1) != '_';
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
exports.default = createHumps;
