"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const initContext_1 = __importDefault(require("./initContext"));
async function run() {
    let context = (0, initContext_1.default)();
    let dao = context.get('productDao');
    await dao.updateArray([
        { product_id: 1 },
        { product_id: 2 }
    ], { attr_rewrite: null });
}
run();
