import { Context } from "../fastsaas"
import BaseLinkOpt from "./BaseLinkOpt"
import LinkCdtImp from "./LinkCdtImp"

export default interface AndCdtGeterOpt extends BaseLinkOpt{
  impsMap:{
    [key:string]:LinkCdtImp
  }

  
}