import { Cdt, ConfigFac } from "../fastsaas";
import Control from "./Control";
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import * as readline from 'readline';
import { Readable } from 'stream';

interface LogCdt {
  op: string;
  value?: any;
  col: string;
}

interface LogParam {
  day: string;
  cdts: LogCdt[]
}

/**
 * 查询日志文件
 */
export default class LogControl extends Control<LogParam> {
  private cdts: Cdt[];
  _getLogger() {
    return null;
  }
  protected async doExecute(req?: Request, resp?: Response): Promise<any> {

    let log = ConfigFac.get('log')
    let filePath = log.filePath;
    if (filePath == null || this._param.day == null) {
      throw new Error('文件不存在');
    }
    let fileStream = await this.readFileStream(filePath);
    if (fileStream == null) {
      throw new Error('文件不存在');
    }
    return {
      array: await this.readLines(fileStream, (json) => this.checkJson(json))
    };
  }

  private getCdts() {
    if (this._param.cdts == null || this._param.cdts.length == 0) {
      return [];
    }
    if (this.cdts == null) {
      this.cdts = this._param.cdts.map(logCdt => {
        return new Cdt(logCdt.col, logCdt.value, logCdt.op)
      })
    }
    return this.cdts;
  }
  private checkJson(json: any) {
    let cdts = this.getCdts();

    for (let cdt of cdts) {
      if (!cdt.isHit(json)) {
        return false;
      }
    }
    return true;
  }

  /**
   * 读取文件流 文件名为 `${filePath}/log${param.day}.log`或者`${filePath}/log${param.day}.log.gz`
   * 程序中需要先查询扩展名为log的，如果没有则查询扩展名为gz的文件
   * @param filePath 
   */
  private async readFileStream(filePath: string): Promise<Readable> {
    const logPath = path.join(filePath, `log${this._param.day}.log`);
    const gzPath = path.join(filePath, `log${this._param.day}.log.gz`);

    try {
      await fs.promises.access(logPath);
      return fs.createReadStream(logPath);
    } catch (error) {
      // .log file doesn't exist, try .gz
      try {
        await fs.promises.access(gzPath);
        const fileStream = fs.createReadStream(gzPath);
        return fileStream.pipe(zlib.createGunzip());
      } catch (gzError) {

        return null;
      }
    }
  }

  /**
   * 逐行读取日志记录，每一行都是一个合法的json字符串，
   * 如果找到符合条件的200条则直接返回。
   * 读完文件也返回
   * @param fileStream 
   * @param check 
   */
  private async readLines(fileStream: Readable, check: (json: any) => boolean): Promise<any[]> {
    const result: any[] = [];
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    for await (const line of rl) {
      if (result.length >= 200) {
        rl.close();
        fileStream.destroy(); // Stop reading the underlying stream
        break;
      }

      try {
        const json = JSON.parse(line);
        if (check(json)) {
          result.push(json);
        }
      } catch (e) {
        // Ignore lines that are not valid JSON
      }
    }
    return result;
  }

}