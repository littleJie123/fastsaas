import SqlToken from "../SqlToken";

export default class extends SqlToken{
  isEnd(c: string): boolean {
    return true;
  }
  
}