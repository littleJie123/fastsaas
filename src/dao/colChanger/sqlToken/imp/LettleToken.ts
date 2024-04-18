import SqlToken from "../SqlToken";
import SqlTokenUtil from "../SqlTokenUtil";

export default class extends SqlToken {
  isEnd(c: string): boolean {
    return !SqlTokenUtil.isNumber(c) && !SqlTokenUtil.isLetter(c); 
  }

  change(pojoToDbMap: { [key: string]: string; }) { 
    let chars = this.chars.join('');
    if(pojoToDbMap[chars] != null){
      return pojoToDbMap[chars]
    }else{
      return this.chars.join('');
    }
  }
}