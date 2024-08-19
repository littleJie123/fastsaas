"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const initContext_1 = __importDefault(require("./initContext"));
var context = (0, initContext_1.default)();
async function doRun(params) {
    var searcher = context.get('TMaterialSearcher');
    var list = await searcher.getProduct().find(params, 'id');
    console.log('list', list);
}
async function run() {
    await doRun([3723, 3744]);
    await doRun([3723, 3744]);
    await doRun([3723]);
    await doRun([3723]);
}
run();
