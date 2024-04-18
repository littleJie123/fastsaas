import BaseSafeHttp from "./BaseSafeHttp";

export default class extends BaseSafeHttp{
    protected getMethod(){
        return 'delete';
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