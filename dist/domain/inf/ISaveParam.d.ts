export default interface ISaveParam<Do> {
    datas: Do[];
    needCheck?: boolean;
    updateCols?: string[];
    /**
     * 检查的查询条件
     */
    query?: any;
    /**
     * 这个开关表示是否需要从数据库中查询出来
     */
    needFind?: boolean;
    /**
     * 这个开关表示是否需要删除
     */
    needDel?: boolean;
}
