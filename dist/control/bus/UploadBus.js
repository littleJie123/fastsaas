"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AsyncBus_1 = __importDefault(require("./../../bus/AsyncBus"));
const StrUtil_1 = require("./../../util/StrUtil");
class UploadBus extends AsyncBus_1.default {
    async process(buffers) {
        var n = 0;
        while ((n = buffers.indexOf('\r\n')) != -1) {
            this.add(buffers.readTo(n + 2));
        }
        this.add(buffers.readTo());
        var param = await this.getFromEvent(new AskParam_1.default());
        var files = await this.getFromEvent(new AskFile_1.default());
        return {
            param: param,
            files: files
        };
    }
    add(line) {
        let opt = this._opt;
        if (StrUtil_1.StrUtil.start(line.toString(), opt.boundary)) {
            this._closeWiget();
        }
        this.getWiget().add(line);
    }
    _closeWiget() {
        this._wiget = null;
    }
    getWiget() {
        if (this._wiget == null) {
            this._wiget = new UploadWiget_1.default(this._opt);
            this._wiget.bind(this);
        }
        return this._wiget;
    }
}
exports.default = UploadBus;
const UploadWiget_1 = __importDefault(require("./wiget/UploadWiget"));
const AskParam_1 = __importDefault(require("./event/AskParam"));
const AskFile_1 = __importDefault(require("./event/AskFile"));
