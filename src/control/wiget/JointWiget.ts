import {ArrayUtil} from './../../util/ArrayUtil';
import Context from './../../context/Context';
import JointOpt from "../opt/JointOpt";

export default abstract class {
    protected opt:JointOpt;
    protected context:Context;

    /**
     * 返回主表的列
     * @returns 
     */
    getCol(){
        return this.opt.col;
    }
    setOpt(opt:JointOpt){
        this.opt = opt;
    }
 
    setContext(context:Context){
        this.context = context;
    }

    async addData(datas :any[]){
        if(datas == null)
            return await this.find();
        if(datas.length == 0)
            return datas;
        let myDatas = await this.find();
        if(myDatas == null)
            return datas;
        return ArrayUtil.and(datas,myDatas)
    }


    /**
     * paramkey中是否包含指定值
     * @param key 
     * @returns 
     */
    isIncludeKey(key:string){
        return this.opt.paramKeys.includes(key);
    }
    /**
     * 从数据库的表查询
     */
    protected abstract find():Promise<any[]>;

    /**
     * 增加值
     * @param key 
     * @param value 
     * @param fun 
     */
    abstract addParam(key:string,value:any,cdtFun:Function):Promise<void>;
    
}