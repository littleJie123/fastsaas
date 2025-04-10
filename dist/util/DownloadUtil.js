"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 下载的工具类
 */
class default_1 {
    /**
     * 下载excel
     * @param res
     * @param fileName
     * @param data
     */
    static downloadExcel(res, fileName, data) {
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}.xlsx"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        // 发送响应
        res.send(data);
    }
}
exports.default = default_1;
