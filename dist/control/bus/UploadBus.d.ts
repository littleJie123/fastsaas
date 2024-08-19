import AsyncBus from './../../bus/AsyncBus';
import Buffers from './../../buffers/Buffers';
export default class UploadBus extends AsyncBus {
    private _wiget;
    process(buffers: Buffers): Promise<{
        param: any;
        files: any;
    }>;
    add(line: any): void;
    _closeWiget(): void;
    getWiget(): UploadWiget;
}
import UploadWiget from './wiget/UploadWiget';
