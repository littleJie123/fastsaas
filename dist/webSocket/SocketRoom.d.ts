import ISocketEvent from "./inf/ISocketEvent";
import SocketProcessor from "./SocketProcessor";
/**
 * socket 的“房间”
 */
export default class {
    private static roomMap;
    private static getRoom;
    static joinRoom(roomId: string, processor: SocketProcessor): void;
    static levelRoom(roomId: string, processor: SocketProcessor): void;
    static emitMsg(roomId: string, msg: ISocketEvent): void;
    static emit(roomId: string, eventType: string, msg: any): void;
}
