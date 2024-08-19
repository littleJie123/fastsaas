"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const initContext_1 = __importDefault(require("./initContext"));
var context = (0, initContext_1.default)();
async function doRun(param) {
    var searcher = context.get('TMaterialSearcher');
    var list = await searcher.getBrandName().find(param);
    console.log('list.length', list.length);
}
async function run() {
    await doRun([{ brand_id: 100273, name: '1花生' },
        { brand_id: 100273, name: '虫草' },
        { brand_id: 100001, name: '100' }
    ]);
    await doRun([{ brand_id: 100273, name: '1花生' }, { brand_id: 100273, name: '虫草' }]);
    await doRun([{ brand_id: 100273, name: '1花生' }, { brand_id: 100273, name: '虫草' }]);
    await doRun({ brand_id: 100273, name: '1花生' });
    await doRun({ brand_id: 100273, name: '1花生' });
}
run();
