
export default abstract class BaseUploadState{
    protected _wiget:UploadWiget
    abstract add(line:Buffer);
    constructor(wiget:UploadWiget){
        this._wiget = wiget;
    }
}
import UploadWiget from '../UploadWiget'
