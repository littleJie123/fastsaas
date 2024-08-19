"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BasePojo {
    constructor(data, context) {
        this._data = data;
        this.setContext(context);
    }
    setContext(context) {
        if (context != null)
            this._context = context;
    }
    getContext() {
        return this._context;
    }
    getData() {
        return this._data;
    }
}
exports.default = BasePojo;
