export default class {
   
  /**
   * 是否空字符串
   * @param c 
   */
  static isSpace(c:string):boolean{
    let code = c.charCodeAt(0);
    return [32,10,13].includes(code);
  }
  /**
   * 是否字母
   * @param c 
   * @returns 
   */
  static isLetter(c:string):boolean{
    return (
      (c>='a' && c<='z') || //小写字母
      (c>='A' && c<='Z') || //大写字母
      (c=='_') || //下划线
      (c.charCodeAt(0)>=128) //各种中文
    )
  }
  /**
   * 是否数字
   * @param c 
   * @returns 
   */
  static isNumber(c:string){
    return c>='0' && c<='9' 
  }
  /**
   * 是否重音符
   * @param c 
   */
  static isDiacritic(c:string){
    return c=='`';
  }
  /**
   * 单引号
   * @param c 
   * @returns 
   */
  static isSingleQuote(c:string){
    return c=="'";
  }

  /**
   * 单引号
   * @param c 
   * @returns 
   */
  static isDoubleQuote(c:string){
    return c=="'";
  }

  
}