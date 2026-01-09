/**
 * 请求接口的数据包
 */

export default interface IActionMsg {
  url: string;
  param: any;
  id?: number;
}