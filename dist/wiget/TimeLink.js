"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const S_Expire = 30 * 1000;
const S_Step = 5 * 1000;
/**
 * 一个时间有序的双向列表
 */
class TimeLink {
    constructor(opt) {
        this.opt = opt;
    }
    /**
     * 往时间队列里面加对象
     * @param obj 增加的对象
     * @param fun 相同时间id，对老的数据进行处理
     */
    add(obj, fun) {
        let tail = this.getTail();
        if (tail == null) {
            this.tail = this.createObj(obj);
        }
        else {
            let timestamp = new Date().getTime();
            let timeId = this.getTimeId(timestamp);
            if (fun == null || timeId != tail.timeId) {
                this.link(tail, this.createObj(obj, timeId, timestamp));
            }
            else {
                tail.obj = fun(tail.obj, obj);
            }
        }
        return this.tail;
    }
    link(tail, next) {
        next.before = tail;
        this.tail = next;
    }
    createObj(obj, timeId, timestamp) {
        if (timestamp == null) {
            timestamp = new Date().getTime();
        }
        if (timeId == null) {
            timeId = this.getTimeId(timestamp);
        }
        return {
            obj,
            timestamp,
            timeId
        };
    }
    getTail() {
        let tail = this.tail;
        if (tail == null)
            return null;
        if (!this.isValid(tail)) {
            this.tail == null;
            return null;
        }
        return tail;
    }
    isValid(tail) {
        let timestamp = new Date().getTime();
        return timestamp - tail.timestamp <= this.getExpire();
    }
    getTimeId(timestamp) {
        if (timestamp == null)
            timestamp = new Date().getTime();
        return Math.floor(timestamp / this.getTimeStep());
    }
    /**
     * 返回过期时间
     * @returns
     */
    getExpire() {
        var _a;
        let ret = (_a = this.opt) === null || _a === void 0 ? void 0 : _a.expire;
        if (ret == null) {
            ret = S_Expire;
        }
        return ret;
    }
    /**
     * 返回时间步长
     * @returns
     */
    getTimeStep() {
        var _a;
        let ret = (_a = this.opt) === null || _a === void 0 ? void 0 : _a.timestep;
        if (ret == null || ret == 0) {
            ret = S_Step;
        }
        return ret;
    }
    /**
     * 切断没有用的节点
     * @param timeObj
     */
    cut(timeObj) {
        if (timeObj != null)
            timeObj.before = null;
    }
    get() {
        let ret = [];
        let tail = this.getTail();
        while (tail != null) {
            ret.push(tail.obj);
            let before = tail.before;
            if (before == null)
                break;
            if (!this.isValid(before)) {
                this.cut(tail);
                break;
            }
            else {
                tail = before;
            }
        }
        return ret;
    }
}
exports.default = TimeLink;
