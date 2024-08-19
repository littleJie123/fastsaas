"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const initContext_1 = __importDefault(require("./initContext"));
const SearcherHat_1 = __importDefault(require("../hat/imp/SearcherHat"));
var context = (0, initContext_1.default)();
async function doRun() {
    var list = [
        { product_id: 3723 },
        { product_id: 3744 }
    ];
    var hat = new SearcherHat_1.default({
        context,
        key: 'tmaterial',
        funName: 'product',
        dataCol: 'product_id'
    });
    await hat.process(list);
    console.log('list', JSON.stringify(list));
}
doRun();
