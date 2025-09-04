import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  username!: string;

  @Property({ hidden: true }) 
  password!: string;

  @Property({ default: false })
  isAdmin: boolean = false;

  @Property({ onCreate: () => new Date() })
  createdAt?: Date = new Date();

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}