declare var FileUtil: {
    each: (src: string, fun: (str: string) => void, checkFun?: Function) => void;
};
export default FileUtil;
