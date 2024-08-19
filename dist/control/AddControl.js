"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseOpControl_1 = __importDefault(require("./BaseOpControl"));
class default_1 extends BaseOpControl_1.default {
    async doExecute() {
        return await this.getDao().add(await this.getData());
    }
}
exports.default = default_1;
