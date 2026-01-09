import Websocket from 'ws';
import { WebServerOption } from '../webServer/webServer';
export default class {
  static listen(server: any, clazz, map, opt: WebServerOption) {
    let wss = new Websocket.Server({ server });
    wss.on('connection', (ws) => {

      let processor = new clazz;
      processor.onConnect(ws, map, opt);

    });
  }

}