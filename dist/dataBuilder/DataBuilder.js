"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DataBuilder {
    setContext(context) {
        this.context = context;
        return this;
    }
    setOpt(opt) {
        this.opt = opt;
        return this;
    }
    async run(param, result) {
        var _a, _b, _c;
        if (param == null) {
            param = (_a = this.opt) === null || _a === void 0 ? void 0 : _a.defParam;
        }
        else {
            let defParam = (_b = this.opt) === null || _b === void 0 ? void 0 : _b.defParam;
            if (defParam == null) {
                defParam = {};
            }
            param = {
                ...defParam,
                ...param
            };
        }
        result = await this.doRun(param, result);
        if ((_c = this.opt) === null || _c === void 0 ? void 0 : _c.pareseResult) {
            result = await this.opt.pareseResult(result);
        }
        return result;
    }
    buildDataBuilderObj(param, result) {
        return {
            param,
            result
        };
    }
}
exports.default = DataBuilder;
