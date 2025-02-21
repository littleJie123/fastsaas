"use strict";
/**
 * 在上下文注册builder
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function default_1(componentId, beanId, single) {
    if (beanId == null)
        beanId = '';
    let __needReg = 'multi';
    if (single) {
        __needReg = 'single';
    }
    return function classDecorator(constructor) {
        var _a;
        return _a = class extends constructor {
            },
            _a.beanId = beanId,
            _a.componentId = componentId,
            _a.__needReg = __needReg,
            _a;
    };
}
