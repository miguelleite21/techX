import { Migration } from '@mikro-orm/migrations';

export class Migration20250904141133_tasks extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`task\` (\`id\` int unsigned not null auto_increment primary key, \`title\` varchar(255) not null, \`description\` varchar(255) null, \`completed\` tinyint(1) not null default false, \`created_at\` datetime not null, \`updated_at\` datetime null) default character set utf8mb4 engine = InnoDB;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`task\`;`);
  }

}
