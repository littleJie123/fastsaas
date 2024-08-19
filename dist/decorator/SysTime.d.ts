/**
 * 在上下文注册builder
 */
interface SysTimeOpt {
    addCol?: string;
    updateCol?: string;
    /**
     *   是否需要时区修正
     */
    needTimezone?: boolean;
}
export default function (opt?: SysTimeOpt): Function;
export {};
