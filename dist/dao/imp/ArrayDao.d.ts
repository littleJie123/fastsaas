import Dao from '../Dao';
export default class ArrayDao extends Dao {
    protected _initMap(): void;
    protected _acqExecutor(): import("../executor/IExecutor").default;
    private array;
    constructor(param: any[] | any);
    private acqFirstId;
    add(obj: any): Promise<any>;
    update(obj: any, whereObj?: any): Promise<number>;
    getById(id: any): Promise<void>;
    private findMaxId;
    find(opt: any): Promise<any[]>;
    private _processCol;
    private _processFilter;
    private _processGroup;
    private _processHaving;
}
