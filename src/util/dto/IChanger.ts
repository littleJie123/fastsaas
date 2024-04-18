export default interface IChanger {
    /**
     * 源头
     */
    src?:string;

    /**
     * 处理源头的function
     */
    srcFun?:Function;
    /**
     * 目标
     */
    target?:string;

    /**
     * 反转的时候用
     */
    targetFun?:Function;

    defVal?:any;
    
    /**
     * 处理数组
     */
    array?:{
        changes?:IChanger[];
        /**
         * 过滤器
         */
        filter?:any;
        /**
         * 默认值
         */
        vals?:any;
    }
} 