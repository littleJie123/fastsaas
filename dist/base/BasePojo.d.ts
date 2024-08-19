import Context from '../context/Context';
export default class BasePojo {
    protected _data: any;
    protected _context: Context;
    constructor(data: any, context?: Context);
    setContext(context: Context): void;
    getContext(): Context;
    getData(): any;
}
