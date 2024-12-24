import { ConfigFac } from '../../fastsaas';
import LogType from './LogType' 

var colorMap = {
  red: { begin: '[31m', end: "[m" },
  green: { begin: "[32m", end: "[m" },
  yellow: { begin: "[33m", end: "[m" }
}
export default class LocalLog extends LogType {
  print(obj: any) {
    let log = ConfigFac.get('log');
    let category = obj.category;
    let needPrint = true;
    if(log?.category !=null && category != null ){
      let categorys:string[] = log.category;
      needPrint = categorys.includes(category); 
    }

    if(!needPrint){
      return;
    }
    let message = obj.message; 
    let strArray:any[] = [`[${category},${obj.level}]:`]
    if(message == null){
      strArray.push(JSON.stringify({
        ... obj,
        category:null,
        level:null
      }))
    }else{
      if(message instanceof Array){
        strArray.push(message.join('\r\n'));
      }else{
        if(message instanceof Error){
          console.log('------------------')
          strArray.push(message.stack);
        }else{
          strArray.push(message);
        }
      }
    }

    console.log(strArray.join(" "));
    
  }
  
 

}