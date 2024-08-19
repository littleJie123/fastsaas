"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Hat_1 = __importDefault(require("../hat/imp/Hat"));
const initContext_1 = __importDefault(require("./initContext"));
var context = (0, initContext_1.default)();
var list = [
    {
        tmaterial_id: 3050
    },
    { tmaterial_id: 3051 },
    { tmaterial_id: 3052 },
];
async function doRun(fun) {
    var hat = new Hat_1.default({
        context,
        fun,
        key: 'tmaterial'
    });
    await hat.process(list);
    console.log(list);
}
async function run() {
    await doRun();
    await doRun(function (row, hatData) {
        row.hatData = hatData;
    });
}
run();
