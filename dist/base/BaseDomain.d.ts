import Context from "../context/Context";
export default abstract class BaseDomain {
    protected _context: Context;
    setContext(context: Context): void;
    getContext(): Context;
}
