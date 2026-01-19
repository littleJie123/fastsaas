"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../fastsaas");
const Control_1 = __importDefault(require("./Control"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const zlib = __importStar(require("zlib"));
const readline = __importStar(require("readline"));
/**
 * 查询日志文件
 */
class LogControl extends Control_1.default {
    _getLogger() {
        return null;
    }
    async doExecute(req, resp) {
        let log = fastsaas_1.ConfigFac.get('log');
        let filePath = log.filePath;
        if (filePath == null || this._param.day == null) {
            throw new Error('文件不存在');
        }
        let fileStream = await this.readFileStream(filePath);
        if (fileStream == null) {
            throw new Error('文件不存在');
        }
        return {
            array: await this.readLines(fileStream, (json) => this.checkJson(json))
        };
    }
    getCdts() {
        if (this._param.cdts == null || this._param.cdts.length == 0) {
            return [];
        }
        if (this.cdts == null) {
            this.cdts = this._param.cdts.map(logCdt => {
                return new fastsaas_1.Cdt(logCdt.col, logCdt.value, logCdt.op);
            });
        }
        return this.cdts;
    }
    checkJson(json) {
        let cdts = this.getCdts();
        for (let cdt of cdts) {
            if (!cdt.isHit(json)) {
                return false;
            }
        }
        return true;
    }
    /**
     * 读取文件流 文件名为 `${filePath}/log${param.day}.log`或者`${filePath}/log${param.day}.log.gz`
     * 程序中需要先查询扩展名为log的，如果没有则查询扩展名为gz的文件
     * @param filePath
     */
    async readFileStream(filePath) {
        const logPath = path.join(filePath, `log${this._param.day}.log`);
        const gzPath = path.join(filePath, `log${this._param.day}.log.gz`);
        try {
            await fs.promises.access(logPath);
            return fs.createReadStream(logPath);
        }
        catch (error) {
            // .log file doesn't exist, try .gz
            try {
                await fs.promises.access(gzPath);
                const fileStream = fs.createReadStream(gzPath);
                return fileStream.pipe(zlib.createGunzip());
            }
            catch (gzError) {
                return null;
            }
        }
    }
    /**
     * 逐行读取日志记录，每一行都是一个合法的json字符串，
     * 如果找到符合条件的200条则直接返回。
     * 读完文件也返回
     * @param fileStream
     * @param check
     */
    async readLines(fileStream, check) {
        const result = [];
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        for await (const line of rl) {
            if (result.length >= 200) {
                rl.close();
                fileStream.destroy(); // Stop reading the underlying stream
                break;
            }
            try {
                const json = JSON.parse(line);
                if (check(json)) {
                    result.push(json);
                }
            }
            catch (e) {
                // Ignore lines that are not valid JSON
            }
        }
        return result;
    }
}
exports.default = LogControl;
