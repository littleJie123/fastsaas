/**
 * 检查类的父类
 */
import BaseCheckerOpt from './opt/BaseCheckerOpt'
import Context from './../context/Context';
import IChecker from '../control/inf/IChecker';

 
export default abstract class BaseChecker implements IChecker{
    protected _opt:any = null;
    constructor(opt){
        this._opt = this._initOpt(opt);
    }

    
    
    _initOpt(opt){
        return opt;
    }
    
    protected getCode(){
        let code = this._opt.code;
        if(code == null){
            code = "出错了"
        }
        return code;
    }
    async throwError(param?){
        let context = this.getContext();
        let domain:any = context.get('i18ndomain');
        let code = this.getCode();
        if(domain != null){
            await domain.throwError(code,param)
        }else{
            throw new Error(code)
        }
    };
    
    getContext():Context{
        return this._opt.context;
    }

    abstract  check(param):Promise<any>;
}