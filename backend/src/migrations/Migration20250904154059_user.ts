import { Migration } from '@mikro-orm/migrations';

export class Migration20250904154059_user extends Migration {

 override async up(): Promise<void> {
    this.addSql(`
      create table \`user\` (
        \`id\` int unsigned not null auto_increment primary key,
        \`username\` varchar(255) not null unique,
        \`password\` varchar(255) not null,
        \`is_admin\` tinyint(1) not null default false,
        \`created_at\` datetime not null
      ) default character set utf8mb4 engine = InnoDB;
    `);
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists `user`;');
  }
}
