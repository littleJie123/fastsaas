import { Readable, Writable } from "stream";
/**
 * 处理buffer的信息
 */
export default class {
    static pipe(readable: Readable, writeable: Writable, end?: boolean): Promise<void>;
    static streamToBuffer(stream: any): Promise<Buffer>;
}
