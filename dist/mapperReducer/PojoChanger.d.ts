export default class PojoChanger<Pojo = any> {
    oldPojo: Pojo;
    newPojo: Pojo;
    constructor(oldPojo: Pojo, newPojo: Pojo);
    getChangeValue(key: string): number;
    static sum(list: PojoChanger[], key: string): number;
    static sumObj(list: PojoChanger[], keys: string[]): any;
}
