/**
 * 下载的工具类
 */
export default class {
  /**
   * 下载excel
   * @param res 
   * @param fileName 
   * @param data 
   */
  static downloadExcel(res,fileName:string, data:Buffer){
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // 发送响应
    res.send(data);
  }
}