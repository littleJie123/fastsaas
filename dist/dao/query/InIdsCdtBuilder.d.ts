import { Cdt } from "./cdt/imp";
/**
 * 查询关联表的时候，聚合多个id的查询，避免多个in查询
 */
export default class InIdsCdtBuilder {
    private col;
    private ids;
    constructor(col: string);
    addIds(ids: number[]): void;
    build(): Cdt;
}
