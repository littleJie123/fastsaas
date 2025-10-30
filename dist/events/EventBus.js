"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastsaas_1 = require("../fastsaas");
/**
 * 一个消息总线
 */
class EventBus {
    constructor(opt) {
        if (opt == null) {
            opt = {};
        }
        this.opt = opt;
    }
    getContext() {
        return this.opt.context;
    }
    /**
     * 处理事件
     * @param event
     */
    async emit(events) {
        await this.preProcess(events);
        let eventGroups = this.groupByEventType(events);
        for (let eventType in eventGroups) {
            await this.doProcessEventType(eventType, eventGroups[eventType]);
        }
        await this.afterProcess(events);
    }
    async doProcessEventType(eventType, events) {
        let eventProcesser = this.getEventProcesser(eventType, events);
        if (eventProcesser != null) {
            for (let processer of eventProcesser) {
                await processer.process(events);
            }
        }
    }
    /**
     * 创建构建器
     * @param eventType
     * @param events
     * @returns
     */
    getEventProcesser(eventType, events) {
        let opt = this.opt;
        if (opt.eventProcessorBuilder != null) {
            return opt.eventProcessorBuilder.build(eventType, events);
        }
        return null;
    }
    groupByEventType(events) {
        let opt = this.opt;
        return fastsaas_1.ArrayUtil.toMapArray(events, opt.keys);
    }
    async preProcess(events) {
        if (this.opt.preProcess != null) {
            await this.opt.preProcess(events);
        }
    }
    async afterProcess(events) {
        if (this.opt.afterProcess != null) {
            await this.opt.afterProcess(events);
        }
    }
}
exports.default = EventBus;
