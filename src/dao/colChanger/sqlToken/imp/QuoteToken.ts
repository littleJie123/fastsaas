import SqlToken from "../SqlToken";

export default class extends SqlToken{
 


  isEnd(c: string): boolean {
    return this.chars.length>1 && this.chars[0] == this.getLastChar();
  }
  
}