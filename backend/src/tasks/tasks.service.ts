import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ForbiddenException } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: EntityRepository<Task>,
    private readonly em: EntityManager,
  ) {}

  async create(dto: CreateTaskDto, currentUser: User): Promise<Task> { 
    const task = this.taskRepo.create({ ...dto, user: this.em.getReference(User, currentUser.id) });
    await this.taskRepo.getEntityManager().persistAndFlush(task);
    return task;
  }

  async findAll(currentUser: User): Promise<Task[]> {
    if (currentUser.isAdmin) {
      return this.taskRepo.findAll();
    }
    return this.taskRepo.find({ user: this.em.getReference(User, currentUser.id) });
  }

  async findOne(id: number, currentUser: User): Promise<Task> {
    const task = await this.taskRepo.findOneOrFail(id, { populate: ['user'] });
    this.checkOwnership(task, currentUser);
    return this.removeUserProp(task);
  }

  async update(id: number, dto: UpdateTaskDto, currentUser: User): Promise<Task> {
    const task = await this.findOne(id, currentUser);
    Object.assign(task, dto);
    task.updatedAt = new Date(); 
    await this.taskRepo.getEntityManager().flush();
    return this.removeUserProp(task);
  }

  async remove(id: number, currentUser: User): Promise<Task> {
const task = await this.findOne(id, currentUser);
  await this.taskRepo.getEntityManager().nativeDelete(Task, { id });
  return task;
  }

  private checkOwnership(task: Task, currentUser: User) {
    if (task.user.id !== currentUser.id && !currentUser.isAdmin) {
      throw new ForbiddenException('You can only access your own tasks');
    }
  }

    private removeUserProp<T extends Record<string, any>>(obj: T): T {
    if (Array.isArray(obj)) {
      return obj.map(item => this.removeUserProp(item)) as any;
    }

    const { user, ...rest } = obj;
    return rest as T;
  }
}
