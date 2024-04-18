import DiacriticToken from "./imp/DiacriticToken";
import LettleToken from "./imp/LettleToken";
import OtherToken from "./imp/OtherToken";
import QuoteToken from "./imp/QuoteToken";
import WhiteSpaceToken from "./imp/WhiteSpaceToken";
import SqlToken from "./SqlToken";
import SqlTokenUtil from "./SqlTokenUtil";

export default class {
  /**
   * 命中标准的
   * @param char 
   */
  static hit(char:string):SqlToken{
    if(SqlTokenUtil.isDiacritic(char)){ 
      return new DiacriticToken();
    }

    if(SqlTokenUtil.isSingleQuote(char) || SqlTokenUtil.isDoubleQuote(char)){
      return new QuoteToken();
    }

    if(SqlTokenUtil.isLetter(char)){
      return new LettleToken();
    }

    if(SqlTokenUtil.isSpace(char)){
      return new WhiteSpaceToken();
    }
    return new OtherToken();
  }
}