import JsonUtil from './../../../../util/JsonUtil';
import SumFun from './imp/SumFun'
import MaxFun from './imp/MaxFun'
import MinFun from './imp/MinFun'
import AvgFun from './imp/AvgFun'
import CountFun from './imp/CountFun'

var map = {
    test:{
        fun:function(nums){
            var val = nums[1]
            if(val == null)
                val = 1
            return nums[0]*2+val
        }
    },

    sum:new SumFun(),
    max: new MaxFun(),
    min: new MinFun(),
    avg:new AvgFun(),
    value_count: {

    },
    cardinality: {

    },
    count: new CountFun()

}

export default   class Funs {
    static get (key:String) {
        let ret = map[<string>key]
        if(ret!= null && ret.clone){
             ret = ret.clone()
        }
        return ret;
    }

    static isFun(key:String){
        return Funs.get(key) != null;
    }
}