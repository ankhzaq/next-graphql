import { Migration } from '@mikro-orm/migrations';

export class Migration20220108044920 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" rename column "update_at" to "updated_at";');


    this.addSql('alter table "user" drop constraint if exists "user_password_check";');
    this.addSql('alter table "user" alter column "password" type text using ("password"::text);');

    this.addSql('alter table "post" rename column "update_at" to "updated_at";');
  }

}
