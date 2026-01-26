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
  }
  static levelRoom(roomId: string, processor: SocketProcessor) {

    let room = this.getRoom(roomId);
    delete room[processor.getUuid()];
  }

  static emitMsg(roomId: string, msg: ISocketEvent, opt?: EmitOpt) {
    let room = this.getRoom(roomId);

    for (let e in room) {
      if (opt == null || e != opt.socketProcessor?.getUuid()) {
        room[e].send(msg);
      }
    }

  }

  static emit(roomId: string, eventType: string, msg: any, opt?: EmitOpt) {
    let room = this.getRoom(roomId);

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