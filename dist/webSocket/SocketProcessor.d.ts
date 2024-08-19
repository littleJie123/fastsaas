import ISocketEvent from './inf/ISocketEvent';
export default abstract class {
    private ws;
    private uuid;
    private roomIds;
    send(msg: ISocketEvent): void;
    getUuid(): string;
    onConnect(ws: any): void;
    onMessage(json: ISocketEvent): void;
    joinRoom(msg: any): void;
    levelRoom(roomIds: any): void;
    onClose(): void;
    getRoomIdArray(): any[];
}
