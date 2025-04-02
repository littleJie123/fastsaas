"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DataBuilder_1 = __importDefault(require("../DataBuilder"));
class MultiBuilder extends DataBuilder_1.default {
    constructor(builders) {
        super();
        this.builders = builders;
    }
    getName() {
        return 'MultiBuilder';
    }
    async doRun(param, result) {
        let builders = this.builders;
        try {
            for (let builder of builders) {
                if (this.context && builder.setContext) {
                    builder.setContext(this.context);
                }
                if (builder.setRunner) {
                    builder.setRunner(this.runner);
                }
                console.log(`*********开始运行：${builder.getName()}**********`);
                result = await builder.run(param, result);
                console.log(`-------结束运行：${builder.getName()}--------`);
            }
        }
        catch (e) {
            console.error(e);
            throw e;
        }
        return result;
    }
}
exports.default = MultiBuilder;
