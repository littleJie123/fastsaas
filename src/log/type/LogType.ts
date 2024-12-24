


export default abstract class LogType {
  abstract print(obj: any);



  protected _parseMsg(list: Array<any>): string {

    let message: string;
    if (list.length == 1) {
      if (!(typeof (list[0]) == 'string')) {
        message = this._stringify(list[0])
      } else {
        message = <string>list[0];
      }
    } else {
      message = this._stringify(list);
    }
    return message;
  }

  protected _stringify(msg): string {
    
    var ret = null;
    try {
      ret = JSON.stringify(msg);
    } catch (e) {
      console.log(e);
    }
    return ret;

  }
}


