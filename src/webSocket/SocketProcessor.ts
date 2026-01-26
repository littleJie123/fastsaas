import { v4 as uuidv4 } from 'uuid';
import ISocketEvent from './inf/ISocketEvent';
import { Socket } from 'socket.io';
import SocketRoom from './SocketRoom';
import WebSocket from 'ws';
import IActionMsg from './inf/IActionMsg';
import { WebServerOption } from '../webServer/webServer';
import { Context } from '../fastsaas';
import UuidUtil from '../util/UuidUtil';
const S_Join = 'join';
const S_Level = 'level';
const S_Action = 'S_Action'
const S_Error = 'S_Error'
const S_ActionResult = 'S_ActionResult'
/**
 * 一个websocket一个链接
 */
export default abstract class {

  private actionMap = null;
  private ws: any;

  private uuid: string;
  private roomIds: { [key: string]: boolean } = {}
  private opt: WebServerOption;

  send(msg: ISocketEvent) {
    let ws = this.ws;

    if (ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }

  }

  sendEvent(eventType: string, msg: any) {
    this.send({
      eventType,
      msg
    })
  }
  getUuid(): string {
    if (this.uuid == null) {
      this.uuid = UuidUtil.getUuid()
    }
    return this.uuid;
  }

  onConnect(ws, map, opt: WebServerOption) {
    this.ws = ws;
    this.actionMap = map;
    this.opt = opt;
    ws.on('message', (message) => {
      try {

        let json: ISocketEvent = JSON.parse(message);
        if (json.eventType == S_Join) {
          this.joinRoom(json.msg.roomId);
        } else if (json.eventType == S_Level) {
          this.levelRoom(json.msg.roomId);
        } else if (json.eventType == S_Action) {
          this.processAction(json.msg)
        } else {
          this.onMessage(json);
        }
      } catch (e) {

      }
    });


    // 监听关闭事件
    ws.on('close', () => {
      console.log('------------------ on close------------------------');
      this.onClose();
    });
  }

  async processAction(json: IActionMsg) {
    if (this.actionMap != null) {
      let url = json.url;
      if (url == null) {
        this.send({
          eventType: S_Error,
          msg: {
            message: '没有url'
          }

        })
        return;
      }
      if (!url.startsWith('/')) {
        url = '/' + url
      }
      let ActionClazz = this.actionMap[url.toLowerCase()];
      if (ActionClazz == null) {
        this.send({
          eventType: S_Error,
          msg: {
            message: 'url没有对应的action'
          }

        })
        return;
      } else {
        let param = json.param;

        let opt = this.opt
        if (ActionClazz.default) {
          ActionClazz = ActionClazz.default
        }
        var ctrl = new ActionClazz();
        if (opt.context) {
          var context: Context = opt.context;

          var childContext = context.buildChild();
          if (ctrl.setContext) {
            ctrl.setContext(childContext);
          }

          childContext.assembly([ctrl]);
          if (opt.interceptorBeans) {
            for (let beanStr of opt.interceptorBeans) {
              try {
                let bean = childContext.get(beanStr);
                if (bean != null && bean.onWebSocketBefore) {
                  if (bean.setSocketProcessor) {
                    bean.setSocketProcessor(this);
                  }
                  let ret = await bean.onWebSocketBefore(url, param);
                  if (ret) {
                    return
                  }
                }
              } catch (e) {
                this.sendError(e)
                console.error(e);
                return;
              }
            }

          }
        }
        if (ctrl.setSocketProcessor) {
          ctrl.setSocketProcessor(this);
        }
        let result = await ctrl.executeWebSocket(param, url);
        this.send({
          eventType: S_ActionResult,
          msg: {
            id: json.id,
            result
          }
        })
      }


    }
  }

  sendError(e: Error) {
    this.send({
      eventType: S_Error,
      msg: {
        message: e.message
      }
    })
  }
  onMessage(json: ISocketEvent) {

  }
  joinRoom(roomId: string) {


    this.roomIds[roomId] = true;
    SocketRoom.joinRoom(roomId, this);
  }

  levelRoom(roomId: string) {
    delete this.roomIds[roomId];
    SocketRoom.levelRoom(roomId, this)
  }

  onClose() {
    for (let e in this.roomIds) {
      this.levelRoom(e);
    }
  }

  getRoomIdArray() {
    let ret = [];
    for (let e in this.roomIds) {
      ret.push(e)
    }
    return ret;
  }
} 