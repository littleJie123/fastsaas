import IColChanger from "../inf/IColChanger";
/**
 * 读取分享数据
 * @returns
 */
export default function (cols: IColChanger[]): <T extends {
    new (...args: any[]): {};
}>(constructor: T) => {
    new (...args: any[]): {
        doExecute(req?: Request, resp?: Response): Promise<any>;
    };
} & T;
