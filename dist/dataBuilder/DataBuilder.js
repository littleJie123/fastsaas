"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DataBuilder {
    setRunner(runner) {
        if (this.runner == null) {
            this.runner = runner;
        }
        else {
            for (let key in runner) {
                this.runner[key] = runner[key];
            }
        }
    }
    setContext(context) {
        this.context = context;
        return this;
    }
    setOpt(opt) {
        this.opt = opt;
        return this;
    }
    async run(param, result) {
        var _a, _b, _c, _d;
        if (this.runner == null) {
            this.runner = {};
        }
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
        if (((_d = this.opt) === null || _d === void 0 ? void 0 : _d.buildRunner) && this.runner) {
            let runner = await this.opt.buildRunner(result);
            console.log('runner', runner);
            if (runner != null) {
                for (let key in runner) {
                    console.log('runner', key, runner[key]);
                    this.runner[key] = runner[key];
                }
            }
        }
        console.log(this.runner, 'this.runner');
        return result;
    }
    buildDataBuilderObj(param, result) {
        return {
            param,
            result,
            runner: this.runner,
        };
    }
}
exports.default = DataBuilder;
