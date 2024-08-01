import Websocket from 'ws';
export default class {
  static listen(server: any,clazz) {
    let wss = new Websocket.Server({server});
    wss.on('connection', (ws) => {
      
      let processor = new clazz;
      processor.onConnect(ws);
    });
  }
  
}