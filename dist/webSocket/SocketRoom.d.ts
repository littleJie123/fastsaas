import ISocketEvent from "./inf/ISocketEvent";
import SocketProcessor from "./SocketProcessor";
interface EmitOpt {
    socketProcessor?: SocketProcessor;
}
/**
 * socket 的“房间”
 */
export default class {
    private static roomMap;
    private static getRoom;
    static joinRoom(roomId: string, processor: SocketProcessor): void;
    static levelRoom(roomId: string, processor: SocketProcessor): void;
    static getSocket(roomId: string, socketId: string): SocketProcessor;
    static sendMsg(roomId: string, socketId: string, msg: ISocketEvent): void;
    static emitMsg(roomId: string, msg: ISocketEvent, opt?: EmitOpt): void;
    static getRoomSize(roomId: string): number;
    static emit(roomId: string, eventType: string, msg: any, opt?: EmitOpt): void;
}
export {};
