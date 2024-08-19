"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 和EventEmitter类似
 * 只不过支持Async，每个处理器都是同步执行
 */
class AsyncBus {
    constructor(opt) {
        this.__AsyncBus = true;
        this._map = {};
        this._opt = opt;
    }
    clear() {
        this._map = {};
    }
    join(wiget) {
        if (wiget != null) {
            wiget.bind(this);
        }
    }
    on(id, fun) {
        if (!fun)
            return null;
        id = id.toString();
        let array = this._getFuns(id);
        array.push(fun);
    }
    _getFuns(id) {
        let array = this._map[id];
        if (array == null) {
            array = [];
            this._map[id] = array;
        }
        return array;
    }
    async emit(event, param) {
        if (!event)
            return;
        if (!event['__DtEvent']) {
            event = DtEvent_1.default.create(event.toString(), param);
        }
        let array = this._getFuns(event.toString());
        for (let fun of array) {
            await fun(event);
        }
        return event;
    }
    async emitList(id, list) {
        if (list == null) {
            return;
        }
        for (let param of list) {
            await this.emit(id, param);
        }
    }
    /**
     * 从事件中拿
     * @param event
     * @param all
     */
    async getFromEvent(event, all) {
        var e = await this.emit(event);
        if (all) {
            return e.getAll();
        }
        else {
            return e.get();
        }
    }
}
exports.default = AsyncBus;
const DtEvent_1 = __importDefault(require("./event/DtEvent"));
