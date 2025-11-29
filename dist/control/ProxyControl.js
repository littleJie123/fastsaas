"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Control_1 = __importDefault(require("./Control"));
class default_1 extends Control_1.default {
    async doExecute(req, resp) {
        let control = this.getControl();
        let context = this._context;
        control.setContext(context);
        context.assembly([control]);
        let param = {
            ...this._param,
            _shareData: null
        };
        control._param = param;
        return await control.executeParam(param, req, resp);
    }
}
exports.default = default_1;
