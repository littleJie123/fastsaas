"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../fastsaas");
const Control_1 = __importDefault(require("./Control"));
class default_1 extends Control_1.default {
    _sendResp(resp, ret) {
        if (ret == null) {
            super._sendResp(resp, null);
            return;
        }
        let buffer = ret;
        if (ret.toBuffer) {
            buffer = ret.toBuffer();
        }
        fastsaas_1.DownloadUtil.downloadExcel(resp, this.getFileName(), buffer);
    }
}
exports.default = default_1;
