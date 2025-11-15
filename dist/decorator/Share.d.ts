import IColChanger from "../inf/IColChanger";
/**
 * 读取分享数据
 * @returns
 */
export default function (cols: IColChanger[], itemIds?: string[]): <T extends {
    new (...args: any[]): {};
}>(constructor: T) => {
    new (...args: any[]): {
        /**
         * 将分享的数据解析到请求参数中
         * @param req
         * @param resp
         * @returns
         */
        _parseRequestParam(req?: Request, resp?: Response): Promise<any>;
    };
} & T;
