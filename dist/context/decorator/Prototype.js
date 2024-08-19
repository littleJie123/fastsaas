"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(opt) {
    return function classDecorator(constructor) {
        if (opt != null) {
            for (let e in opt) {
                constructor.prototype[e] = opt[e];
            }
        }
        return constructor;
    };
}
exports.default = default_1;
