import SqlToken from "../SqlToken";

export default class extends SqlToken{
  change(pojoToDbMap: { [key: string]: string; }) {
    let chars = this.chars.slice(1,this.chars.length-1).join('');
    if(pojoToDbMap[chars] != null){
      let lastChar = this.getLastChar();
      let firstChar = this.chars[0];
      return `${firstChar}${pojoToDbMap[chars]}${lastChar}`
    }else{
      return this.chars.join('');
    }
  }


  isEnd(c: string): boolean {
    return this.chars.length>1 && this.chars[0] == this.getLastChar();
  }
  
}