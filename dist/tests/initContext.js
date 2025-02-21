"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const path_1 = __importDefault(require("path"));
const FileContext_1 = __importDefault(require("../context/FileContext"));
const ConfigFac_1 = __importDefault(require("../config/ConfigFac"));
const OrmContext_1 = __importDefault(require("../context/OrmContext"));
const MysqlContext_1 = __importDefault(require("../context/MysqlContext"));
function init() {
    ConfigFac_1.default.init(path_1.default.join(__dirname, '../../tests/json'));
    var fileContext = new FileContext_1.default();
    fileContext.loadFromPath(path_1.default.join(__dirname, './biz'));
    OrmContext_1.default.regContext(fileContext);
    MysqlContext_1.default.regContext(fileContext);
    var context = fileContext.buildChild();
    return context;
}
function default_1() {
    return init();
}
