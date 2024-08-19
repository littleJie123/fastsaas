"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayUtil_1 = require("./../../util/ArrayUtil");
class default_1 {
    /**
     * 返回主表的列
     * @returns
     */
    getCol() {
        return this.opt.col;
    }
    setOpt(opt) {
        this.opt = opt;
    }
    setContext(context) {
        this.context = context;
    }
    async addData(datas) {
        if (datas == null)
            return await this.find();
        if (datas.length == 0)
            return datas;
        let myDatas = await this.find();
        if (myDatas == null)
            return datas;
        return ArrayUtil_1.ArrayUtil.and(datas, myDatas);
    }
    /**
     * paramkey中是否包含指定值
     * @param key
     * @returns
     */
    isIncludeKey(key) {
        return this.opt.paramKeys.includes(key);
    }
}
exports.default = default_1;
