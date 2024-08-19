/// <reference types="node" />
import Wiget from './../../../bus/Wiget';
import Buffers from './../../../buffers/Buffers';
export default class UploadWiget extends Wiget {
    _buffers: Buffers;
    _name: string;
    _filename: string;
    _state: BaseUploadState;
    getBuffers(): Buffers;
    addBuffer(buffer: Buffer | string): void;
    _onBind(): void;
    isFile(): boolean;
    getValue(): string | Buffer;
    askFile(event: any): void;
    askParam(event: any): any;
    add(line: any): void;
    acqState(): BaseUploadState;
}
import BaseUploadState from './state/BaseUploadState';
