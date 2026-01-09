import ISocketEvent from './inf/ISocketEvent';
import IActionMsg from './inf/IActionMsg';
import { WebServerOption } from '../webServer/webServer';
export default abstract class {
    private actionMap;
    private ws;
    private uuid;
    private roomIds;
    private opt;
    send(msg: ISocketEvent): void;
    getUuid(): string;
    onConnect(ws: any, map: any, opt: WebServerOption): void;
    processAction(json: IActionMsg): Promise<void>;
    onMessage(json: ISocketEvent): void;
    joinRoom(msg: any): void;
    levelRoom(roomId: string): void;
    onClose(): void;
    getRoomIdArray(): any[];
}
