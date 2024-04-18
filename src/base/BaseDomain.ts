import Context from "../context/Context";

export default abstract class BaseDomain{
    protected _context:Context;

   
    

    setContext(context:Context){
        this._context = context;
    }
    getContext():Context{
        return this._context;
    }
}