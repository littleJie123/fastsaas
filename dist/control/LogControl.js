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
const MAX_LINES = 200;
/**
 * 查询日志文件。
 * 支持按日切割的多文件：log{day}.log、log{day}.log.N、log{day}.log.N.gz，
 * 从序号最大的分片开始遍历（最旧 → 最新），汇总最近匹配的 200 条。
 */
class LogControl extends Control_1.default {
    _getLogger() {
        return null;
    }
    async doExecute(req, resp) {
        const log = fastsaas_1.ConfigFac.get('log');
        const filePath = log.filePath;
        if (filePath == null || this._param.day == null) {
            throw new Error('Log file path or day parameter is not configured.');
        }
        const files = await this.findLogFiles(filePath);
        if (files.length === 0) {
            throw new Error(`Log file for day ${this._param.day} not found.`);
        }
        const check = (json) => this.checkJson(json);
        // 环形缓冲：跨文件从前到后读，保留全局最后 MAX_LINES 条匹配
        const buffer = new Array(MAX_LINES);
        let lineCount = 0;
        for (const file of files) {
            const fileStream = file.isGzipped
                ? fs.createReadStream(file.path).pipe(zlib.createGunzip())
                : fs.createReadStream(file.path);
            lineCount = await this.appendMatchingFromStart(fileStream, check, buffer, lineCount);
        }
        return { array: this.reorderCircularBuffer(buffer, lineCount) };
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
     * 列出某日全部日志分片，按序号从大到小排序（最大序号最先读）。
     * 同序号同时存在 .log.N 与 .log.N.gz 时优先非压缩文件。
     */
    async findLogFiles(dirPath) {
        const day = this._param.day;
        const prefix = `log${day}.log`;
        let names;
        try {
            names = await fs.promises.readdir(dirPath);
        }
        catch (e) {
            return [];
        }
        const bySeq = new Map();
        // log{day}.log | log{day}.log.gz | log{day}.log.N | log{day}.log.N.gz
        const re = new RegExp(`^${this.escapeRegExp(prefix)}(?:\\.(\\d+))?(\\.gz)?$`);
        for (const name of names) {
            const m = name.match(re);
            if (!m) {
                continue;
            }
            const seq = m[1] != null ? parseInt(m[1], 10) : 0;
            const isGzipped = m[2] === '.gz';
            const info = {
                path: path.join(dirPath, name),
                isGzipped,
                seq
            };
            const existing = bySeq.get(seq);
            // 同序号优先明文，避免既有 .log.1 又有 .log.1.gz 时读两遍
            if (existing == null || (existing.isGzipped && !isGzipped)) {
                bySeq.set(seq, info);
            }
        }
        return Array.from(bySeq.values()).sort((a, b) => b.seq - a.seq);
    }
    escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    /**
     * 从流头开始逐行匹配，写入环形缓冲；返回更新后的匹配总数。
     */
    async appendMatchingFromStart(fileStream, check, buffer, lineCount) {
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        for await (const line of rl) {
            try {
                const json = JSON.parse(line);
                if (check(json)) {
                    buffer[lineCount % MAX_LINES] = json;
                    lineCount++;
                }
            }
            catch (e) {
                // Ignore invalid JSON lines
            }
        }
        return lineCount;
    }
    /**
     * 将环形缓冲整理为「最新在前」的数组（最多 MAX_LINES 条）。
     */
    reorderCircularBuffer(buffer, lineCount) {
        const result = [];
        const count = Math.min(lineCount, MAX_LINES);
        const start = lineCount > MAX_LINES ? (lineCount % MAX_LINES) : 0;
        for (let i = 0; i < count; i++) {
            result.push(buffer[(start + i) % MAX_LINES]);
        }
        // 缓冲内是最旧→最新，反转后最新在前
        return result.reverse();
    }
}
exports.default = LogControl;
