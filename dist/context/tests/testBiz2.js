"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const FileContext_1 = __importDefault(require("../FileContext"));
var context = new FileContext_1.default();
context.loadFromPath(path_1.default.join(__dirname, './biz2'));
let childContext = context.buildChild();
function run() {
    let test1 = childContext.get('test1');
    console.log(test1.test1());
}
run();
