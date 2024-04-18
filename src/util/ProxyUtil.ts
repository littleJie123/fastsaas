import {ArrayUtil} from './ArrayUtil';

export default class ProxyUtil{
    /**
     * 
     * @param row 目标类
     * @param colMap 一个map属性名+执行函数 
     */
    static proxy(row,colMap):any{
        let handle = {
            
            has:function(target, prop){
                
                if((prop in colMap) || (prop in row)){
             
                    
                    return true;
                }
                
                return prop in target;
            },
            get:function(target,name){
                if(name in target)
                    return target[name];
                if(colMap[name]){
                    return colMap[name](row,name)
                }
                if(name in row){
                    return row[name];
                }
                
            },
           
            ownKeys:function(target):Array<string>{
                let set = new Set<string>();
                console.log('target',target);
                
                for(let e in target){
                    set.add(e)

                }
                for(let e in colMap){
                    set.add(e)

                }
                
                for(let e in row){
                    set.add(e)

                }

                let array = []
                for(let v of set){
                    array.push(v);
                }
                console.log('array',array);
                
                
                return array;
            }
        }
        
        return new Proxy({},handle);

    }
    /**
     * 将某些属性藏起来
     * @param row  隐藏的列
     * @param cols 隐藏的属性列表
     */
    static hideCols(row,cols?){
        if(row == null)
            return row;
        if(cols == null)
            return row;
        if(cols instanceof Array){
            cols = ArrayUtil.toMap(cols);
        }
        return new Proxy(row,{
            has(target,p){
                if(cols[p])
                    return false;
                return p in target;
            },
            ownKeys(target){
                let keys = Object.keys(target);
                return ArrayUtil.filter(keys,key=>!cols[key]);
            }
        })
    }
    /**
     * 将数组中元素的列藏起来
     * @param array 
     * @param cols 
     */
    static hideListCols(array:Array<any>,cols?){
        if(cols == null)
            return array;
        if(cols instanceof Array){
            cols = ArrayUtil.toMap(cols);
        }
        let retArray = [];
        for(let row of array){
            retArray.push(ProxyUtil.hideCols(row,cols))
        }
        return retArray;
    }
}
