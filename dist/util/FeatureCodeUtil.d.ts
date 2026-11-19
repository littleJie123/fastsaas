interface FeatureCodeOpt {
    pkCol: string;
    cols?: string[];
}
export default class FeatureCodeUtil {
    /**
     * 计算写入库的特征码。先算明文，再做 md5，结果是 32 位十六进制。
     * 没有行时明文为空字符串，特征码是空字符串的 md5，不返回 null。
     */
    static buildCode(list: any[], opt: FeatureCodeOpt): string;
    /**
     * 计算特征码明文。
     * 按 pkCol 升序后，把主键和 cols 拼成字符串。没有行时返回空字符串。
     * 数字先格式化成 6 位小数，避免 3.9999999999 和 4 编出不同的明文。
     */
    static buildPlain(list: any[], opt: FeatureCodeOpt): string;
    /**
     * 按明文计算 md5，十六进制，长度 32。
     */
    static encrypt(plain: string): string;
    /**
     * 数字收成固定小数再转文本。空值返回空字符串。
     */
    private static formatCell;
}
export {};
