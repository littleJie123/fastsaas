"use strict";
/**
链接池工具类
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigFac_1 = __importDefault(require("./../config/ConfigFac"));
const configKey = 'datasources';
class BasePoolFac {
    _needNoType() {
        return false;
    }
    constructor() {
        this._init = false;
        this._map = {};
    }
    _initConfig(opt) {
        const map = {};
        for (let e in opt) {
            map[e] = this.createPool(opt[e]);
        }
        return map;
    }
    _formatConnectOption(config) {
        return config;
    }
    /**
     * @description 连接池工厂初始化
     */
    init() {
        if (this._init)
            return;
        this._init = true;
        let opt = this._loadConfigs();
        this._map = this._initConfig(opt);
    }
    getKeys() {
        this.init();
        let ret = [];
        for (var e in this._map) {
            ret.push(e);
        }
        return ret;
    }
    _loadConfigs() {
        var ret = {};
        var datasources = ConfigFac_1.default.get(configKey);
        for (var e in datasources) {
            if (this._isMyConfig(datasources[e]))
                ret[e] = datasources[e];
        }
        return ret;
    }
    _isMyConfig(config) {
        if (config.type == this.getType()) {
            return true;
        }
        if (this._needNoType() && (config.type == null)) {
            return true;
        }
        return false;
    }
    getDefPoolName() {
        return 'mysql';
    }
    /**
     * @description get specific pool from factory
     * @param poolName
     */
    get(poolName) {
        if (poolName == null)
            poolName = this.getDefPoolName();
        this.init();
        if (!this._init)
            throw new Error('Please load database config first');
        if (!poolName)
            return this._map[Object.keys(this._map)[0]];
        return this._map[poolName];
    }
}
exports.default = BasePoolFac;
