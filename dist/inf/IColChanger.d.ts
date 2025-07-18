export default interface IColChanger {
    /**
     * srcCol 和 targetcol是一对，
     */
    srcCol?: string;
    targetCol?: string;
    /**
     * 直接进行转换
     * @param data1
     * @param data2
     */
    change?(src: any, target: any): any;
}
