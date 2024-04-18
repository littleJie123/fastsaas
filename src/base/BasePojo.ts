import Context from '../context/Context'

export default class BasePojo {
    protected _data:any;
    protected _context:Context;
    constructor(data,context?:Context){
        this._data = data;
        this.setContext(context)
    }

    setContext(context:Context){
        if(context != null)
            this._context = context;
    }
    getContext(){
        return this._context;
    }
    getData(){
        return this._data;
    }

    
}