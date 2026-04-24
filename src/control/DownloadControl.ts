import { DownloadUtil } from "../fastsaas";
import Control from "./Control";

export default abstract class <Param = any> extends Control<Param> {
  abstract getFileName(): string;

  protected _sendResp(resp: any, ret: any): void {
    if (ret == null) {
      super._sendResp(resp, null);
      return;
    }
    let buffer = ret;
    if (ret.toBuffer) {
      buffer = ret.toBuffer()
    }
    DownloadUtil.downloadExcel(resp, this.getFileName(), buffer);
  }
}