import DaoUtil from './../util/DaoUtil';
import DefOnChangeOpt from "../util/inf/imp/DefOnChangeOpt"

/**
 * 设置排序字段
 */
interface SortColOpt{
    sort:number
}

export default  function(opt?:SortColOpt){
    if(opt == null){
        opt = {sort:1}
    }

    
    return DaoUtil.createOnChangeDecorator(new DefOnChangeOpt({
        async onAdd(dao,data){
            if(data && data.sort == null){
                data.sort = new Date().getTime() * opt.sort;
            }
        },
        async onAddArray(dao,array:Array<any>){
            if(array){
                let time = new Date().getTime();
                for(let i =0;i<array.length;i++){
                    if(array[i]['sort'] == null)
                        array[i]['sort'] = (time+i) * opt.sort;
                }
            }
        }
    }))
}

