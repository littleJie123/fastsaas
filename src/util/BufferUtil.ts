import { Readable, Writable } from "stream"

/**
 * 处理buffer的信息
 */
export default class {

    static pipe(readable:Readable,writeable:Writable,end:boolean  = true):Promise<void>{
        return new Promise((resolve,reject)=>{
            
            readable.on('data', data => {
                // 每一个data都是一个Buffer对象
                writeable.write(data);
            })
            readable.on('error', err => {
                reject()
            })
            readable.on('end', () => {
                if(end){
                    writeable.end();
                }
                resolve()
            })
        })
    }
    static  streamToBuffer(stream):Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const bufferList = []
            stream.on('data', data => {
                // 每一个data都是一个Buffer对象
                bufferList.push(data)
            })
            stream.on('error', err => {
                reject()
            })
            stream.on('end', () => {
                resolve(Buffer.concat(bufferList))
            })
        })
    }
}   