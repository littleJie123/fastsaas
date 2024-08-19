/**
 * 描述了一个json一个属性变成另外一个属性
 */
export default class JSONChanger {
    private _opt;
    private arrayChanger;
    constructor(opt: IChanger);
    private getTargetKey;
    changeTo(src: any, target: any): void;
    private getVals;
    /**
     * 反转
     */
    reverse(): JSONChanger;
    private reverseArrayChanger;
}
import IChanger from './IChanger';
