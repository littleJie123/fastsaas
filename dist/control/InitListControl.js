"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ListControl_1 = __importDefault(require("./ListControl"));
/**
 * 还是一个查询，查出来空会运行processInit 方法
 */
class InitListControl extends ListControl_1.default {
    async doExecute() {
        this._initPager();
        var query = await this.buildQuery();
        let map = {};
        map.list = await this.find(query);
        if (await this._needInit(map.list)) {
            let initRet = await this.processInit();
            //如果运行了初始化
            if (initRet) {
                map.isInit = initRet;
                map.list = await this.find(query);
            }
        }
        if (!this._onlySch) {
            await this.schCnt(map, query);
        }
        else {
            return map;
        }
        this._calPager(map);
        return map;
    }
    /**
     * 是否需要初始化
     * @param list
     */
    async _needInit(list) {
        return list.length == 0;
    }
}
exports.default = InitListControl;
