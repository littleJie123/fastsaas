"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const ConfigFac_1 = __importDefault(require("../../config/ConfigFac"));
const DateUtil_1 = require("../../util/DateUtil");
const StrUtil_1 = require("../../util/StrUtil");
function default_1() {
    let base = ConfigFac_1.default.get('base');
    let version = base.version;
    if (version == null) {
        let now = DateUtil_1.DateUtil.format(new Date());
        version = StrUtil_1.StrUtil.replace(now, '-', '.');
    }
    return function (req, resp) {
        resp.send({
            version
        });
    };
}
