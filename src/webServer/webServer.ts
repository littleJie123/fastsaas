

import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express';
import buildParam from './wiget/buildParam'
import Socket from '../webSocket/Socket';
import loadRouter from './wiget/loadRouter';
import debugHealth from './wiget/debugHealth';
import { WebSocketTokenOpt } from '../interface/Websocket.interface';
import Context from '../context/Context';
import { Request, Response } from 'express';



interface WebServerOption {
  /**
   * 
   */
  webPath?: string;
  webSocketClazz?: any;
  webSocketOpt?: any;
  webSocketTokenOpt?: WebSocketTokenOpt
  port?: number;
  /**
   * 中间件
   */
  mids?: Array<((req?: Request, resp?: Response, next?: Function) => void)>;

  midsMap?: { [url: string]: ((req?: Request, resp?: Response, next?: Function) => void) };
  context?: Context;
  /**
   * 保留body
   */
  keepBody?: boolean;
  interceptorBeans?: string[]
}


function init(opt) {
  if (opt == null)
    opt = {};
  if (opt.port == null) {
    opt.port = 8080;
  }
  return opt;
}
function createFun(clazz) {
  return function (req, resp) {
    var ctrl = new clazz();
    ctrl.execute(req, resp);
  }
}

function customBodyParser(req, res, next) {

  let body = [];
  let length = 0;
  req.on('data', (chunk) => {
    body.push(chunk);
    length += chunk.length
  });

  req.on('end', () => {
    if (req.method == 'POST') {
      req._bodyBytes = body;

      try {

        let buffer = Buffer.alloc(length)
        for (let i = 0, pos = 0, size = body.length; i < size; i++) {
          body[i].copy(buffer, pos)
          pos += body[i].length
        }

        let param = {}
        let contentType = req.headers['content-type'];
        if (contentType.includes('application/x-www-form-urlencoded')) {
          let tmpParams = buffer.toString('utf-8');
          tmpParams.split('&').forEach(param => {
            const [key, value] = param.split('=');
            param[key] = decodeURIComponent(value);
          });
        } else if (contentType.includes('application/json')) {
          param = JSON.parse(buffer.toString('utf-8'));
        } else if (contentType.includes('application/xml')) {
          // param = await this.xmlToJson(buffers.toString());
        }
        req.body = param
      } catch (e) {
        console.debug(e.message);
      }
    }

    next();
  });
}
function initApp(app, opt) {
  //HealthCheck.registerEndpoints(app) // 健康检查
  app.use('/debug/health', debugHealth())
  app.use(cors({ maxAge: 6000, origin: true, credentials: true }))
  if (opt.keepBody == null || opt.keepBody == false) {
    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(bodyParser.urlencoded({
      limit: '50mb',
      extended: true
    }))
  } else {
    app.use(customBodyParser)
  }


  app.use(buildParam(opt))




  if (opt.mids) {

    var mids = opt.mids;

    for (var mid of mids) {
      app.use(mid);
    }
  }
  if (opt.midsMap) {
    let midsMap = opt.midsMap;
    for (let e in midsMap) {
      app.use(e, midsMap[e]);
    }
  }

}
function addRouters(app, opt) {
  var routers = opt.routers;

  if (routers == null)
    return;
  for (var router of routers) {
    var { key, fun, ctrl } = router;
    if (fun == null) {
      fun = createFun(ctrl)
    }
    app.use('/' + key, fun);

  }
}

export default function (opt: WebServerOption) {
  opt = init(opt)
  let app = express();
  app.disable('x-powered-by');
  let apiPort = opt.port;

  initApp(app, opt)
  loadRouter(app, opt);
  addRouters(app, opt)

  let server = app.listen(apiPort, function () {

    console.log(`app listening at ${apiPort}`)
  })

  if (opt.webSocketClazz) {
    Socket.listen(server,opt.webSocketClazz);
  }
  app.disable('x-powered-by')
  return app;
}

