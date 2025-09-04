import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepo: EntityRepository<User>,
  ) {}

  async register(username: string, password: string): Promise<User> {
    const existing = await this.userRepo.findOne({ username });
    if (existing) throw new BadRequestException('Username already exists');

    const user = this.userRepo.create({
        username, password,
        isAdmin: false
    });
    await user.hashPassword();
    await this.userRepo.getEntityManager().persistAndFlush(user);
    return user;
  }

  async login(username: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.userRepo.findOne({ username });
    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, username: user.username, isAdmin: user.isAdmin };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async updateProfile(userId: number, newUsername?: string, newPassword?: string): Promise<User> {
    const user = await this.userRepo.findOneOrFail(userId);
    if (newUsername) {
      const existing = await this.userRepo.findOne({ username: newUsername });
      if (existing && existing.id !== userId) throw new BadRequestException('Username taken');
      user.username = newUsername;
    }
    if (newPassword) {
      user.password = newPassword;
      await user.hashPassword();
    }
    await this.userRepo.getEntityManager().flush();
    return user;
  }
}