"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const initContext_1 = __importDefault(require("./initContext"));
async function run() {
    let context = (0, initContext_1.default)();
    let dao = context.get('productDao');
    await dao.add({ product_name: 'testSOrt' });
    await dao.add({ product_name: 'testSOrt' });
    await dao.add({ product_name: 'testSOrt' });
    await dao.addArray([
        { product_name: 'testSOrt1' },
        { product_name: 'testSOrt2' },
        { product_name: 'testSOrt3' }
    ]);
    await dao.update({
        product_id: 15,
        product_name: 'aaa'
    });
}
run();
