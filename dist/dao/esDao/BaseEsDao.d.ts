import Dao from "../Dao";
import IExecutor from "../executor/IExecutor";
interface EsDaoOpt {
    type?: string;
    url?: string;
    index: string;
}
export default class extends Dao {
    private esDaoOpt;
    constructor(opt: EsDaoOpt);
    protected _initMap(): void;
    protected _acqExecutor(): IExecutor;
    findOne(query: any): Promise<any>;
    update(data: any): Promise<any>;
    private submit;
    private doPost;
    private doGet;
    private buildUrl;
    getOpt(): EsDaoOpt;
    get(id: any): Promise<any>;
    find(query: any): Promise<any[]>;
    findCnt(query: any): Promise<number>;
    private buildFinder;
}
export {};
