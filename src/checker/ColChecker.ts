/**
 * 检查类的父类
 */
import BaseCheckerOpt from './opt/BaseCheckerOpt'
import BaseChecker from './BaseChecker'



export default abstract class ColChecker extends BaseChecker{
    protected _opt:any = null;
    

    abstract  _check(val,col?,param?):Promise<any>;

    abstract  _createMsg(val,col?);

    
    
    protected async  _createError(param,col:string){
        return new Error(this._createMsg(param[col],col));
    }

    _getCols():Array<string>{
        let opt = this._opt;
        if(opt.cols != null){
            return opt.cols;
        }
        if(opt.col != null)
            return [opt.col]
        return null;
    }
    


    async check(param){
        let cols = this._getCols();
        if(cols != null){
            for(let col of cols){
                if(!(await this._check(param[col],col,param))){
                    throw  await this._createError(param,col);
                };
            }
        }
    }
}