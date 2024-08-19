import LogType from "./LogType";
export default class DefaultLog extends LogType {
    printObj(log: GetLevel, obj: any, msg?: string): void;
    print(log: GetLevel, list: Array<any>, opt?: any): void;
}
import GetLevel from "./GetLevel";
