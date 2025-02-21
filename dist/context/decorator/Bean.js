"use strict";
/**
 * 为属性指定bean
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function default_1(beanId) {
    return function (target, propertyName) {
        BeanConfig_1.default.addProperty(target, propertyName, beanId);
    };
}
const BeanConfig_1 = __importDefault(require("../bean/BeanConfig"));
