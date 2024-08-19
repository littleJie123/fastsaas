import BaseCdt from './../dao/query/cdt/BaseCdt';
export default class<T> {
    private fun;
    constructor(fun?: (T: any) => T);
    ids: T[];
    notInIds: T[];
    /**
     * 往id里面增加
     * @param ids
     */
    add(ids: T[]): void;
    /**
     * 往not in的结果表里面增加
     * @param ids
     */
    addNotIn(ids: T[]): void;
    /**
     * 返回结果，表示是not in 还是in
     */
    getResult(): {
        ids: T[];
        notIn: boolean;
    };
    /**
     * 返回一个条件
     * @param colName
     */
    toCdt(colName: string): BaseCdt;
}
