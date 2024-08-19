import HttpResult from './HttpResult';
export default class {
    static get(url: string, param?: any, headers?: any): Promise<any>;
    static post(url: string, param?: any, headers?: any): Promise<any>;
    static put(url: string, param?: any, headers?: any): Promise<any>;
    static delete(url: string, param?: any, headers?: any): Promise<any>;
    static getH(url: string, param?: any, headers?: any): Promise<HttpResult>;
    static postH(url: string, param?: any, headers?: any): Promise<HttpResult>;
    static putH(url: string, param?: any, headers?: any): Promise<HttpResult>;
    static deleteH(url: string, param?: any, headers?: any): Promise<HttpResult>;
}
