import DaoUtil from './../util/DaoUtil';

/**
 * 在上下文注册builder
 */


interface SysTimeOpt{
    addCol?:string
    updateCol?:string
    /**
     *   是否需要时区修正
     */
    needTimezone?:boolean;
}
export default  function(opt?:SysTimeOpt){
    let needTimezone:boolean = null;
    if(opt == null){
        opt = {addCol:'sys_add_time',updateCol:'sys_modify_time'};
    }else{
        
        needTimezone = opt.needTimezone
         
    }
    return DaoUtil.createAddAndUpdate({
        addCol:opt.addCol,
        updateCol:opt.updateCol,
        processFun:function(dao:any){
            if(needTimezone){
                let context = dao.getContext();
                if(context != null){
                    let timezoneServer = context.get('timezoneServer');
                    if(timezoneServer){
                        return timezoneServer.getDate();
                    }
                }
            }
            return new Date();
        }
    })
}

