export default class {
  static isEq(num1: number, num2: number): boolean {
    return Math.abs(num1 - num2) < 0.000001

  }
  /**
   * 保留几位小数,默认2位
   * @param num 
   * @param n 
   * @returns 
   */
  static toNum(num: number, n?: number) {
    if (num == null)
      return 0;
    let x = 1;
    if (n == null)
      n = 2;
    for (let i = 0; i < n; i++) {
      x = x * 10;
    }
    num = num * x;
    let ret = Math.floor(num);
    if (Math.abs((num - (ret + 1))) < 0.01)
      ret = ret + 1;

    return ret / x;
  }
  static format(num: number, len: number): string {
    let strNum = num.toString();
    if (strNum.length > len) {
      return strNum.substring(0, len);
    }
    if (strNum.length < len) {
      let array = [];
      let lenOfStr = strNum.length;
      for (let i = 0; i < len - lenOfStr; i++) {
        array.push('0');
      }
      array.push(strNum)
      return array.join('')
    }
    return strNum;
  }
  /**
   * 判断是否数字
   * @param num 
   */
  static isNum(num) {
    if (num == null)
      return false;
    return ((typeof num) == 'number') || (num instanceof Number)
  }

  /**
   * 是否含有小数
   * @param num 
   */
  static isDecimal(num:number){

    if(num == null){
      return false;
    }
    return Math.floor(num) != num;
  }
}