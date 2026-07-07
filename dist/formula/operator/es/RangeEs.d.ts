import EsOp from './EsOp';
export default class RangeEs extends EsOp {
    protected getOp(): string;
    protected getTerm(col?: string, val?: any): string;
    toEs(col: string, val?: any): {
        [x: string]: {
            [col]: {
                [x: string]: any;
            };
        };
    };
}
