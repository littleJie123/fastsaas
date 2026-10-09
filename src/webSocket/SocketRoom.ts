import ISocketEvent from "./inf/ISocketEvent";
import SocketProcessor from "./SocketProcessor";

type Room = { [key: string]: SocketProcessor }
type RoomMap = { [key: string]: Room }

interface EmitOpt {
  socketProcessor?: SocketProcessor;
}
/**
 * socket 的“房间”
 */
export default class {

  private static roomMap: RoomMap = {}

  private static getRoom(roomId: string) {
    let room = this.roomMap[roomId];
    if (room == null) {
      room = {};
      this.roomMap[roomId] = room;
    }
    return room;
  }
  static joinRoom(roomId: string, processor: SocketProcessor) {
    let room = this.getRoom(roomId);
    room[processor.getUuid()] = processor;
    console.log("[SocketRoom.joinRoom]", roomId, processor.getUuid(), "size=", Object.keys(room).length);
  }
  static levelRoom(roomId: string, processor: SocketProcessor) {

    let room = this.getRoom(roomId);
    delete room[processor.getUuid()];
  }


  static getSocket(roomId:string,socketId:string):SocketProcessor{
    let room = this.getRoom(roomId);
    if(room == null){
      return null;
    }
    return room[socketId];
  }


  static sendMsg(roomId:string,socketId:string,msg:ISocketEvent){
    let socketProcessor = this.getSocket(roomId,socketId);
    if(socketProcessor){
      socketProcessor.send(msg);
    }
  }

  static emitMsg(roomId: string, msg: ISocketEvent, opt?: EmitOpt) {
    let room = this.getRoom(roomId);

    for (let e in room) {
      if (opt == null || e != opt.socketProcessor?.getUuid()) {
        room[e].send(msg);
      }
    }

  }

  static getRoomSize(roomId: string): number {
    return Object.keys(this.getRoom(roomId)).length;
  }

  static emit(roomId: string, eventType: string, msg: any, opt?: EmitOpt) {
    let room = this.getRoom(roomId);
    const ids = Object.keys(room);
    console.log("[SocketRoom.emit]", { roomId, eventType, targetCount: ids.length, targets: ids });

    for (let e in room) {
      if (opt == null || e != opt.socketProcessor?.getUuid()) {
        room[e].send({
          msg,
          eventType
        });
      }
    }

  }

}