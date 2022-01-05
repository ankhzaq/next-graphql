"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220105044210 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220105044210 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "post" ("id" serial primary key, "created_at" timestamptz(0) not null default \'NOW()\', "update_at" timestamptz(0) not null, "title" text not null);');
    }
}
exports.Migration20220105044210 = Migration20220105044210;
//# sourceMappingURL=Migration20220105044210.js.map