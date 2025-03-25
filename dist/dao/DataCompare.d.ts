import IDaoHelper from "./IDaoHelper";
export default class<Pojo = any> {
    private beforeList;
    private afterList;
    private daoHelper;
    private tableName;
    private cdt;
    constructor(daoHelper: IDaoHelper, tableName: string, cdt: any);
    getBeforeList(): Pojo[];
    before(): Promise<void>;
    compare(fun: (beforePojo: Pojo, afterPojo: Pojo) => void): Promise<void>;
    compareList(fun: (beforePojo: Pojo[], afterPojo: Pojo[]) => void): Promise<void>;
}
