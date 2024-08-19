"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JsonPostHttp_1 = __importDefault(require("./../../http/imp/JsonPostHttp"));
const ConfigFac_1 = __importDefault(require("./../../config/ConfigFac"));
const JsonGetHttp_1 = __importDefault(require("./../../http/imp/JsonGetHttp"));
const Query_1 = __importDefault(require("../query/Query"));
const EsFind_1 = __importDefault(require("./esFind/EsFind"));
const EsGroup_1 = __importDefault(require("./esFind/EsGroup"));
const Dao_1 = __importDefault(require("../Dao"));
class default_1 extends Dao_1.default {
    constructor(opt) {
        super({});
        this.esDaoOpt = opt;
    }
    _initMap() {
        //没必要实现该方法
    }
    _acqExecutor() {
        //没必要实现该方法
        return null;
    }
    async findOne(query) {
        let list = await this.find(query);
        return list[0];
    }
    async update(data) {
        let id = data._id;
        if (id != null) {
            delete data._id;
        }
        else {
            id = data.id;
        }
        if (id != null) {
            await this.doPost(id, data);
        }
    }
    async submit(clazz, path, param) {
        if (param == null)
            param = {};
        let url = this.buildUrl(path);
        let logger = this.getContext().getLogger('esDao');
        logger.debug(url);
        let http = new clazz({
            url
        });
        let result = await http.submit(param);
        return result;
    }
    async doPost(path, param) {
        return this.submit(JsonPostHttp_1.default, path, param);
    }
    async doGet(path, param) {
        return this.submit(JsonGetHttp_1.default, path, param);
    }
    buildUrl(path) {
        if (path.substring(0, 1) != '/')
            path = '/' + path;
        let es = ConfigFac_1.default.get('es');
        let opt = this.getOpt();
        let url = opt.url;
        if (url == null)
            url = es.url;
        if (!url.endsWith('/')) {
            url = url + '/';
        }
        let ret = null;
        if (opt.type != null)
            ret = `${url}${opt.index}/${opt.type}${path}`;
        else
            ret = `${url}${opt.index}${path}`;
        return ret;
    }
    getOpt() {
        return this.esDaoOpt;
    }
    async get(id) {
        let result = await this.doGet(id);
        if (result == null)
            return {};
        let data = result._source;
        if (data == null)
            return {};
        data._id = result._id;
        return data;
    }
    async find(query) {
        let ormQuery = Query_1.default.parse(query);
        let findEs = this.buildFinder(ormQuery);
        let queryParam = findEs.buildQueryParam(ormQuery);
        let logger = this.getContext().getLogger('esDao');
        logger.debug(JSON.stringify(queryParam));
        let result = await this.doPost('_search', queryParam);
        return findEs.parseResult(ormQuery, result);
    }
    async findCnt(query) {
        let ormQuery = Query_1.default.parse(query);
        let findEs = this.buildFinder(ormQuery);
        let queryParam = findEs.buildQueryParam(ormQuery);
        delete queryParam.size;
        delete queryParam.sort;
        delete queryParam.from;
        let logger = this.getContext().getLogger('esDao');
        logger.debug(JSON.stringify(queryParam));
        let result = await this.doPost('_count', queryParam);
        return result.count;
        //return findEs.parseResult(ormQuery,result);
    }
    buildFinder(query) {
        let groups = query.getGroups();
        if (groups != null && groups.length > 0) {
            return new EsGroup_1.default(this.getContext());
        }
        else {
            return new EsFind_1.default(this.getContext());
        }
    }
}
exports.default = default_1;
