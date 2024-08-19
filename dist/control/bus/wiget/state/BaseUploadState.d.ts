/// <reference types="node" />
export default abstract class BaseUploadState {
    protected _wiget: UploadWiget;
    abstract add(line: Buffer): any;
    constructor(wiget: UploadWiget);
}
import UploadWiget from '../UploadWiget';
