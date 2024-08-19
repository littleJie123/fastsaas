export default interface ISocketProcessor {
    /**
     * websocket 链接的时候启动
     * @param ws
     */
    onConnection(ws: any): any;
}
