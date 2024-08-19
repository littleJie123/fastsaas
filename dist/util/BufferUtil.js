"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 处理buffer的信息
 */
class default_1 {
    static pipe(readable, writeable, end = true) {
        return new Promise((resolve, reject) => {
            readable.on('data', data => {
                // 每一个data都是一个Buffer对象
                writeable.write(data);
            });
            readable.on('error', err => {
                reject();
            });
            readable.on('end', () => {
                if (end) {
                    writeable.end();
                }
                resolve();
            });
        });
    }
    static streamToBuffer(stream) {
        return new Promise((resolve, reject) => {
            const bufferList = [];
            stream.on('data', data => {
                // 每一个data都是一个Buffer对象
                bufferList.push(data);
            });
            stream.on('error', err => {
                reject();
            });
            stream.on('end', () => {
                resolve(Buffer.concat(bufferList));
            });
        });
    }
}
exports.default = default_1;
