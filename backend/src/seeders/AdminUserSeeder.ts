import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User } from '../auth/entities/user.entity';

export class AdminUserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const existingAdmin = await em.findOne(User, { username: 'admin' });
    if (existingAdmin) {
      return;
    }

    const admin = em.create(User, {
      username: 'admin',
      password: 'admin',
      isAdmin: true,
      createdAt: new Date(),
    });

    await admin.hashPassword();
    await em.persistAndFlush(admin);
  }
}