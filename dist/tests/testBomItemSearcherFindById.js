"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const initContext_1 = __importDefault(require("./initContext"));
var context = (0, initContext_1.default)();
async function testRun(id) {
    var searcher = context.get('TbomItemSearcher');
    console.log(await searcher.getById(id));
}
async function doRun(ids) {
    var searcher = context.get('TbomItemSearcher');
    var list = await searcher.findByIds(ids);
    //console.log(list);
    console.log('list.length', list.length);
}
async function run() {
    await testRun(679);
    await doRun([679, 678]);
    await doRun([679, 678]);
}
run();
