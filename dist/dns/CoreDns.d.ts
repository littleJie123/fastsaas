export default class CoreDns {
    static lookup: Function;
    static timeout: any;
    static needTimeout: boolean;
    static init(): void;
    static beginTimeout(): void;
    private static _checkOnTimeOut;
    private static refreshCache;
}
