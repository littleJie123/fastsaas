export default interface IDomainOpt<Pojo = any> {
    schQuery?: any;
    cols?: string[];
    onBeforeLoad?(pojos: Pojo[]): Promise<void>;
    /**
     * 比较
     * @param dbData 数据库数据
     * @param data 内存数据
     */
    onCompare?(dbData: Pojo, data: Pojo): any;
}
