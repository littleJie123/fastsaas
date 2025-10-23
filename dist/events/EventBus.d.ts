import { Context, IGeter } from "../fastsaas";
export interface IEventProcessor<Event = any> {
    process(events: Event[]): Promise<void>;
}
/**
 * 事件处理器构建器
 */
export interface IEventProcessorBuilder<Event = any> {
    build(eventType: string, events: Event[]): IEventProcessor<Event>[];
}
interface EventOpt<Event = any> {
    preProcess?(events: any[]): Promise<void>;
    context?: Context;
    afterProcess?(events: any[]): Promise<any[]>;
    getKey?(event: Event): IGeter;
    eventProcessorBuilder?: IEventProcessorBuilder<Event>;
}
/**
 * 一个消息总线
 */
export default class EventBus<Event = any> {
    private opt;
    constructor(opt?: EventOpt<Event>);
    getContext(): Context;
    /**
     * 处理事件
     * @param event
     */
    emit(events: Event[]): Promise<void>;
    protected doProcessEventType(eventType: string, events: Event[]): Promise<void>;
    /**
     * 创建构建器
     * @param eventType
     * @param events
     * @returns
     */
    protected getEventProcesser(eventType: string, events: Event[]): IEventProcessor<Event>[];
    protected groupByEventType(events: Event[]): {
        [eventType: string]: Event[];
    };
    preProcess(events: Event[]): Promise<void>;
    afterProcess(events: Event[]): Promise<void>;
}
export {};
