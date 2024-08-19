"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseDomain {
    setContext(context) {
        this._context = context;
    }
    getContext() {
        return this._context;
    }
}
exports.default = BaseDomain;
