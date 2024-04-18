import SqlToken from "../SqlToken";
import SqlTokenUtil from "../SqlTokenUtil";

export default class extends SqlToken {
  isEnd(c: string): boolean {
    return !SqlTokenUtil.isSpace(c)
  }
}