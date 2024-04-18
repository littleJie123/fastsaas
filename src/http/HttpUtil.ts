import JsonGetHttp from './imp/JsonGetHttp';
import JsonPostHttp from './imp/JsonPostHttp';
import JsonPutHttp from './imp/JsonPutHttp';
import JsonDeleteHttp from './imp/JsonDeleteHttp';
import HttpResult from './HttpResult'

export default class {
  static async get(url: string, param?: any, headers?: any) {
    let jsonHtpp = new JsonGetHttp({ url, headers });
    if (param == null)
      param = {};

    return await jsonHtpp.submit(param);
  }

  static async post(url: string, param?: any, headers?: any) {
    let jsonHtpp = new JsonPostHttp({ url, headers });
    if (param == null)
      param = {};

    return await jsonHtpp.submit(param);
  }

  static async put(url: string, param?: any, headers?: any) {
    let jsonHtpp = new JsonPutHttp({ url, headers });
    if (param == null)
      param = {};

    return await jsonHtpp.submit(param);
  }

  static async delete(url: string, param?: any, headers?: any) {
    let jsonHtpp = new JsonDeleteHttp({ url, headers });
    if (param == null)
      param = {};

    return await jsonHtpp.submit(param);
  }

  static async getH(url: string, param?: any, headers?: any): Promise<HttpResult> {
    let jsonHtpp = new JsonGetHttp({ url, headers });
    if (param == null)
      param = {};

    return await jsonHtpp.submitReturnWithHeaders(param);
  }

  static async postH(url: string, param?: any, headers?: any): Promise<HttpResult> {
    let jsonHtpp = new JsonPostHttp({ url, headers });
    if (param == null)
      param = {};

    return await jsonHtpp.submitReturnWithHeaders(param);
  }

  static async putH(url: string, param?: any, headers?: any): Promise<HttpResult> {
    let jsonHtpp = new JsonPutHttp({ url, headers });
    if (param == null)
      param = {};

    return await jsonHtpp.submitReturnWithHeaders(param);
  }

  static async deleteH(url: string, param?: any, headers?: any): Promise<HttpResult> {
    let jsonHtpp = new JsonDeleteHttp({ url, headers });
    if (param == null)
      param = {};

    return await jsonHtpp.submitReturnWithHeaders(param);
  }
}