"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayUtil_1 = require("../ArrayUtil");
it('testMerge', () => {
    let array = [
        { date: 'aaa', cnt: 10 },
        { date: 'aaa', cnt: 12 },
        { date: 'bbb', cnt: 1 },
        { date: 'bbb', cnt: 2 },
        { date: 'bbb', cnt: 3 },
        { date: 'aaa', cnt: 4 },
        { date: 'aaa', cnt: 5 },
    ];
    let list = ArrayUtil_1.ArrayUtil.merge(array, {
        isHit(obj1, obj2) {
            return obj1.date == obj2.date;
        },
        addObj(obj1, obj2) {
            return {
                date: obj1.date,
                cnt: obj1.cnt + obj2.cnt
            };
        }
    });
    console.log(list);
});
