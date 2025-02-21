"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Column;
/**
 * 构造db字段和内存属性的映射关系
 * @param typeOrOptions
 * @returns
 */
function Column(typeOrOptions) {
    return function (object, propertyName) {
        if (!object.__dbToPojoMap) {
            object.__dbToPojoMap = {};
        }
        object.__dbToPojoMap[typeOrOptions.name] = propertyName;
    };
}
