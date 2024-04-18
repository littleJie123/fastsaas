import BaseSafeHttp from "./BaseSafeHttp";

export default class extends BaseSafeHttp{
    protected getMethod(){
        return 'get';
    }

    protected needChangeHeader(){
        return false;
    }

    protected needWriteBody(){
        return false;
    }

    protected needChangeUrl(){
        return true;
    }
}