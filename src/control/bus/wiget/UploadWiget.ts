import Wiget from './../../../bus/Wiget';
import Buffers from './../../../buffers/Buffers';

export default class UploadWiget extends Wiget{
     _buffers:Buffers;
     _name:string;
     _filename:string;
     _state:BaseUploadState

    
    getBuffers(){
        if(this._buffers == null){
            this._buffers = new Buffers()
        }
        return this._buffers;
    }
    addBuffer(buffer:Buffer|string){
        this.getBuffers().add(buffer);
    }
    _onBind () {
        this.on(new AskFile());
        this.on(new AskParam());
    
    }
    isFile(){
        return this._filename != null;
    }
    getValue(){
        var buffers = this.getBuffers();
        if(this.isFile() && this._name!=null){
            let buffer = buffers.toBuffer();
            return buffer
            
        }else{
            return buffers.toString();
        }
    }
    askFile(event){
        if(this.isFile() && this._name!=null){
            event.add(this._name,new UploadFile({
                filename:this._filename,
                buffer:this.getValue()
            }));
        }
    }
    askParam(event):any{
        if(!this.isFile() && this._name!=null){
            event.add(this._name,this.getValue());
        }
    }
    add(line){
        this.acqState().add(line);
    }
    acqState(){
        if(this._state == null){
          this._state = new Heading(this);
        }
        return this._state;
    }

    
}
import AskFile from '../event/AskFile'
import AskParam from '../event/AskParam'
import UploadFile from '../UploadFile';

import Heading from './state/Heading'
import BaseUploadState from './state/BaseUploadState';

