import BaseSafeHttp from "./BaseSafeHttp";

export default class extends BaseSafeHttp {
    protected getMethod(){
        return 'put';
    }
}