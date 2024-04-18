import TimeObj from "./TimeObj";
import TimeOpt from "./TimeOpt";


const S_Expire = 30*1000;
const S_Step = 5 * 1000;


/**
 * 一个时间有序的双向列表
 */
export default class  TimeLink<T=any>{
   
    private tail:TimeObj<T>;
    private opt:TimeOpt;



    constructor(opt?:TimeOpt){
        this.opt = opt;
    }
    /**
     * 往时间队列里面加对象
     * @param obj 增加的对象
     * @param fun 相同时间id，对老的数据进行处理
     */
    add(obj:T,fun:(oldObj:T,newObj:T)=>T):TimeObj<T>{
        let tail:TimeObj<T> = this.getTail();
        if(tail == null){
            this.tail = this.createObj(obj)
        }else{
            let timestamp = new Date().getTime();
            let timeId = this.getTimeId(timestamp);
            if(fun == null || timeId != tail.timeId){
                this.link(tail,this.createObj(obj,timeId,timestamp))
            }else{
                tail.obj = fun(tail.obj,obj);
            }
        }
        return this.tail
    }

    private link(tail:TimeObj<T>,next:TimeObj<T>){
        next.before = tail;
        this.tail = next;
    }



    private createObj(obj:T,timeId?:number,timestamp?:number):TimeObj<T>{
        if(timestamp == null){
            timestamp =new Date().getTime()
        }
        if(timeId == null){
            timeId = this.getTimeId(timestamp)
        }
        return {
            obj,
            timestamp,
            timeId
        }
    }

    private getTail(){
        let tail = this.tail;
        if(tail == null)
            return null;
        if(!this.isValid(tail)){
            this.tail == null;
            return null;
        }
        return tail;
    }

    private isValid(tail:TimeObj<T>):boolean{
        let timestamp = new Date().getTime()
        return timestamp - tail.timestamp <= this.getExpire();
    }

    getTimeId(timestamp?:number){
        if(timestamp == null)
            timestamp = new Date().getTime();
        return Math.floor(timestamp/this.getTimeStep());
    }
    /**
     * 返回过期时间
     * @returns 
     */
    private getExpire():number{
        let ret = this.opt?.expire;
        if(ret == null){
            ret = S_Expire;
        }
        return ret;
    }
    /**
     * 返回时间步长
     * @returns 
     */
    private getTimeStep():number{
        let ret = this.opt?.timestep;
        if(ret == null || ret == 0){
            ret = S_Step;
        }
        return ret;
    }

    /**
     * 切断没有用的节点
     * @param timeObj 
     */
    private cut(timeObj:TimeObj<T>){
        if(timeObj != null)
            timeObj.before = null;
    }

    get():T[]{
        let ret = [];
        let tail:TimeObj<T> = this.getTail();
        while(tail != null){
            ret.push(tail.obj);
            let before = tail.before;
            if(before == null)
                break;
            if(!this.isValid(before)){
                this.cut(tail)
                break;
            }else{
                tail = before;
            }
        }
        return ret;
    }

}