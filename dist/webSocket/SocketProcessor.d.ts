import ISocketEvent from './inf/ISocketEvent';
import IActionMsg from './inf/IActionMsg';
import { WebServerOption } from '../webServer/webServer';
/**
 * 一个websocket一个链接
 */
export default abstract class {
    private actionMap;
    private ws;
    private uuid;
    private roomIds;
    private opt;
    send(msg: ISocketEvent): void;
    sendEvent(eventType: string, msg: any): void;
    getUuid(): string;
    onConnect(ws: any, map: any, opt: WebServerOption): void;
    processAction(json: IActionMsg): Promise<void>;
    sendError(e: Error): void;
    onMessage(json: ISocketEvent): void;
    joinRoom(roomId: string): void;
    levelRoom(roomId: string): void;
    onClose(): void;
    getRoomIdArray(): any[];
}
