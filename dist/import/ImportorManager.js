"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ImportorManager {
    constructor(opt) {
        this.opt = opt;
    }
    async process(context, param, dataArray) {
        let imports = this.opt.importors;
        let count = 0;
        let datas = this.change(dataArray);
        for (let importor of imports) {
            let importorChecked = await importor.checked(context, param, datas);
            if (!importorChecked) {
                return {
                    checked: false,
                    datas
                };
            }
        }
        while (imports.length > 0) {
            if (count++ > 200) {
                throw new Error('死循环了？');
            }
            let noRuned = true;
            let nextArray = [];
            for (let importor of imports) {
                if (importor.isReady(datas)) {
                    await importor.process(context, param, datas);
                    noRuned = false;
                }
                else {
                    nextArray.push(importor);
                }
            }
            if (noRuned) {
                throw new Error('一个能import的都没有');
            }
            imports = nextArray;
        }
        return { checked: true };
    }
    /**
     * 转变数据
     * @param data
     * @param caolMap
     */
    change(datas) {
        let retArray = [];
        for (let data of datas) {
            let newData = {};
            for (let importor of this.opt.importors) {
                importor.change(data, newData);
            }
            retArray.push(newData);
        }
        return retArray;
    }
}
exports.default = ImportorManager;
