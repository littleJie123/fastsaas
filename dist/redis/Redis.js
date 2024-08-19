"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigFac_1 = __importDefault(require("./../config/ConfigFac"));
const ioredis_1 = __importDefault(require("ioredis"));
var get = function () {
    var redisConfig = ConfigFac_1.default.get('redis');
    if (redisConfig == null || redisConfig.host == null) {
        return null;
    }
    var db = 0;
    if (redisConfig.db != null)
        db = redisConfig.db;
    let opt = {
        host: redisConfig.host,
        port: redisConfig.port,
        password: redisConfig.password,
        db,
        maxRetriesPerRequest: 0
    };
    if (redisConfig.tls) {
        opt['tls'] = {};
    }
    return new ioredis_1.default(opt);
};
exports.default = { get };
