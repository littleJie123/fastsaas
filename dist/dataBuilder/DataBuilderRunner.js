"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DataBuilder_1 = __importDefault(require("./DataBuilder"));
class DataBuilderRunner extends DataBuilder_1.default {
    constructor(builders) {
        super();
        this.builders = builders;
    }
    async run() {
        let result = null;
        let builders = this.builders;
        for (let builder of builders) {
            console.log(`*********开始运行：${builder.getName()}**********`);
            result = await builder.run(this.param, result);
            console.log(`-------结束运行：${builder.getName()}--------`);
        }
        return result;
    }
}
exports.default = DataBuilderRunner;
