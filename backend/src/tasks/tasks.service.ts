import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: EntityRepository<Task>,
    private readonly em: EntityManager,
  ) {}

  async create(dto: CreateTaskDto) {
    const task = this.taskRepo.create({
      ...dto,
      completed: false,
      createdAt: new Date(),
    });
    await this.em.persistAndFlush(task);
    return task;
  }

  findAll() {
    return this.taskRepo.findAll();
  }

  async findOne(id: number) {
    const task = await this.taskRepo.findOne({ id });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: number, dto: UpdateTaskDto) {
    const task = await this.findOne(id);
    this.taskRepo.assign(task, dto);
    await this.em.flush();
    return task;
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    await this.em.removeAndFlush(task);
    return { deleted: true };
  }
}
