export default class {
    /**
     * 克隆一个列表
     * @param array
     * @param opt
     * @returns
     */
    private static cloneList;
    static expectEqualArray(array1: any[], array2: any[], opt?: {
        msg?: string;
        notCheckCols?: string[];
    }): void;
    static expectEqualObj(obj1: any, obj2: any, msg?: string): void;
    static expectEqual(value1: any, value2: any, msg?: string): void;
    static expectFind(array: any[], findObj: any, msg?: string): void;
    static expectFindByArray(array: any[], findObjs: any[], msg?: string): void;
    static expectNotFind(array: any[], findObj: any, msg?: string): void;
    static expectNotNull(val: any, msg?: string): void;
}
