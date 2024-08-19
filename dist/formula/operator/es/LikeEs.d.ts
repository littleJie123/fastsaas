import EsOp from './EsOp';
export default class LikeEs extends EsOp {
    protected getTerm(col?: string, val?: any): string;
    toEs(col: string, val?: any): {
        wildcard: {
            [x: string]: any;
        };
    };
}
