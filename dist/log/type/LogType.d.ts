export default abstract class LogType {
    abstract print(obj: any): any;
    protected _parseMsg(list: Array<any>): string;
    protected _stringify(msg: any): string;
}
