import { ArrayUtil, Context, IGeter } from "../fastsaas";
export interface IEventProcessor<Event=any>{
  process(events:Event[]):Promise<void>;
}

/**
 * 事件处理器构建器
 */
export interface IEventProcessorBuilder<Event=any>{
  build(eventType:string,events:Event[]):IEventProcessor<Event>[];

}


interface EventOpt<Event=any>{
  preProcess?(events:any[]):Promise<void>;
  context?:Context;
  afterProcess?(events:any[]):Promise<any[]>;

  keys?:IGeter;

  eventProcessorBuilder?:IEventProcessorBuilder<Event>;
}
/**
 * 一个消息总线
 */
export default class EventBus<Event = any>{
  
  private opt:EventOpt<Event>;
  constructor(opt?:EventOpt<Event>){
    if(opt == null){
      opt = {}
    }
    this.opt = opt;
  }

  getContext():Context{
    return this.opt.context;
  }
  /**
   * 处理事件
   * @param event 
   */
  async emit(events:Event[]):Promise<void>{
    await this.preProcess(events);
    let eventGroups = this.groupByEventType(events);
    for(let eventType in eventGroups){
      await this.doProcessEventType(eventType,eventGroups[eventType]);
    }
    await this.afterProcess(events);
  }
  protected async doProcessEventType( eventType: string,events: Event[]):Promise<void>{ 
    let eventProcesser = this.getEventProcesser(eventType,events);
    if(eventProcesser != null){
      for(let processer of eventProcesser){
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
  protected getEventProcesser(eventType: string, events: Event[]):IEventProcessor<Event>[]  {
    let opt = this.opt;
    if(opt.eventProcessorBuilder != null){
      return opt.eventProcessorBuilder.build(eventType,events);
    }
    return null;
  }



  protected groupByEventType(events:Event[]):{[eventType:string]:Event[]}{
    let opt = this.opt;
    return ArrayUtil.toMapArray(events,opt.keys)
  }


  async preProcess(events:Event[]):Promise<void>{
    if(this.opt.preProcess != null){
      await this.opt.preProcess(events);
    }
    
  }

  async afterProcess(events:Event[]):Promise<void>{
    if(this.opt.afterProcess != null){
      await this.opt.afterProcess(events);
    } 
  }
}