/// <reference types="node" />
interface Col {
    title: string;
    dataIndex: string;
}
export default class {
    static parseFromFile(filePath: string): Promise<any[]>;
    static parse(str: string): string[];
    /**
     *  parse 一列，把数组转成一行
     * @param array
     * @returns
     */
    private static parseColInRow;
    /**
     * 将一个csv格式的字符串列表 转成一个json格式的数据
     * @param list
     */
    static parseCsv(list: string[]): any[];
    /**
     * 将一个json数组转成符合csv格式的buffer
     * @param datas
     * @param cols
     * @returns
     */
    static toBuffer(datas: any[], cols: Col[]): Buffer;
    private static _attachArray;
}
export {};
