"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const initContext_1 = __importDefault(require("./initContext"));
var context = (0, initContext_1.default)();
async function doRun(param) {
    var searcher = context.get('TMaterialSearcher');
    var list = await searcher.getBrand().find(param);
    console.log('list.length', list.length);
    if (list.length == 1)
        console.log(list);
}
async function run() {
    await doRun([100001, 100273, -2]);
    await doRun([100001, 100273]);
    await doRun(100273);
    await doRun(100273);
    console.log('==============');
    await doRun(-2);
    await doRun(-2);
}
run();
