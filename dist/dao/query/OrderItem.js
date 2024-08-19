"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sql_1 = require("../sql");
class OrderItem {
    constructor(col, desc) {
        this.col = col;
        if (desc != 'desc' && desc != 'DESC') {
            this.desc = null;
        }
        else {
            this.desc = 'desc';
        }
    }
    getCol() {
        return this.col;
    }
    getDesc() {
        if (this.desc == null) {
            this.desc = 'asc';
        }
        return this.desc;
    }
    toSql(colChanger) {
        const sql = new sql_1.Sql();
        let col = this.col;
        if (colChanger != null) {
            col = colChanger.parsePojoField(col);
        }
        sql.add(new sql_1.ColSql(col));
        sql.add(this.desc);
        return sql;
    }
}
exports.default = OrderItem;
