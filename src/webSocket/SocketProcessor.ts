import { v4 as uuidv4} from 'uuid';
import ISocketEvent from './inf/ISocketEvent';
import { Socket } from 'socket.io';
import SocketRoom from './SocketRoom';
import WebSocket from 'ws';
const S_Join = 'join';
const S_Level = 'level';

export default abstract class {
  
  private ws:any;

  private uuid:string;
  private roomIds:{[key:string]:boolean} = {}
  
  send(msg: ISocketEvent) {
    let ws = this.ws;

    if (ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
    
  }
  getUuid():string{
    return this.uuid;
  }

  onConnect(ws){
    this.ws = ws;
 
    ws.on('message', (message) => {
      try{
        let json:ISocketEvent = JSON.parse(message);
        if(json.eventType == S_Join){
          this.joinRoom(json.msg);
        }else if(json.eventType == S_Level){
          this.levelRoom(json.msg.roomId);
        }else{
          this.onMessage(json);
        }
      }catch(e){

      }
    });
    
  
    // 监听关闭事件
    ws.on('close', () => {
      console.log('------------------ on close------------------------');
      this.onClose();
    });
  }
  onMessage(json:ISocketEvent){

  }
  joinRoom(msg:any){
    let roomId = msg.roomId;
    if(this.uuid == null){
      if(msg.uuid != null){
        this.uuid = msg.uuid;
      }else{
        this.uuid = uuidv4();
      }
    }
    this.roomIds[roomId] = true;
    SocketRoom.joinRoom(roomId,this);
  }

  levelRoom(roomIds){
    delete this.roomIds[roomIds];
    SocketRoom.levelRoom(roomIds,this)
  }

  onClose(){
    for(let e in this.roomIds){
      this.levelRoom(e);
    }
  }

  getRoomIdArray(){
    let ret = [];
    for(let e in this.roomIds){
      ret.push(e)
    }
    return ret;
  }
} 