"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StrUtil_1 = require("./../util/StrUtil");
const Buffers_1 = __importDefault(require("./../buffers/Buffers"));
const Control_1 = __importDefault(require("./Control"));
const UploadBus_1 = __importDefault(require("./bus/UploadBus"));
class UploadControl extends Control_1.default {
    /**
     * 得到所有的上传文件
     */
    _getAllFile() {
        var ret = [];
        if (this._fileMap != null) {
            for (var e in this._fileMap) {
                var file = this._fileMap[e];
                ret.push(file);
            }
        }
        return ret;
    }
    /**
     * 允许的上传文件扩展名
     */
    _getSuffixs() {
        return ['jpg'];
    }
    /**
     * 检查扩展名
     */
    _checkSuffix() {
        var files = this._getAllFile();
        var suffixs = this._getSuffixs();
        if (suffixs == null)
            return;
        for (var file of files) {
            var checked = false;
            for (var suffix of suffixs) {
                if (StrUtil_1.StrUtil.end(file.getFilename(), '.' + suffix, true)) {
                    checked = true;
                }
            }
            if (!checked)
                return false;
        }
        return true;
    }
    _getContentLen() {
        return 10 * 1000 * 1000;
    }
    /**
     * 创建长度太大了的返回信息
     */
    _createContentTooLong() {
        return "上传的文件长度太大了";
    }
    async doExecute(req, resp) {
        //await this._parseUpload(req)
        if (!this._checkSuffix()) {
            throw new Error(this._createWrongSuffix());
        }
        return await this._executeUpload();
    }
    async execute(req, resp) {
        let contentLen = this._getContentLen();
        if (contentLen != null) {
            let len = req.get('Content-Length');
            if (len == null) {
                len = req.headers['content-length'];
            }
            let num = parseInt(len);
            if (contentLen < num) {
                resp.send(this._createContentTooLong());
                return;
            }
        }
        let param = await this._parseUpload(req);
        if (req['_param'] == null)
            req['_param'] = {};
        for (let e in param) {
            req['_param'][e] = param[e];
        }
        await super.execute(req, resp);
    }
    /**
     * 检查
     */
    _createWrongSuffix() {
        let array = this._getSuffixs();
        let str = array.join('、');
        return `只能上传扩展名是${str}的文件`;
    }
    /**
     * 将request转成文件
     * @param req
     */
    async _parseUpload(req) {
        var buffers = new Buffers_1.default();
        await buffers.readFrom(req);
        var str = this._parse(req.get('Content-Type'));
        var bus = new UploadBus_1.default({
            boundary: str
        });
        var opt = await bus.process(buffers);
        this._fileMap = opt.files;
        return opt.param;
    }
    /**
     * 处理文件分割线
     * @param line
     */
    _parse(line) {
        var lines = line.split(';');
        var obj = {};
        for (let line of lines) {
            let strs = line.split('=');
            obj[StrUtil_1.StrUtil.trim(strs[0])] = strs[1];
        }
        return '--' + StrUtil_1.StrUtil.trim(obj['boundary']);
    }
    /**
     * 根据文件名获取文件
     * @param key 文件名，为空则只取一个文件
     */
    _getFile(key) {
        if (this._fileMap == null) {
            return null;
        }
        if (key != null) {
            return this._fileMap[key];
        }
        else {
            for (var e in this._fileMap) {
                return this._fileMap[e];
            }
        }
    }
    _printBeforeLog() {
        this._printLog({});
    }
}
exports.default = UploadControl;
