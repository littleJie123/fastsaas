import BaseSafeHttp from "./BaseSafeHttp";
export default class extends BaseSafeHttp {
    protected getMethod(): string;
    protected needChangeHeader(): boolean;
    protected needWriteBody(): boolean;
    protected needChangeUrl(): boolean;
}
