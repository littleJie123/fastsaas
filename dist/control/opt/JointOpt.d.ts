interface JointOpt {
    /**
     * 关联表的表名
     */
    table?: string;
    /**
     * 联合查询的列，如果没有取col
     */
    tableCol?: string;
    /**
     * 在主表查询的列，会将各分表的值最后合并
     */
    col: string;
    /**
     * 输入参数的keys，表示这些字段在这里查
     */
    paramKeys: string[];
    fun?: (pojo: any) => Promise<any[]>;
}
export default JointOpt;
