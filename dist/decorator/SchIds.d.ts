export interface SchIdsOpt {
    /**
     * 从 result.content 读取的属性；needObj 为 true 时不需要
     */
    col?: string;
    /**
     * 查询对象的类（通常为 ListControl 子类）
     */
    control: new (...args: any[]) => any;
    /**
     * 查询结果写到目标 param 的字段名
     */
    targetCol: string;
    /**
     * true：把 content 整表设到 targetCol；false：抽 col（或主键）成 id 数组
     */
    needObj?: boolean;
}
/**
 * 分页全选：用 `_schParam` 按列表查询条件拉全量 id（或对象），写入 targetCol。
 * 见 doc/分页选择.md
 */
export default function SchIds(opt: SchIdsOpt): <T extends {
    new (...args: any[]): {};
}>(constructor: T) => any;
