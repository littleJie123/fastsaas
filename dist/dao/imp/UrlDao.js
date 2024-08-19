"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JsonGetHttp_1 = __importDefault(require("./../../http/imp/JsonGetHttp"));
const JsonUtil_1 = __importDefault(require("./../../util/JsonUtil"));
const JsonPostHttp_1 = __importDefault(require("./../../http/imp/JsonPostHttp"));
const Dao_1 = __importDefault(require("../Dao"));
const ArrayDao_1 = __importDefault(require("./ArrayDao"));
/**
 * 构造参数
 * {
 *   url:'http://www.zaobao.com', 查询的url
 *   key:'result.content' //查询的字段，默认是result.content
 * }
 */
class default_1 extends Dao_1.default {
    constructor(opt) {
        super({});
        this._urlOpt = opt;
    }
    _initMap() {
        throw new Error("Method not implemented.");
    }
    _acqExecutor() {
        throw new Error("Method not implemented.");
    }
    executeSql(str) {
        throw new Error('该方法没有实现');
    }
    async find(param) {
        let data = await this.getDatasFromUrl();
        let arrayDao = new ArrayDao_1.default(data);
        return arrayDao.find(param);
    }
    async getDatasFromUrl() {
        let opt = this._urlOpt;
        let http = null;
        if (opt.method != null && opt.method.toLowerCase() == 'post') {
            http = new JsonPostHttp_1.default({
                url: opt.url
            });
        }
        else {
            http = new JsonGetHttp_1.default({ url: opt.url });
        }
        let param = opt.param;
        if (param == null) {
            param = {};
        }
        let ret = await http.submit(param);
        let array = [];
        if (ret) {
            let key = opt.key;
            if (key == null || key == '') {
                key = 'result.content';
            }
            array = JsonUtil_1.default.get(ret, key.split('.'));
        }
        return array;
    }
}
exports.default = default_1;
