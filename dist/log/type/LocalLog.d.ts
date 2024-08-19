import LogType from './LogType';
import GetLevel from './GetLevel';
export default class LocalLog extends LogType {
    printObj(log: GetLevel, obj: any, msg?: string): void;
    print(log: GetLevel, message: Array<any>, opt: any): void;
    private _buildMsgArray;
    private _printCommond;
}
