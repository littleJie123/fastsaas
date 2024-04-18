
import ConfigFac from '../../config/ConfigFac';
import {DateUtil} from '../../util/DateUtil';
import {StrUtil} from '../../util/StrUtil';



export default function(){
    let base = ConfigFac.get('base');
    let version = base.version;
    if(version == null){
        let now = DateUtil.format(new Date());
        version = StrUtil.replace(now,'-','.');
    }
    return function(req,resp){
        resp.send({
            version
        })
    }
}