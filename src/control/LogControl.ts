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
    const log = ConfigFac.get('log');
    const filePath = log.filePath;
    if (filePath == null || this._param.day == null) {
      throw new Error('Log file path or day parameter is not configured.');
    }

    const fileInfo = await this.findLogFile(filePath);
    if (fileInfo == null) {
      throw new Error(`Log file for day ${this._param.day} not found.`);
    }

    const check = (json: any) => this.checkJson(json);
    let array: any[];

    if (fileInfo.isGzipped) {
      // For gzipped files, we have to stream from the beginning.
      // This will read the whole file, filter matching lines, and return the last 200.
      const fileStream = fs.createReadStream(fileInfo.path).pipe(zlib.createGunzip());
      array = await this.readLinesFromStart(fileStream, check);
    } else {
      // For plain text files, read from the end for performance.
      array = await this.readLinesBackwards(fileInfo.path, check);
    }

    return { array };
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
   * Finds the log file, preferring .log over .log.gz.
   * @param dirPath The directory containing log files.
   * @returns An object with the file path and a flag indicating if it's gzipped, or null if not found.
   */
  private async findLogFile(dirPath: string): Promise<{ path: string; isGzipped: boolean } | null> {
    const logPath = path.join(dirPath, `log${this._param.day}.log`);
    const gzPath = path.join(dirPath, `log${this._param.day}.log.gz`);

    try {
      await fs.promises.access(logPath);
      return { path: logPath, isGzipped: false };
    } catch (error) {
      try {
        await fs.promises.access(gzPath);
        return { path: gzPath, isGzipped: true };
      } catch (gzError) {
        return null;
      }
    }
  }

  /**
   * Reads a stream line by line from the beginning. Used for gzipped files.
   * It uses a fixed-size buffer to store only the last 200 matching lines, preventing OOM.
   */
  private async readLinesFromStart(fileStream: Readable, check: (json: any) => boolean): Promise<any[]> {
    const MAX_LINES = 200;
    const buffer: any[] = new Array(MAX_LINES);
    let lineCount = 0;

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    for await (const line of rl) {
      try {
        const json = JSON.parse(line);
        if (check(json)) {
          // Use the array as a circular buffer
          buffer[lineCount % MAX_LINES] = json;
          lineCount++;
        }
      } catch (e) {
        // Ignore invalid JSON lines
      }
    }

    // Reorder the results from the circular buffer
    const result: any[] = [];
    const count = Math.min(lineCount, MAX_LINES);
    const start = lineCount > MAX_LINES ? (lineCount % MAX_LINES) : 0;

    for (let i = 0; i < count; i++) {
      result.push(buffer[(start + i) % MAX_LINES]);
    }

    // The result is now ordered from oldest to newest among the last 200 matches.
    // Reverse it to show the absolute newest logs first.
    return result.reverse();
  }

  /**
   * Reads a file line by line from the end. Used for plain text .log files.
   * Stops after finding 200 matching lines. This is memory-efficient for large files.
   */
  private async readLinesBackwards(filePath: string, check: (json: any) => boolean): Promise<any[]> {
    const result: any[] = [];
    const CHUNK_SIZE = 65536; // 64KB
    let fileHandle;

    try {
      fileHandle = await fs.promises.open(filePath, 'r');
      const stats = await fileHandle.stat();
      let position = stats.size;
      let leftover = '';

      while (position > 0 && result.length < 200) {
        const readLength = Math.min(CHUNK_SIZE, position);
        const currentPos = position - readLength;
        
        const buffer = Buffer.alloc(readLength);
        const { bytesRead } = await fileHandle.read(buffer, 0, readLength, currentPos);
        position = currentPos;

        if (bytesRead === 0) continue;

        const chunk = buffer.toString('utf-8', 0, bytesRead);
        const lines = (chunk + leftover).split(/\r?\n/);
        
        const firstLinePartial = position > 0;
        leftover = firstLinePartial && lines.length > 0 ? lines.shift()! : '';

        for (let i = lines.length - 1; i >= 0; i--) {
          if (result.length >= 200) {
            break;
          }
          const line = lines[i];
          if (line) {
            try {
              const json = JSON.parse(line);
              if (check(json)) {
                result.push(json);
              }
            } catch (e) {
              // Ignore invalid JSON lines
            }
          }
        }
      }
    } finally {
      if (fileHandle) {
        await fileHandle.close();
      }
    }
    return result;
  }
}