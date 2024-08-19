"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const initContext_1 = __importDefault(require("./initContext"));
var context = (0, initContext_1.default)();
async function testRun(id) {
    var searcher = context.get('TMaterialSearcher');
    console.log(await searcher.getById(id));
}
async function doRun(ids) {
    var searcher = context.get('TMaterialSearcher');
    var list = await searcher.findByIds(ids);
    //console.log(list);
    console.log('list.length', list.length);
}
async function run() {
    await doRun(3051);
    await doRun(3051);
    await doRun([3051, 3052, 3053]);
    await doRun([3051, 3052, 3053]);
    await testRun(3054);
}
run();
