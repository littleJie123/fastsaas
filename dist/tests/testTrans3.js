"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const initContext_1 = __importDefault(require("./initContext"));
var context = (0, initContext_1.default)();
async function addMaterial(opt) {
    var dao = context.get('TMaterialDao');
    await dao.add(opt);
}
async function addBomItem(opt) {
    var dao = context.get('TBomItemDao');
    await dao.add(opt);
}
/**
 * 多个表
 * 没有4
 */
async function run() {
    let tm = context.get('TransManager');
    await addMaterial({ name: 'aaa1' });
    await addBomItem({ material_id: '1' });
    await tm.beginTran();
    await addMaterial({ name: 'aaa2' });
    await addBomItem({ material_id: '2' });
    await tm.commitTran();
    await addMaterial({ name: 'aaa3' });
    await addBomItem({ material_id: '3' });
    await tm.beginTran();
    await addMaterial({ name: 'aaa4' });
    await addBomItem({ material_id: '4' });
    await tm.rollbackTran();
    await addMaterial({ name: 'aaa5' });
    await addBomItem({ material_id: '5' });
}
run();
