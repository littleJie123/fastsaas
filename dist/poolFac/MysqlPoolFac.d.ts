import BasePoolFac from './../pool/BasePoolFac';
import { BaseOption } from '../pool/poolOptions';
interface MySqlOption extends BaseOption {
    user: string;
}
declare class MysqlPoolFac extends BasePoolFac {
    getType(): string;
    _needNoType(): boolean;
    protected _formatConnectOption(config: BaseOption): MySqlOption;
    protected createPool(config: any): any;
}
declare const _default: MysqlPoolFac;
export default _default;
