import Control from "./Control";

export default abstract class extends Control {

  abstract getControl(): any;

  protected async doExecute(req, resp) {
    let control = this.getControl();
    let context = this._context;
    control.setContext(context);
    context.assembly([control]);
    let param = {
      ... this._param,
      _shareData: null
    };
    control._param = param;
    return await control.executeParam(param, req, resp);
  }
}