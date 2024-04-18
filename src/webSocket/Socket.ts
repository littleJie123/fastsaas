import {Server} from 'socket.io'
import redisAdapter from 'socket.io-redis'
import Redis from '../redis/Redis';
import { WebSocketTokenOpt } from '../interface/Websocket.interface';

// const io = socketIo({
//     pingTimeout: 2000,
//     pingInterval: 4000
// })

let opt:any = {cors:true};
let io = new Server(opt);

var inited = false;
function init(webSocketTokenOpt?:WebSocketTokenOpt) {
    if (inited)
        return;
    inited = true;
    const pub = Redis.get()
    const sub = Redis.get()
    if(pub != null && sub != null){
        io.adapter(redisAdapter.createAdapter({
            pubClient: pub,
            subClient: sub
        }))
    }

    io.use(async function(socket,next){

        if (webSocketTokenOpt != null && webSocketTokenOpt.needCheckToken) {
            if (socket.handshake.auth.messageToken == null) {
                next(new Error('Authentication error not exist messageToken'));
            }

            try {
                const tokenInfo  = await webSocketTokenOpt.checkTokenFunc(socket.handshake.auth.messageToken,socket)
                if (tokenInfo.error != null) {
                    next(new Error('Authentication error message ' + tokenInfo.error.message));
                }

                next()
            }
            catch(e) {
                next(new Error('Authentication error message ' + e.message));
            }


        }else{
            next();
        }
    })
    io.on('connection', (socket) => {

        console.log('on connection');
        // 如果解析处理token的room_id不为null，加入房间
        if (socket.handshake.auth.room_id != null) {
            console.log(`${socket.id} 加入房间${socket.handshake.auth.room_id }`)
            socket.join(socket.handshake.auth.room_id)
        }


        /**
         * {
         *  room :'aaa'
         * }
         */
        socket.on('joinRoom',function(data){
            socket.join(data.room)
        })

        socket.on('levelRoom',function(data){
            socket.leave(data.room)
        })
        console.log('after connection');
    })
    
}

var Socket = {
    emitAll:function(event:string,param){
        init()
        io.sockets.emit(event,param);
    },
	/**
     * 发送消息
     * @param room 房间号 
     * @param event 
     * @param param 
     */
    emit:async function (room:string, event:string, param?) {
        init();
        
      
        io.to(room).emit(event,param)
        
        
    },
  
	/**
	server.js调用
	*/
    listen: function (server,webSocketOpt?:any,webSocketTokenOpt?:WebSocketTokenOpt) {

        if (webSocketOpt == null) {
            webSocketOpt = {
                pingInterval: 10000,
                pingTimeout: 5000,
                cookie: false
            }
        }
        
        init(webSocketTokenOpt);
        io.attach(server, webSocketOpt);
        
    },
    getSocket: function (id) {
        return io.sockets.sockets[id]
    }
}

export default Socket;