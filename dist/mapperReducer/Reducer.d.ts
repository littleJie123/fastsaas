import Mapper from "./Mapper";
type ProcessFun<SumPojo, Pojo> = (sumPojo: SumPojo, pre: SumPojo, pojos: Pojo[]) => void;
interface ReducerOpt<SumPojo = any, Pojo = any> {
    pre?: SumPojo;
    sumPojos?: SumPojo[];
    process?(sumPojo: SumPojo, pre: SumPojo, pojos: Pojo[]): any;
    getPojosBySumPojo?(sumPojo: SumPojo, mapper: Mapper): Pojo[];
}
export default class Reducer<SumPojo = any, Pojo = any> {
    private opt;
    constructor(opt?: ReducerOpt<SumPojo, Pojo>);
    setFun(fun: ProcessFun<SumPojo, Pojo>): void;
    setPre(pre: SumPojo): void;
    process(mapper: Mapper<Pojo>): void;
    /**
     *
     * @param sumPojo
     */
    protected getPojosBySumPojo(sumPojo: SumPojo, mapper: Mapper): Pojo[];
    /**
     * 真正处理
     * @param pre
     * @param pojos
     */
    protected doProcess(sumPojo: SumPojo, pre: SumPojo, pojos: Pojo[]): void;
}
export {};
