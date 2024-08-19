import ColChanger from "../dao/colChanger/ColChanger";
interface IDaoOpt {
    /**
     * 主键列表
     */
    ids?: string[];
    /**
     * 表名
     */
    tableName?: string;
    /**
     * 配置的链接池名称
     */
    poolName?: string;
    /**
     * 字段转化器
     */
    colChanger?: ColChanger;
    /**
     * 是否自增
     */
    increment?: boolean;
    /**
     * 对应的类
     */
    Pojo?: Function;
}
export default IDaoOpt;
