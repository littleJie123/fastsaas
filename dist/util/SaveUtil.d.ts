interface SaveOpt {
    pkCol: string;
}
interface SaveParam<T> {
    adds: T[];
    updates: T[];
    dels: T[];
}
export default class SaveUtil {
    /**
     * 在内存中执行增删改查合并数据。
     * 以 datas 为老数据，按 pkCol 把 updates 盖到对应行上，去掉 dels，再接上 adds。
     * 返回新数组。老数据会浅拷贝后再改，避免改到入参。adds 原样接上。主键对不上的修改、删除跳过。
     */
    static save<T>(datas: T[], param: SaveParam<T>, opt: SaveOpt): T[];
    /**
     * 浅拷贝每一行。空列表返回空数组。
     */
    private static copyRows;
    /**
     * 按主键把修改盖到已有行上。同一主键多条修改时，后面的覆盖前面的。
     */
    private static applyUpdates;
    /**
     * 按主键去掉要删除的行。主键为空的老数据保留。
     */
    private static applyDels;
    private static pkOf;
}
export {};
