import { Migration } from '@mikro-orm/migrations';

export class Migration20250904154103_tasks extends Migration {

  override async up(): Promise<void> {
    this.addSql(`
      create table \`task\` (
        \`id\` int unsigned not null auto_increment primary key,
        \`title\` varchar(255) not null,
        \`description\` varchar(255) null,
        \`completed\` tinyint(1) not null default false,
        \`created_at\` datetime not null,
        \`updated_at\` datetime null,
        \`user_id\` int unsigned not null,
        constraint \`fk_task_user\` foreign key (\`user_id\`) references \`user\` (\`id\`) on update cascade on delete cascade
      ) default character set utf8mb4 engine = InnoDB;
    `);
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists `task`;');
  }
}
