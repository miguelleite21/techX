import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { ApiTags, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Post()
  @ApiBody({ type: CreateTaskDto, description: 'Data to create a new task' })
  @ApiResponse({ status: 201, description: 'Task successfully created', type: Task })
  create(@Body() dto: CreateTaskDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of all tasks', type: [Task] })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task returned successfully', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', description: 'ID of the task to update' })
  @ApiBody({ type: UpdateTaskDto, description: 'Data to update the task' })
  @ApiResponse({ status: 200, description: 'Task successfully updated', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'ID of the task to delete' })
  @ApiResponse({ status: 200, description: 'Task successfully deleted', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
